// private/uploader.js
// Collects trial rows from PsychoJS and posts a CSV to Cloudflare Pages Function at /api/ingest.
// Requires: private/config.js to be loaded first.

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
      // Called by the experiment after DlgFromDict validation
      state.student = (student || "").toString();
      state.week = (week || "").toString();
    },

    patchExperiment(psychoJS){
      try {
        const eh = psychoJS?.experiment;
        if (!eh) return;

        // Remember expInfo for fallback week/student
        const expInfo = psychoJS?.expInfo || psychoJS?.experiment?.extraInfo || {};

        const origAddData = eh.addData.bind(eh);
        const origNextEntry = eh.nextEntry.bind(eh);

        eh.addData = function(key, val){
          // mirror original behavior
          origAddData(key, val);
          // collect for this pending row
          state._pending[key] = val;
        };

        eh.nextEntry = function(snapshot){
          // If a trial just ended (valid response), required fields will exist.
          const hasTrialishFields =
            ("response_raw" in state._pending) ||
            ("accuracy" in state._pending) ||
            ("topic" in state._pending) ||
            ("prompt_text" in state._pending);

          if (hasTrialishFields) {
            const stamp = new Date().toISOString();

            // ensure identity fields
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
          }

          // clear pending map for next entry
          state._pending = Object.create(null);
          return origNextEntry(snapshot);
        };

      } catch(e){
        console.warn("[CHEM112_PRIVATE] patchExperiment failed:", e);
      }
    },

    async onQuit(){
      if (CFG.UPLOAD_ON_QUIT === false) {
        console.log("[CHEM112_PRIVATE] Upload disabled by config.");
        return { ok:false, skipped:true };
      }
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
