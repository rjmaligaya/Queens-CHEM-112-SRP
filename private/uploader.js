// Minimal uploader & CSV builder that monkey-patches PsychoJS ExperimentHandler
(function(){
  const cfg = window.CHEM112_CONFIG || {};
  const state = {
    currentRow: {},
    rows: [],
    columns: [],   // first-seen order
    expInfo: null
  };

  function addColumn(key){
    if (!state.columns.includes(key)) state.columns.push(key);
  }

  function setCell(key, value){
    addColumn(key);
    state.currentRow[key] = (value === undefined || value === null) ? '' : String(value);
  }

  // Resolve endpoint based on config and host
  function resolveEndpoint(){
    const choice = (cfg.ENDPOINT || 'auto').toLowerCase();
    if (choice === 'node')   return cfg.ENDPOINTS.node;
    if (choice === 'php')    return cfg.ENDPOINTS.php;
    if (choice === 'netlify')return cfg.ENDPOINTS.netlify;
    // auto: try node first, then php, then netlify (client will just POST; server availability is deployment-dependent)
    return cfg.ENDPOINTS.node;
  }

  // Construct CSV text with stable column order
  function buildCSV(){
    // Ensure student/week are included
    if (state.expInfo){
      addColumn('Student Number');
      addColumn('Week');
    }
    const header = state.columns.join(',');
    const lines = [header];
    for (const r of state.rows){
      // Merge expInfo augmentation
      let row = {...r};
      if (state.expInfo){
        row['Student Number'] = state.expInfo.studentNumber;
        row['Week'] = state.expInfo.week;
      }
      const values = state.columns.map(k => {
        let v = row[k];
        if (v === undefined || v === null) v = '';
        // Escape CSV
        v = String(v);
        if (/[",\n]/.test(v)) v = '"' + v.replace(/"/g,'""') + '"';
        return v;
      });
      lines.push(values.join(','));
    }
    return lines.join('\n');
  }

  async function postCSV(filename, csvText){
    const endpoint = resolveEndpoint();
    const body = JSON.stringify({
      filename,
      contentType: 'text/csv',
      data: csvText
    });
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    });
    if (!res.ok) throw new Error('Upload failed: ' + res.status);
    return res.json().catch(()=>({ok:true}));
  }

  // Public API exposed for the module script to call
  window.CHEM112_PRIVATE = {
    patchExperiment(psychoJS){
      const exp = psychoJS.experiment;
      if (!exp || exp.__chem112_patched) return;
      exp.__chem112_patched = true;

      const origAdd = exp.addData.bind(exp);
      const origNext = exp.nextEntry.bind(exp);

      exp.addData = function(key, val){
        try { setCell(key, val); } catch(e){ console.warn('[CHEM112] addData patch warn:', e); }
        return origAdd(key, val);
      };

      exp.nextEntry = function(){
        try {
          // finalize current row
          const snapshot = {...state.currentRow};
          state.rows.push(snapshot);
          state.currentRow = {};
        } catch(e){ console.warn('[CHEM112] nextEntry patch warn:', e); }
        return origNext();
      };

      console.log('[CHEM112] ExperimentHandler patched for private upload.');
    },

    setExpInfo(studentNumber, week){
      state.expInfo = { studentNumber, week };
    },

    async onQuitUploadIfCompleted(psychoJS, isCompleted){
      if (!isCompleted) return;
      // Validate fields
      const sn = (state.expInfo?.studentNumber || '').trim();
      const wk = String(state.expInfo?.week || '').trim();
      const digits = (cfg.REQUIRE_DIGITS|0) || 8;
      if (!/^\d+$/.test(sn) || sn.length !== digits){
        console.warn('[CHEM112] Not uploading: invalid student number.');
        return;
      }
      if (!cfg.ALLOWED_WEEKS || !cfg.ALLOWED_WEEKS.map(String).includes(wk)){
        console.warn('[CHEM112] Not uploading: invalid week.');
        return;
      }
      const csv = buildCSV();
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth()+1).padStart(2,'0');
      const dd = String(today.getDate()).padStart(2,'0');
      const filename = `CHEM112 SRP_${sn}_${wk}_${yyyy}-${mm}-${dd}.csv`;

      try {
        await postCSV(filename, csv);
        console.log('[CHEM112] Upload success:', filename);
      } catch(err){
        console.error('[CHEM112] Upload failed:', err);
      }
    }
  };
})();
