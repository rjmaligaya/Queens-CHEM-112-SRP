// private/uploader.js (HOTFIX v3 - commit-on-accuracy)
// Collects trial rows immediately when the experiment logs 'accuracy'.
// This avoids relying on nextEntry() timing.

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
    _pending: Object.create(null)
  };

  function getWeekFromExpInfo(expInfo) {
    const w = (expInfo?.['Week (4, 5, 6, 7, 8, or 10)'] ?? '').toString();
    const m = w.match(/\d+/);
    return m ? parseInt(m[0], 10) : "";
  }

  function toCSV(headers, rowArrays){
    const esc = (s) => ('"' + String(s ?? "").replaceAll('"','""') + '"');
    const head = headers.map(esc).join(',');
    const body = rowArrays.map(r => r.map(esc).join(',')).join('\n');
    return head + '\n' + (body ? body + '\n' : '');
  }

  function pushRowFromPending(expInfo){
    // Build a row only if we have 'topic' OR 'prompt_text' OR 'response_raw' OR 'accuracy'
    const hasTrialish = ('accuracy' in state._pending) || ('response_raw' in state._pending) ||
                        ('topic' in state._pending) || ('prompt_text' in state._pending);
    if (!hasTrialish) return false;
    const stamp = new Date().toISOString();
    const sn = state.student || (expInfo?.['Student Number'] ?? "");
    const wk = state.week || getWeekFromExpInfo(expInfo);
    const row = HEADERS.map(h => {
      switch(h){
        case "timestamp": return stamp;
        case "student_number": return sn;
        case "week": return wk;
        default: return (h in state._pending) ? state._pending[h] : "";
      }
    });
    state.rows.push(row);
    state._pending = Object.create(null);
    return true;
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

        const expInfo = psychoJS?.expInfo || psychoJS?.experiment?.extraInfo || {};

        const origAddData = eh.addData.bind(eh);
        const origNextEntry = eh.nextEntry.bind(eh);

        eh.addData = function(key, val){
          // keep original behavior
          origAddData(key, val);
          // stage values for current trial row
          state._pending[key] = val;

          // Commit as soon as the trial logs 'accuracy' (the last field in your script)
          if (key === 'accuracy') {
            pushRowFromPending(expInfo);
          }
        };

        // Keep this as a safety net: if a row wasn't committed yet, do it here.
        eh.nextEntry = function(snapshot){
          pushRowFromPending(expInfo);
          return origNextEntry(snapshot);
        };

      } catch(e){
        console.warn("[CHEM112_PRIVATE] patchExperiment failed:", e);
      }
    },

    // Called by experiment at quit time
    async onQuitUploadIfCompleted(psychoJS, isCompleted){
      if (CFG.UPLOAD_ON_QUIT === false) {
        console.log("[CHEM112_PRIVATE] Upload disabled by config.");
        return { ok:false, skipped:true };
      }
      if (!isCompleted) {
        console.log("[CHEM112_PRIVATE] Not completed; skipping upload.");
        return { ok:false, skipped:true, reason:"not_completed" };
      }
      try{
        // final safety flush
        pushRowFromPending(psychoJS?.expInfo || psychoJS?.experiment?.extraInfo || {});
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
