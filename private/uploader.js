
// private/uploader.js (HOTFIX v2)
// Adds pending-row flush on quit so rows aren't lost if nextEntry() wasn't called after last trial.

(function(){
  const CFG = (typeof window.CHEM112_CONFIG !== "undefined") ? window.CHEM112_CONFIG : {
    INGEST_URL: "/api/ingest",
    REQUIRE_DIGITS: 8,
    ALLOWED_WEEKS: [4,5,6,7,8,10],
    UPLOAD_ON_QUIT: true
  };

  const HEADERS = [
    "timestamp","student_number","week",
    "topic","subtype","item_id","image_file","prompt_text","correct_answer",
    "response_raw","response_norm","rt","accuracy"
  ];

  const state = {
    student: "",
    week: "",
    rows: [],
    _pending: Object.create(null),
    _expInfo: {}
  };

  function hasTrialishFields(map){
    return ("response_raw" in map) || ("accuracy" in map) ||
           ("topic" in map) || ("prompt_text" in map) || ("item_id" in map);
  }

  function getWeekFromExpInfo(expInfo) {
    const w = (expInfo?.['Week (4, 5, 6, 7, 8, or 10)'] ?? '').toString();
    const m = w.match(/\d+/);
    return m ? parseInt(m[0], 10) : "";
  }

  function pushRowFromPending(){
    if (!hasTrialishFields(state._pending)) return false;
    const stamp = new Date().toISOString();
    const sn = state.student || (state._expInfo?.['Student Number'] ?? "");
    const wk = state.week || getWeekFromExpInfo(state._expInfo);
    const row = HEADERS.map(h => {
      switch(h){
        case "timestamp": return stamp;
        case "student_number": return sn;
        case "week": return wk;
        default: return (h in state._pending) ? state._pending[h] : "";
      }
    });
    state.rows.push(row);
    return true;
  }

  function toCSV(headers, rowArrays){
    const esc = (s) => ('"' + String(s).replaceAll('"','""') + '"');
    const head = headers.map(esc).join(',');
    const body = rowArrays.map(r => r.map(esc).join(',')).join('\n');
    return head + '\n' + body + '\n';
  }

  async function uploadCSV(){
    if (!state.rows.length) return { ok:false, reason: "no_rows" };
    const url = (CFG.INGEST_URL || "/api/ingest")
      + `?student=${encodeURIComponent(state.student||"")}`
      + `&week=${encodeURIComponent(state.week||"")}`;
    const csv = toCSV(HEADERS, state.rows);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/csv" },
      body: csv
    });
    if (!res.ok) {
      let msg = "";
      try { msg = await res.text(); } catch(e){}
      throw new Error("Upload failed: " + res.status + " " + msg);
    }
    return await res.json();
  }

  window.CHEM112_PRIVATE = {
    setExpInfo(student, week){
      state.student = (student || "").toString();
      state.week = (week || "").toString();
    },

    patchExperiment(psychoJS){
      try {
        const eh = psychoJS?.experiment;
        if (!eh) return;

        state._expInfo = psychoJS?.expInfo || psychoJS?.experiment?.extraInfo || {};

        const origAddData = eh.addData.bind(eh);
        const origNextEntry = eh.nextEntry.bind(eh);

        eh.addData = function(key, val){
          origAddData(key, val);
          state._pending[key] = val;
        };

        eh.nextEntry = function(snapshot){
          // if a trial row is staged, convert it into a CSV row now
          pushRowFromPending();
          // clear pending map for next entry
          state._pending = Object.create(null);
          return origNextEntry(snapshot);
        };

      } catch(e){
        console.warn("[CHEM112_PRIVATE] patchExperiment failed:", e);
      }
    },

    async onQuitUploadIfCompleted(psychoJS, isCompleted){
      if (CFG.UPLOAD_ON_QUIT === false) {
        console.log("[CHEM112_PRIVATE] Upload disabled by config.");
        return { ok:false, skipped:true };
      }
      if (!isCompleted) {
        console.log("[CHEM112_PRIVATE] Not completed; skipping upload.");
        return { ok:false, skipped:true, reason:"not_completed" };
      }
      // Flush any pending trial row (PsychoJS may not call nextEntry before quit)
      try { pushRowFromPending(); } catch(_) {}

      try{
        const out = await uploadCSV();
        console.log("[CHEM112_PRIVATE] Upload result:", out);
        return out;
      } catch(err){
        console.error("[CHEM112_PRIVATE] Upload error:", err);
        return { ok:false, error: String(err) };
      }
    },

    _debug: { state, HEADERS }
  };
})();
