
// Minimal uploader & CSV builder for CHEM112 (improved fallback)
(function(){
  const cfg = window.CHEM112_CONFIG || {};
  const DEBUG = false; // set true to see logs in console

  const state = {
    currentRow: {},
    rows: [],
    columns: [],
    expInfo: null
  };

  function log(...args){ if (DEBUG) console.log('[CHEM112]', ...args); }
  function warn(...args){ if (DEBUG) console.warn('[CHEM112]', ...args); }

  function addColumn(key){
    if (!state.columns.includes(key)) state.columns.push(key);
  }

  function setCell(key, value){
    addColumn(key);
    state.currentRow[key] = (value === undefined || value === null) ? '' : String(value);
  }

  function resolveEndpoint(){
    const choice = (cfg.ENDPOINT || 'auto').toLowerCase();
    if (choice === 'node')   return cfg.ENDPOINTS.node;
    if (choice === 'php')    return cfg.ENDPOINTS.php;
    if (choice === 'netlify')return cfg.ENDPOINTS.netlify;
    return cfg.ENDPOINTS?.node || '/api/ingest';
  }

  function buildCSV(){
    // Ensure student/week are included
    if (state.expInfo){
      addColumn('Student Number');
      addColumn('Week');
    }
    const header = state.columns.join(',');
    const lines = [header];
    for (const r of state.rows){
      let row = {...r};
      if (state.expInfo){
        row['Student Number'] = state.expInfo.studentNumber;
        row['Week'] = state.expInfo.week;
      }
      const values = state.columns.map(k => {
        let v = row[k];
        if (v === undefined || v === null) v = '';
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

  // Try to salvage rows if nextEntry wasn't called by the experiment
  function salvageFromExperiment(psychoJS){
    try {
      const exp = psychoJS?.experiment;
      if (!exp) return false;

      // Common internal buffers in PsychoJS
      const maybeRows = exp._trialsData || exp.trialList || null;
      if (Array.isArray(maybeRows) && maybeRows.length){
        log('Salvaging from internal trials array:', maybeRows.length);
        for (const r of maybeRows){
          if (r && typeof r === 'object'){
            for (const [k,v] of Object.entries(r)){ addColumn(k); }
            state.rows.push({...r});
          }
        }
        return state.rows.length > 0;
      }

      if (Object.keys(state.currentRow).length){
        log('Salvaging from currentRow (single row).');
        state.rows.push({...state.currentRow});
        state.currentRow = {};
        return true;
      }
    } catch(e){ warn('salvage warn:', e); }
    return false;
  }

  window.CHEM112_PRIVATE = {
    patchExperiment(psychoJS){
      const exp = psychoJS.experiment;
      if (!exp || exp.__chem112_patched) return;
      exp.__chem112_patched = true;

      const origAdd = exp.addData.bind(exp);
      const origNext = exp.nextEntry.bind(exp);

      exp.addData = function(key, val){
        try { setCell(key, val); } catch(e){ warn('addData patch warn:', e); }
        return origAdd(key, val);
      };

      exp.nextEntry = function(){
        try {
          if (Object.keys(state.currentRow).length){
            const snapshot = {...state.currentRow};
            state.rows.push(snapshot);
            state.currentRow = {};
          }
        } catch(e){ warn('nextEntry patch warn:', e); }
        return origNext();
      };

      log('ExperimentHandler patched.');
    },

    setExpInfo(studentNumber, week){
      state.expInfo = { studentNumber, week };
      log('Set expInfo:', state.expInfo);
    },

    async onQuitUploadIfCompleted(psychoJS, isCompleted){
      if (!isCompleted) { log('Not completed; skip upload.'); return; }

      const sn = (state.expInfo?.studentNumber || '').trim();
      const wk = String(state.expInfo?.week || '').trim();
      const digits = (cfg.REQUIRE_DIGITS|0) || 8;
      if (!/^\d+$/.test(sn) || sn.length !== digits){
        warn('Invalid student number; skip upload.');
        return;
      }
      if (!cfg.ALLOWED_WEEKS || !cfg.ALLOWED_WEEKS.map(String).includes(wk)){
        warn('Invalid week; skip upload.');
        return;
      }

      // If we never saw nextEntry, salvage what we can
      if (state.rows.length === 0) { salvageFromExperiment(psychoJS); }

      const csv = buildCSV();
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth()+1).padStart(2,'0');
      const dd = String(today.getDate()).padStart(2,'0');
      const filename = `CHEM112 SRP_${sn}_${wk}_${yyyy}-${mm}-${dd}.csv`;

      log('Uploading:', filename, 'rows:', state.rows.length, 'cols:', state.columns.length);
      try {
        await postCSV(filename, csv);
        log('Upload success.');
      } catch(err){
        warn('Upload failed:', err);
      }
    }
  };
})();
