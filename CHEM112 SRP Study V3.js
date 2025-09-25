/***************************** 
 * Chem112 Srp Study V3 *
 *****************************/

import { core, data, sound, util, visual, hardware } from './lib/psychojs-2025.1.1.js';
const { PsychoJS } = core;
// CHEM112 private patch
if (window.CHEM112_PRIVATE) { /* will patch after psychoJS init */ }
const { TrialHandler, MultiStairHandler } = data;
const { Scheduler } = util;
//some handy aliases as in the psychopy scripts;
const { abs, sin, cos, PI: pi, sqrt } = Math;
const { round } = util;


// --- Safe text helper ---
function setTextSafe(stim, s) {
  const isPlaceholder = (v) => {
    if (!v) return true;
    const t = String(v).trim();
    if (t.length === 0) return true;
    const lower = t.toLowerCase();
    return lower === 'hello world' || lower === 'na' || lower === 'n/a' || lower === '.';
  };
  if (isPlaceholder(s)) {
    // Hide text if it's placeholder/empty
    if (stim && typeof stim.setOpacity === 'function') stim.setOpacity(0);
    if (stim && typeof stim.setText === 'function') stim.setText('');
  } else {
    if (stim && typeof stim.setText === 'function') stim.setText(String(s));
    if (stim && typeof stim.setOpacity === 'function' && stim.opacity === 0) stim.setOpacity(1);
  }
}


// --- Summary counters (module scope so all routines can access) ---
var TOTAL_TRIALS;
var TOTAL_CORRECT;


// --- Reattempt pass tracking (unique items by item_id) ---
var ATTEMPT_INDEX = 1;
var itemRowMap = new Map();    // item_id -> row object (topic, subtype, item_id, image_file, prompt_text, correct_answer)
var itemStatus = new Map();    // item_id -> { everCorrect: boolean }
var UNIQUE_TOTAL = 0;

function getWeekVal() {
  const w = (expInfo['Week (4, 5, 6, 7, 8, or 10)'] ?? '').toString();
  const m = w.match(/\d+/);
  return m ? parseInt(m[0]) : 4;
}

function uniqueCorrectCount() {
  let n = 0;
  for (const v of itemStatus.values()) if (v.everCorrect) n += 1;
  return n;
}

function wrongItemsList() {
  const wrong = [];
  for (const [id, st] of itemStatus.entries()) {
    if (!st.everCorrect && itemRowMap.has(id)) wrong.push(itemRowMap.get(id));
  }
  return wrong;
}




// --- Cross-routine flags ---
var invalidFlag;
var is_correct;



// --- Cross-routine state for Trial RT & scoring ---
var _trialClock;
var _rt_started;
var _rt;
var _response_raw;
var _response_norm;
var _correct_ans_norm;



// --- Safe resource helpers ---
function setImageSafe(stim, fname) {
  // Hide if no filename
  if (!fname || (typeof fname === 'string' && fname.trim().length === 0)) {
    stim.setOpacity(0);
    console.warn('Image filename missing/empty for', stim.name);
    return;
  }
  // Ensure the resource is preloaded
  const res = psychoJS.serverManager.getResource(fname);
  if (!res) {
    stim.setOpacity(0);
    console.warn('Resource not preloaded or missing:', fname, ' (component:', stim.name, ')');
    return;
  }
  // Set and show
  stim.setImage(fname);
  if (stim.opacity === 0) stim.setOpacity(1);
}



// --- Module-scope globals & utilities (Builder-friendly in ES modules) ---
var t, frameN, continueRoutine, routineForceEnded;
var frameDur;
var globalClock, routineTimer;
var currentLoop, level;

// Loops
var trialsLoop, attemptLoop;

// Routine clocks
var IntroClock, SetRepsClock, TrialClock, FeedbackClock, SummaryClock, fbClock, invalidClock;

// Component handles
var startBtn2, startLbl2, mouseStart2, showRetryBtn;
var introText, introKey, sumKB, sumTxt, stimImage, promptTxt, respBox, fbTxt, invalidPanel, invalidText, warnTxt, startBtn, startLbl, mouseStart;

// Component arrays & key buffers
var IntroComponents, SetRepsComponents, TrialComponents, FeedbackComponents, SummaryComponents;
var _introKey_allKeys, _sumKB_allKeys;

// Max duration flags
var IntroMaxDuration, IntroMaxDurationReached;
var SetRepsMaxDuration, SetRepsMaxDurationReached;
var TrialMaxDuration, TrialMaxDurationReached;
var FeedbackMaxDuration, FeedbackMaxDurationReached;
var SummaryMaxDuration, SummaryMaxDurationReached;

// Cross-routine handoff vars
var acc = null;
var resp_raw = '';
var corr_answer_display = '';

// Reps computed in SetReps
var attemptReps = 0;

// --- Utility functions hoisted to module scope ---
function norm_answer(s) {
  if (s === undefined || s === null) return '';
  s = String(s).trim().toLowerCase();
  // unify dashes and remove spaces/commas/hyphens
  s = s.replace(/[–—]/g, '-');
  s = s.replace(/[,\s-]+/g, '');
  // drop percent sign
  s = s.replace(/[%]/g, '');
  // collapse multiple dots
  s = s.replace(/\.{2,}/g, '.');
  // numeric normalization at the front (e.g., 80.00 -> 80, 18.050 -> 18.05)
  const m = s.match(/^([+-]?\d+(?:\.\d+)?)(.*)$/);
  if (m) {
    const num = parseFloat(m[1]);
    const rest = m[2] || '';
    s = String(num) + rest;
  }
  return s;
}
function answer_set(correct_answer) {
  if (correct_answer === undefined || correct_answer === null) return new Set();
  const s = Array.isArray(correct_answer) ? correct_answer.join('||') : String(correct_answer);
  if (s.trim().length === 0) return new Set();
  const alts = s.split('||').map(a => a.trim()).filter(a => a.length > 0);
  return new Set(alts.map(norm_answer));
}
// store info about the experiment session:
let expName = 'CHEM112 SRP Study 2025';  // from the Builder filename that created this script
let expInfo = {
    'Student Number': '',
    'Week (4, 5, 6, 7, 8, or 10)': '',
};
let PILOTING = util.getUrlParameters().has('__pilotToken');

// Start code blocks for 'Before Experiment'
// ---- global placeholders so early references never crash ----
var IntroClock, introText, introKey;
var SetRepsClock, TrialClock, FeedbackClock, SummaryClock;
var stimImage, promptTxt, respBox, warnTxt, invalidPanel, invalidText;
var fbTxt, sumTxt, sumKB;

// guards some builds touch very early:
if (typeof window.currentLoop === 'undefined') window.currentLoop = null;
if (typeof window.frameDur === 'undefined') window.frameDur = 1/60;

// Guard: some builds touch frameDur very early
if (typeof window.frameDur === 'undefined') { window.frameDur = 1/60; }

// Guards so early references never crash
if (typeof window.currentLoop === 'undefined') { window.currentLoop = null; }
if (typeof window.frameDur === 'undefined') { window.frameDur = 1/60; }

// init psychoJS:
const psychoJS = new PsychoJS({
  debug: true
});
// Patch experiment handler for capture
if (window.CHEM112_PRIVATE) window.CHEM112_PRIVATE.patchExperiment(psychoJS);

// open window:
psychoJS.openWindow({
  fullscr: false,
  color: new util.Color([0,0,0]),
  units: 'height',
  waitBlanking: true,
  backgroundImage: '',
  backgroundFit: 'none',
});
// schedule the experiment:
psychoJS.schedule(psychoJS.gui.DlgFromDict({
  dictionary: expInfo,
  title: expName
}));

const flowScheduler = new Scheduler(psychoJS);
const dialogCancelScheduler = new Scheduler(psychoJS);
psychoJS.scheduleCondition(function() { return (psychoJS.gui.dialogComponent.button === 'OK'); },flowScheduler, dialogCancelScheduler);
// Normalize and validate expInfo after OK
psychoJS.schedule(async function(){
  try {
    const cfg = window.CHEM112_CONFIG || {};
    const rawSN = String(expInfo['Student Number']||'').trim();
    const rawWeek = String(expInfo['Week (4, 5, 6, 7, 8, or 10)']||'').trim();
    const week = rawWeek.replace(/[^0-9]/g,''); // allow 'Week 4' -> '4'
    const student = rawSN.replace(/\D/g,'');
    if (window.CHEM112_PRIVATE) window.CHEM112_PRIVATE.setExpInfo(student, week);
    const digits = (cfg.REQUIRE_DIGITS|0) || 8;
    const allowed = (cfg.ALLOWED_WEEKS||[]).map(String);
    const okSN = /^\d+$/.test(student) && student.length===digits;
    const okWk = allowed.includes(week);
    if (!okSN || !okWk){
      window.alert('Please enter a valid 8-digit student number and choose a valid week: ' + allowed.join(', '));
      psychoJS.gui.dialogComponent.button = undefined; // force re-open path
      psychoJS.schedule(psychoJS.gui.DlgFromDict({dictionary: expInfo, title: expName}));
      return Scheduler.Event.NEXT;
    }
  } catch(e){ console.warn('[CHEM112] validation warn:', e); }
  return Scheduler.Event.NEXT;
});


// flowScheduler gets run if the participants presses OK
flowScheduler.add(updateInfo); // add timeStamp
flowScheduler.add(experimentInit);
flowScheduler.add(IntroRoutineBegin());
flowScheduler.add(IntroRoutineEachFrame());
flowScheduler.add(IntroRoutineEnd());
const trialsLoopLoopScheduler = new Scheduler(psychoJS);
flowScheduler.add(trialsLoopLoopBegin(trialsLoopLoopScheduler));
flowScheduler.add(trialsLoopLoopScheduler);
flowScheduler.add(trialsLoopLoopEnd);






flowScheduler.add(SummaryRoutineBegin());
flowScheduler.add(SummaryRoutineEachFrame());
flowScheduler.add(SummaryRoutineEnd());
// (quit moved to conditional in SummaryRoutineEnd)

// quit if user presses Cancel in dialog box:
dialogCancelScheduler.add(quitPsychoJS, 'Thank you for your patience.', false);



psychoJS.start({
  expName: expName,
  expInfo: expInfo,
  resources: [
    // resources:
    {'name': 'default.png', 'path': 'https://pavlovia.org/assets/default/default.png'},
    {'name': 'images/Slide1.PNG', 'path': 'images/Slide1.PNG'},
    {'name': 'images/Slide2.PNG', 'path': 'images/Slide2.PNG'},
    {'name': 'images/Slide3.PNG', 'path': 'images/Slide3.PNG'},
    {'name': 'images/Slide4.PNG', 'path': 'images/Slide4.PNG'},
    {'name': 'images/Slide5.PNG', 'path': 'images/Slide5.PNG'},
    {'name': 'images/Slide6.PNG', 'path': 'images/Slide6.PNG'},
    {'name': 'images/Slide7.PNG', 'path': 'images/Slide7.PNG'},
    {'name': 'images/Slide8.PNG', 'path': 'images/Slide8.PNG'},
    {'name': 'images/Slide9.PNG', 'path': 'images/Slide9.PNG'},
    {'name': 'images/Slide10.PNG', 'path': 'images/Slide10.PNG'},
    {'name': 'images/Slide11.PNG', 'path': 'images/Slide11.PNG'},
    {'name': 'images/Slide12.PNG', 'path': 'images/Slide12.PNG'},
    {'name': 'images/Slide13.PNG', 'path': 'images/Slide13.PNG'},
    {'name': 'images/Slide14.PNG', 'path': 'images/Slide14.PNG'},
    {'name': 'images/Slide15.PNG', 'path': 'images/Slide15.PNG'},
    {'name': 'images/Slide16.PNG', 'path': 'images/Slide16.PNG'},
    {'name': 'images/Slide17.PNG', 'path': 'images/Slide17.PNG'},
    {'name': 'images/Slide18.PNG', 'path': 'images/Slide18.PNG'},
    {'name': 'images/Slide19.PNG', 'path': 'images/Slide19.PNG'},
    {'name': 'images/Slide20.PNG', 'path': 'images/Slide20.PNG'},
    {'name': 'images/Slide21.PNG', 'path': 'images/Slide21.PNG'},
    {'name': 'images/Slide22.PNG', 'path': 'images/Slide22.PNG'},
    {'name': 'images/Slide23.PNG', 'path': 'images/Slide23.PNG'},
    {'name': 'images/Slide24.PNG', 'path': 'images/Slide24.PNG'},
    {'name': 'images/Slide25.PNG', 'path': 'images/Slide25.PNG'},
    {'name': 'images/Slide26.PNG', 'path': 'images/Slide26.PNG'},
    {'name': 'images/Slide27.PNG', 'path': 'images/Slide27.PNG'},
    {'name': 'images/Slide28.PNG', 'path': 'images/Slide28.PNG'},
    {'name': 'images/Slide29.PNG', 'path': 'images/Slide29.PNG'},
    {'name': 'images/Slide30.PNG', 'path': 'images/Slide30.PNG'},
    {'name': 'images/Slide31.PNG', 'path': 'images/Slide31.PNG'},
    {'name': 'images/Slide32.PNG', 'path': 'images/Slide32.PNG'},
    {'name': 'images/Slide33.PNG', 'path': 'images/Slide33.PNG'},
    {'name': 'images/Slide34.PNG', 'path': 'images/Slide34.PNG'},
    {'name': 'images/Slide35.PNG', 'path': 'images/Slide35.PNG'},
    {'name': 'images/Slide36.PNG', 'path': 'images/Slide36.PNG'},
    {'name': 'images/Slide37.PNG', 'path': 'images/Slide37.PNG'},
    {'name': 'images/Slide38.PNG', 'path': 'images/Slide38.PNG'},
    {'name': 'images/Slide39.PNG', 'path': 'images/Slide39.PNG'},
    {'name': 'images/Slide40.PNG', 'path': 'images/Slide40.PNG'},
    {'name': 'images/Slide41.PNG', 'path': 'images/Slide41.PNG'},
    {'name': 'images/Slide42.PNG', 'path': 'images/Slide42.PNG'},
    {'name': 'images/Slide43.PNG', 'path': 'images/Slide43.PNG'},
    {'name': 'images/Slide44.PNG', 'path': 'images/Slide44.PNG'},
    {'name': 'images/Slide45.PNG', 'path': 'images/Slide45.PNG'},
    {'name': 'images/Slide46.PNG', 'path': 'images/Slide46.PNG'},
    {'name': 'images/Slide47.PNG', 'path': 'images/Slide47.PNG'},
    {'name': 'images/Slide48.PNG', 'path': 'images/Slide48.PNG'},
    {'name': 'images/Slide49.PNG', 'path': 'images/Slide49.PNG'},
    {'name': 'images/Slide50.PNG', 'path': 'images/Slide50.PNG'},
    {'name': 'images/Slide51.PNG', 'path': 'images/Slide51.PNG'},
    {'name': 'images/Slide52.PNG', 'path': 'images/Slide52.PNG'},
    {'name': 'images/Slide53.PNG', 'path': 'images/Slide53.PNG'},
    {'name': 'images/Slide54.PNG', 'path': 'images/Slide54.PNG'},
    {'name': 'images/Slide55.PNG', 'path': 'images/Slide55.PNG'},
    {'name': 'images/Slide56.PNG', 'path': 'images/Slide56.PNG'},
    {'name': 'images/Slide57.PNG', 'path': 'images/Slide57.PNG'},
    {'name': 'images/Slide58.PNG', 'path': 'images/Slide58.PNG'},
    {'name': 'images/Slide59.PNG', 'path': 'images/Slide59.PNG'},
    {'name': 'images/Slide60.PNG', 'path': 'images/Slide60.PNG'},
    {'name': 'stimuli_master_simple.csv', 'path': 'stimuli_master_simple.csv'},
  ]
});

psychoJS.experimentLogger.setLevel(core.Logger.ServerLevel.INFO);

async function updateInfo() {
  currentLoop = psychoJS.experiment;  // right now there are no loops
  expInfo['date'] = util.MonotonicClock.getDateStr();  // add a simple timestamp
  expInfo['expName'] = expName;
  expInfo['psychopyVersion'] = '2025.1.1';
  expInfo['OS'] = window.navigator.platform;


  // store frame rate of monitor if we can measure it successfully
  expInfo['frameRate'] = psychoJS.window.getActualFrameRate();
  if (typeof expInfo['frameRate'] !== 'undefined')
    frameDur = 1.0 / Math.round(expInfo['frameRate']);
  else
    frameDur = 1.0 / 60.0; // couldn't get a reliable measure so guess

  // add info from the URL:
  util.addInfoFromUrl(expInfo);
  

  
  psychoJS.experiment.dataFileName = (("." + "/") + `data/${(expInfo["Student Number"] || "anon")}_${expName}_${expInfo["date"]}`);
  psychoJS.experiment.field_separator = '\t';


  return Scheduler.Event.NEXT;
}

async function experimentInit() {
  // Initialize components for Routine "Intro"
  IntroClock = new util.Clock();
  introText = new visual.TextStim({
    win: psychoJS.window,
    name: 'introText',
    text: 'Welcome to the Spaced Retrieval Practice Study!\nYou will be given a set of questions, please answer to the best of your ability.\nOnce you have finished typing, press [Enter] to submit.\nFeedback for a Correct or Incorrect Answer will be shown for 3 seconds, afterwards the new question will show.\nIf you are ready, press [Space] or tap Start to begin.',
    font: 'Arial',
    units: undefined, 
    pos: [0, 0], draggable: false, height: 0.05,  wrapWidth: undefined, ori: 0.0,
    languageStyle: 'LTR',
    color: new util.Color('white'),  opacity: undefined,
    depth: 0.0 
  });
  
  introKey = new core.Keyboard({psychoJS: psychoJS, clock: new util.Clock(), waitForStart: true});

// --- Summary Start button (for mobile re-attempts) ---
mouseStart2 = new core.Mouse({win: psychoJS.window});
startBtn2 = new visual.Rect({
  win: psychoJS.window, name: 'startBtn2',
  width: 0.28, height: 0.12, pos: [0.40, -0.42], anchor: 'center',
  lineWidth: 2.0, lineColor: new util.Color('white'),
  fillColor: new util.Color([0.15, 0.15, 0.15]),
  opacity: 1.0, depth: -0.5
});
startLbl2 = new visual.TextStim({
  win: psychoJS.window, name: 'startLbl2',
  text: 'Start', font: 'Arial', height: 0.045,
  color: new util.Color('white'), pos: [0.40, -0.42], depth: -0.6
});

// --- Mobile/desktop Start button (Intro) ---
mouseStart = new core.Mouse({win: psychoJS.window});
startBtn = new visual.Rect({
  win: psychoJS.window, name: 'startBtn',
  width: 0.28, height: 0.12, pos: [0.40, -0.42], anchor: 'center',
  lineWidth: 2.0, lineColor: new util.Color('white'),
  fillColor: new util.Color([0.15, 0.15, 0.15]),
  opacity: 1.0, depth: -0.5
});
startLbl = new visual.TextStim({
  win: psychoJS.window, name: 'startLbl',
  text: 'Start', font: 'Arial', height: 0.045,
  color: new util.Color('white'), pos: [0.40, -0.42], depth: -0.6
});
  
  // Initialize components for Routine "SetReps"
  SetRepsClock = new util.Clock();
  // Initialize components for Routine "Trial"
  TrialClock = new util.Clock();
  // Run 'Begin Experiment' code from TrialCode
  // ---- Dialog keys (renamed fields) ----
  const WEEK_KEY = 'Week (4, 5, 6, 7, 8, or 10)';
  const STUDENT_KEY = 'Student Number';
  const ALLOWED_WEEKS = new Set([4, 5, 6, 7, 8, 10]);
  
  function parseWeek(expInfo) {
    const s = (expInfo[WEEK_KEY] ?? '').toString().trim();
    const m = s.match(/\d+/);
    const wk = m ? parseInt(m[0]) : 4;
    return ALLOWED_WEEKS.has(wk) ? wk : 4;
  }
  
  var CURRENT_WEEK = parseWeek(expInfo);
  
  // ---------- Utilities ----------
  function norm_answer(s) {
  if (s === undefined || s === null) return '';
  s = String(s).trim().toLowerCase();
  // unify dashes and remove spaces/commas/hyphens
  s = s.replace(/[–—]/g, '-');
  s = s.replace(/[,\s-]+/g, '');
  // drop percent sign
  s = s.replace(/[%]/g, '');
  // collapse multiple dots
  s = s.replace(/\.{2,}/g, '.');
  // numeric normalization at the front (e.g., 80.00 -> 80, 18.050 -> 18.05)
  const m = s.match(/^([+-]?\d+(?:\.\d+)?)(.*)$/);
  if (m) {
    const num = parseFloat(m[1]);
    const rest = m[2] || '';
    s = String(num) + rest;
  }
  return s;
}
function answer_set(correct_answer) {
  if (correct_answer === undefined || correct_answer === null) return new Set();
  const s = Array.isArray(correct_answer) ? correct_answer.join('||') : String(correct_answer);
  if (s.trim().length === 0) return new Set();
  const alts = s.split('||').map(a => a.trim()).filter(a => a.length > 0);
  return new Set(alts.map(norm_answer));
}
// Per-week repetition rule (no week/session cols in CSV)
  function repsFor(topic_val, week_val) {
    const t = (topic_val ?? '').toString().trim().toLowerCase();
    if (t === 'organic')     return [4,5,7,10].includes(week_val) ? 1 : 0;
    if (t === 'dimensional') return [4,6,8,10].includes(week_val) ? 1 : 0;
    if (t === 'inorganic')   return week_val === 10 ? 4 : 0;
    return 0;
  }
  
  // Summary counters
  TOTAL_TRIALS = 0;
  TOTAL_CORRECT = 0;
  
  // Vars passed to Feedback
  var acc = null;
  var resp_raw = '';
  var corr_answer_display = '';
  
  stimImage = new visual.ImageStim({
    win : psychoJS.window,
    name : 'stimImage', units : 'height', 
    image : 'default.png', mask : undefined,
    anchor : 'center',
    ori : 0.0, 
    pos : [0, 0.25], 
    draggable: false,
    size : [0.6667, 0.5],
    color : new util.Color([1,1,1]), opacity : undefined,
    flipHoriz : false, flipVert : false,
    texRes : 128.0, interpolate : true, depth : -1.0 
  });
  promptTxt = new visual.TextStim({
    win: psychoJS.window,
    name: 'promptTxt',
    text: '',
    font: 'Arial',
    units: undefined, 
    pos: [0, -0.05], draggable: false, height: 0.05,  wrapWidth: undefined, ori: 0.0,
    languageStyle: 'LTR',
    color: new util.Color('white'),  opacity: undefined,
    depth: -2.0 
  });
  
  respBox = new visual.TextBox({
    win: psychoJS.window,
    name: 'respBox',
    text: '',
    placeholder: 'Type your answer, then press [Enter]',
    font: 'Arial',
    pos: [0, (- 0.35)], 
    draggable: false,
    letterHeight: 0.05,
    lineSpacing: 1.0,
    size: [0.9, 0.12],  units: undefined, 
    ori: 0.0,
    color: 'black', colorSpace: 'rgb',
    fillColor: 'white', borderColor: 'black',
    languageStyle: 'LTR',
    bold: false, italic: false,
    opacity: undefined,
    padding: 0.0,
    alignment: 'center',
    overflow: 'visible',
    editable: true,
    multiline: true,
    anchor: 'center',
    depth: -3.0 
  });
  
  warnTxt = new visual.TextStim({
    win: psychoJS.window,
    name: 'warnTxt',
    text: 'Please type an answer before submitting',
    font: 'Arial',
    units: undefined, 
    pos: [0, (- 0.48)], draggable: false, height: 0.05,  wrapWidth: undefined, ori: 0.0,
    languageStyle: 'LTR',
    color: new util.Color([1.0, (- 1.0), (- 1.0)]),  opacity: 0.0,
    depth: -4.0 
  });
  
  invalidPanel = new visual.Rect ({
    win: psychoJS.window, name: 'invalidPanel', 
    width: [2, 2][0], height: [2, 2][1],
    ori: 0.0, 
    pos: [0, 0], 
    draggable: false, 
    anchor: 'center', 
    lineWidth: 1.0, 
    lineColor: new util.Color('white'), 
    fillColor: new util.Color([(- 1.0), (- 1.0), (- 1.0)]), 
    colorSpace: 'rgb', 
    opacity: 0.0, 
    depth: -5, 
    interpolate: true, 
  });
  
  invalidText = new visual.TextStim({
    win: psychoJS.window,
    name: 'invalidText',
    text: 'Answer invalid. Please properly attempt the question.',
    font: 'Arial',
    units: undefined, 
    pos: [0, 0], draggable: false, height: 0.05,  wrapWidth: undefined, ori: 0.0,
    languageStyle: 'LTR',
    color: new util.Color('white'),  opacity: 0.0,
    depth: -6.0 
  });
  
  // Initialize components for Routine "Feedback"
  FeedbackClock = new util.Clock();
  fbTxt = new visual.TextStim({
    win: psychoJS.window,
    name: 'fbTxt',
    text: '',
    font: 'Arial',
    units: undefined, 
    pos: [0, 0], draggable: false, height: 0.05,  wrapWidth: undefined, ori: 0.0,
    languageStyle: 'LTR',
    color: new util.Color('white'),  opacity: undefined,
    depth: -1.0 
  });
  
  // Initialize components for Routine "Summary"
  SummaryClock = new util.Clock();
  sumTxt = new visual.TextStim({
    win: psychoJS.window,
    name: 'sumTxt',
    text: '',
    font: 'Arial',
    units: undefined, 
    pos: [0, 0], draggable: false, height: 0.05,  wrapWidth: undefined, ori: 0.0,
    languageStyle: 'LTR',
    color: new util.Color('white'),  opacity: undefined,
    depth: 0.0 
  });
  
  sumKB = new core.Keyboard({psychoJS: psychoJS, clock: new util.Clock(), waitForStart: true});
  
  // Run 'Begin Experiment' code from SumCode
  TOTAL_TRIALS = 0;
  TOTAL_CORRECT = 0;
  
  // Create some handy timers
  globalClock = new util.Clock();  // to track the time since experiment started
  routineTimer = new util.CountdownTimer();  // to track time remaining of each (non-slip) routine
  
  return Scheduler.Event.NEXT;
}

function IntroRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
    //--- Prepare to start Routine 'Intro' ---
    t = 0;
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    // keep track of whether this Routine was forcibly ended
    routineForceEnded = false;
    IntroClock.reset();
    routineTimer.reset();
    IntroMaxDurationReached = false;
    // update component parameters for each repeat
    introKey.keys = undefined;
    introKey.rt = undefined;
    _introKey_allKeys = [];
    psychoJS.experiment.addData('Intro.started', globalClock.getTime());
    IntroMaxDuration = null
    // keep track of which components have finished
    IntroComponents = [];
    IntroComponents.push(introText);
    IntroComponents.push(introKey);
    IntroComponents.push(startBtn);
    IntroComponents.push(startLbl);
    
    for (const thisComponent of IntroComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}

function IntroRoutineEachFrame() {
  return async function () {
    //--- Loop for each frame of Routine 'Intro' ---
    // get current time
    t = IntroClock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    
    // *introText* updates
    if (t >= 0.0 && introText.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      introText.tStart = t;  // (not accounting for frame time here)
      introText.frameNStart = frameN;  // exact frame index
      
      introText.setAutoDraw(true);
    }
    
    
    // if introText is active this frame...
    if (introText.status === PsychoJS.Status.STARTED) {
    }
    
    
    // *introKey* updates
    if (t >= 0.0 && introKey.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      introKey.tStart = t;  // (not accounting for frame time here)
      introKey.frameNStart = frameN;  // exact frame index
      
      // keyboard checking is just starting
      psychoJS.window.callOnFlip(function() { introKey.clock.reset(); });  // t=0 on next screen flip
      psychoJS.window.callOnFlip(function() { introKey.start(); }); // start on screen flip
      psychoJS.window.callOnFlip(function() { introKey.clearEvents(); });
    }
    
    // if introKey is active this frame...
    if (introKey.status === PsychoJS.Status.STARTED) {
      let theseKeys = introKey.getKeys({keyList: 'space', waitRelease: false});
      _introKey_allKeys = _introKey_allKeys.concat(theseKeys);
      if (_introKey_allKeys.length > 0) {
        introKey.keys = _introKey_allKeys[_introKey_allKeys.length - 1].name;  // just the last key pressed
        introKey.rt = _introKey_allKeys[_introKey_allKeys.length - 1].rt;
        introKey.duration = _introKey_allKeys[_introKey_allKeys.length - 1].duration;
        // a response ends the routine
        continueRoutine = false;
      }
    }
    
    
// *startBtn* updates
if (t >= 0.0 && startBtn.status === PsychoJS.Status.NOT_STARTED) {
  startBtn.tStart = t; startBtn.frameNStart = frameN;
  startBtn.setAutoDraw(true);
}
// *startLbl* updates
if (t >= 0.0 && startLbl.status === PsychoJS.Status.NOT_STARTED) {
  startLbl.tStart = t; startLbl.frameNStart = frameN;
  startLbl.setAutoDraw(true);
}
// Mouse/touch handler for Start button
if (typeof mouseStart !== 'undefined') {
  const buttons = mouseStart.getPressed();
  if ((buttons[0] === 1) && mouseStart.isPressedIn(startBtn)) {
    continueRoutine = false;
  }
}
// check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {  // a component has requested a forced-end of Routine
      routineForceEnded = true;
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;  // reverts to True if at least one component still running
    for (const thisComponent of IntroComponents)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    // refresh the screen if continuing
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}

function IntroRoutineEnd(snapshot) {
  return async function () {
    //--- Ending Routine 'Intro' ---
    for (const thisComponent of IntroComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    psychoJS.experiment.addData('Intro.stopped', globalClock.getTime());
    // update the trial handler
    if (currentLoop instanceof MultiStairHandler) {
      currentLoop.addResponse(introKey.corr, level);
    }
    psychoJS.experiment.addData('introKey.keys', introKey.keys);
    if (typeof introKey.keys !== 'undefined') {  // we had a response
        psychoJS.experiment.addData('introKey.rt', introKey.rt);
        psychoJS.experiment.addData('introKey.duration', introKey.duration);
        routineTimer.reset();
        }
    
    introKey.stop();
    // the Routine "Intro" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset();
    
    // Routines running outside a loop should always advance the datafile row
    if (currentLoop === psychoJS.experiment) {
      psychoJS.experiment.nextEntry(snapshot);
    }
    return Scheduler.Event.NEXT;
  }
}

function trialsLoopLoopBegin(trialsLoopLoopScheduler, snapshot) {
  return async function() {
    TrialHandler.fromSnapshot(snapshot); // update internal variables (.thisN etc) of the loop
    
    // set up handler to look after randomisation of conditions etc
    trialsLoop = new TrialHandler({
      psychoJS: psychoJS,
      nReps: 1, method: TrialHandler.Method.RANDOM,
      extraInfo: expInfo, originPath: undefined,
      trialList: 'stimuli_master_simple.csv',
      seed: undefined, name: 'trialsLoop'
    });
    psychoJS.experiment.addLoop(trialsLoop); // add the loop to the experiment
    currentLoop = trialsLoop;  // we're now the current loop
    
    // Schedule all the trials in the trialList:
    for (const thisTrialsLoop of trialsLoop) {
      snapshot = trialsLoop.getSnapshot();
      trialsLoopLoopScheduler.add(importConditions(snapshot));
      trialsLoopLoopScheduler.add(SetRepsRoutineBegin(snapshot));
      trialsLoopLoopScheduler.add(SetRepsRoutineEachFrame());
      trialsLoopLoopScheduler.add(SetRepsRoutineEnd(snapshot));
      const attemptLoopLoopScheduler = new Scheduler(psychoJS);
      trialsLoopLoopScheduler.add(attemptLoopLoopBegin(attemptLoopLoopScheduler, snapshot));
      trialsLoopLoopScheduler.add(attemptLoopLoopScheduler);
      trialsLoopLoopScheduler.add(attemptLoopLoopEnd);
      trialsLoopLoopScheduler.add(trialsLoopLoopEndIteration(trialsLoopLoopScheduler, snapshot));
    }
    
    return Scheduler.Event.NEXT;
  }
}

function attemptLoopLoopBegin(attemptLoopLoopScheduler, snapshot) {
  return async function() {
    TrialHandler.fromSnapshot(snapshot); // update internal variables (.thisN etc) of the loop
    
    // set up handler to look after randomisation of conditions etc
    attemptLoop = new TrialHandler({
      psychoJS: psychoJS,
      nReps: attemptReps, method: TrialHandler.Method.RANDOM,
      extraInfo: expInfo, originPath: undefined,
      trialList: undefined,
      seed: undefined, name: 'attemptLoop'
    });
    psychoJS.experiment.addLoop(attemptLoop); // add the loop to the experiment
    currentLoop = attemptLoop;  // we're now the current loop
    
    // Schedule all the trials in the trialList:
    for (const thisAttemptLoop of attemptLoop) {
      snapshot = attemptLoop.getSnapshot();
      attemptLoopLoopScheduler.add(importConditions(snapshot));
      attemptLoopLoopScheduler.add(TrialRoutineBegin(snapshot));
      attemptLoopLoopScheduler.add(TrialRoutineEachFrame());
      attemptLoopLoopScheduler.add(TrialRoutineEnd(snapshot));
      attemptLoopLoopScheduler.add(FeedbackRoutineBegin(snapshot));
      attemptLoopLoopScheduler.add(FeedbackRoutineEachFrame());
      attemptLoopLoopScheduler.add(FeedbackRoutineEnd(snapshot));
      attemptLoopLoopScheduler.add(attemptLoopLoopEndIteration(attemptLoopLoopScheduler, snapshot));
    }
    
    return Scheduler.Event.NEXT;
  }
}

async function attemptLoopLoopEnd() {
  // terminate loop
  psychoJS.experiment.removeLoop(attemptLoop);
  // update the current loop from the ExperimentHandler
  if (psychoJS.experiment._unfinishedLoops.length>0)
    currentLoop = psychoJS.experiment._unfinishedLoops.at(-1);
  else
    currentLoop = psychoJS.experiment;  // so we use addData from the experiment
  return Scheduler.Event.NEXT;
}

// --- Dynamic reattempt loop helpers ---
var redoLoop;

function dynamicLoopLoopBegin(dynamicLoopScheduler, trialRows, loopName='redoLoop') {
  return async function() {
    redoLoop = new TrialHandler({
      psychoJS: psychoJS,
      nReps: 1,
      method: TrialHandler.Method.RANDOM,
      extraInfo: expInfo,
      originPath: undefined,
      trialList: trialRows,
      seed: undefined,
      name: loopName
    });
    psychoJS.experiment.addLoop(redoLoop);
    currentLoop = redoLoop;

    for (const thisRow of redoLoop) {
      const snapshot = redoLoop.getSnapshot();
      dynamicLoopScheduler.add(importConditions(snapshot));
      dynamicLoopScheduler.add(TrialRoutineBegin(snapshot));
      dynamicLoopScheduler.add(TrialRoutineEachFrame());
      dynamicLoopScheduler.add(TrialRoutineEnd(snapshot));
      dynamicLoopScheduler.add(FeedbackRoutineBegin(snapshot));
      dynamicLoopScheduler.add(FeedbackRoutineEachFrame());
      dynamicLoopScheduler.add(FeedbackRoutineEnd(snapshot));
      dynamicLoopScheduler.add(dynamicLoopLoopEndIteration(dynamicLoopScheduler, snapshot));
    }
    return Scheduler.Event.NEXT;
  }
}

async function dynamicLoopLoopEnd() {
  psychoJS.experiment.removeLoop(redoLoop);
  if (psychoJS.experiment._unfinishedLoops.length>0)
    currentLoop = psychoJS.experiment._unfinishedLoops.at(-1);
  else
    currentLoop = psychoJS.experiment;
  return Scheduler.Event.NEXT;
}

function dynamicLoopLoopEndIteration(scheduler, snapshot) {
  return async function () {
    if (typeof snapshot !== 'undefined') {
      if (snapshot.finished) {
        if (psychoJS.experiment.isEntryEmpty()) {
          psychoJS.experiment.nextEntry(snapshot);
        }
        scheduler.stop();
      } else {
        psychoJS.experiment.nextEntry(snapshot);
      }
      return Scheduler.Event.NEXT;
    }
  };
}


function attemptLoopLoopEndIteration(scheduler, snapshot) {
  // ------Prepare for next entry------
  return async function () {
    if (typeof snapshot !== 'undefined') {
      // ------Check if user ended loop early------
      if (snapshot.finished) {
        // Check for and save orphaned data
        if (psychoJS.experiment.isEntryEmpty()) {
          psychoJS.experiment.nextEntry(snapshot);
        }
        scheduler.stop();
      } else {
        psychoJS.experiment.nextEntry(snapshot);
      }
    return Scheduler.Event.NEXT;
    }
  };
}

async function trialsLoopLoopEnd() {
  // terminate loop
  psychoJS.experiment.removeLoop(trialsLoop);
  // update the current loop from the ExperimentHandler
  if (psychoJS.experiment._unfinishedLoops.length>0)
    currentLoop = psychoJS.experiment._unfinishedLoops.at(-1);
  else
    currentLoop = psychoJS.experiment;  // so we use addData from the experiment
  return Scheduler.Event.NEXT;
}

function trialsLoopLoopEndIteration(scheduler, snapshot) {
  // ------Prepare for next entry------
  return async function () {
    if (typeof snapshot !== 'undefined') {
      // ------Check if user ended loop early------
      if (snapshot.finished) {
        // Check for and save orphaned data
        if (psychoJS.experiment.isEntryEmpty()) {
          psychoJS.experiment.nextEntry(snapshot);
        }
        scheduler.stop();
      } else {
        psychoJS.experiment.nextEntry(snapshot);
      }
    return Scheduler.Event.NEXT;
    }
  };
}

function SetRepsRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
    //--- Prepare to start Routine 'SetReps' ---
    t = 0;
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    // keep track of whether this Routine was forcibly ended
    routineForceEnded = false;
    SetRepsClock.reset();
    routineTimer.reset();
    SetRepsMaxDurationReached = false;
    // update component parameters for each repeat
    // Run 'Begin Routine' code from SetRepsCode
    let _wstr = (expInfo['Week (4, 5, 6, 7, 8, or 10)'] ?? '').toString().trim();
    let _m = _wstr.match(/\d+/); let _wk = _m ? parseInt(_m[0]) : 4;
    
    let _t = (typeof topic === 'undefined' || topic === null) ? '' : topic.toString().trim().toLowerCase();
    
    if (_t === 'inorganic' && _wk === 10) {
      attemptReps = 4;
    } else if (_t === 'organic' && [4,5,7,10].includes(_wk)) {
      attemptReps = 1;
    } else if (_t === 'dimensional' && [4,6,8,10].includes(_wk)) {
      attemptReps = 1;
    } else {
      attemptReps = 0;
    }
    
    
// Record unique eligible items for pass summaries / reattempts
if (attemptReps > 0) {
  if (typeof item_id !== 'undefined' && !itemRowMap.has(item_id)) {
    itemRowMap.set(item_id, { topic, subtype, item_id, image_file, prompt_text, correct_answer });
    itemStatus.set(item_id, { everCorrect: false });
    UNIQUE_TOTAL = itemRowMap.size;
  }
}
psychoJS.experiment.addData('SetReps.started', globalClock.getTime());
    SetRepsMaxDuration = null
    // keep track of which components have finished
    SetRepsComponents = [];
    
    for (const thisComponent of SetRepsComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}

function SetRepsRoutineEachFrame() {
  return async function () {
    //--- Loop for each frame of Routine 'SetReps' ---
    // get current time
    t = SetRepsClock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {  // a component has requested a forced-end of Routine
      routineForceEnded = true;
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;  // reverts to True if at least one component still running
    for (const thisComponent of SetRepsComponents)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    // refresh the screen if continuing
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}

function SetRepsRoutineEnd(snapshot) {
  return async function () {
    //--- Ending Routine 'SetReps' ---
    for (const thisComponent of SetRepsComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    psychoJS.experiment.addData('SetReps.stopped', globalClock.getTime());
    // the Routine "SetReps" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset();
    
    // Routines running outside a loop should always advance the datafile row
    if (currentLoop === psychoJS.experiment) {
      psychoJS.experiment.nextEntry(snapshot);
    }
    return Scheduler.Event.NEXT;
  }
}

function TrialRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
    //--- Prepare to start Routine 'Trial' ---
    t = 0;
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    // keep track of whether this Routine was forcibly ended
    routineForceEnded = false;
    TrialClock.reset();
    routineTimer.reset();
    TrialMaxDurationReached = false;
    // update component parameters for each repeat
    // Run 'Begin Routine' code from TrialCode
    // Clear keys so prior Enter can't leak in
    psychoJS.eventManager.clearEvents();
    
    // Reset input & overlay
    respBox.setText('');
    invalidFlag = false;
    invalidClock = null;
    invalidPanel.setOpacity(0);
    invalidText.setOpacity(0);
    
    // RT & scoring state
    _trialClock = new util.Clock();
    _rt_started = false;
    _rt = -1.0;
    
    _response_raw = '';
    _response_norm = '';
    is_correct = -1;  // becomes 0/1 only on valid submission
    
    // Acceptable answers for this row
    _correct_ans_norm = answer_set(correct_answer);
    
    // Image visibility for prompt-only trials
    const stim_has_image = !!(image_file && image_file.toString().trim().length > 0);
    stimImage.setOpacity(stim_has_image ? 1 : 0);
    
    // Reset hand-off vars
    acc = null;
    resp_raw = '';
    corr_answer_display = '';
    
    setImageSafe(stimImage, image_file);
    setTextSafe(promptTxt, prompt_text);
    respBox.setText('');
    respBox.refresh();
    psychoJS.experiment.addData('Trial.started', globalClock.getTime());
    TrialMaxDuration = null
    // keep track of which components have finished
    TrialComponents = [];
    TrialComponents.push(stimImage);
    TrialComponents.push(promptTxt);
    TrialComponents.push(respBox);
    TrialComponents.push(warnTxt);
    TrialComponents.push(invalidPanel);
    TrialComponents.push(invalidText);
    
    for (const thisComponent of TrialComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}

function TrialRoutineEachFrame() {
  return async function () {
    //--- Loop for each frame of Routine 'Trial' ---
    // get current time
    t = TrialClock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    // Run 'Each Frame' code from TrialCode
    // Keep routine alive unless we explicitly end it
    continueRoutine = true;
    
    // Start RT on first draw
    if (!_rt_started) {
      _rt_started = true;
      _trialClock.reset();
    }
    
    // If overlay is showing, hold for ~2 s then hide and let them retry
    if (invalidFlag) {
      if (invalidClock === null) {
        invalidClock = new util.Clock();
        invalidClock.reset();
      }
      invalidPanel.setOpacity(0.8);
      invalidText.setOpacity(1);
      if (invalidClock.getTime() >= 2.0) {
        invalidFlag = false;
        invalidPanel.setOpacity(0);
        invalidText.setOpacity(0);
        respBox.setText('');               // force a fresh attempt
        psychoJS.eventManager.clearEvents(); // flush Enter
      }
      // stay in this routine
    } else {
      // Handle Enter manually (no Builder keyboard component)
      const keys = psychoJS.eventManager.getKeys({ keyList: ['return', 'enter'] });
      if (keys.length > 0) {
        // sanitize textbox (remove CR/LF so Enter never adds newlines)
        _response_raw = (respBox.text ?? '').toString().replace(/\r|\n/g, '');
        respBox.setText(_response_raw);
        _response_norm = norm_answer(_response_raw);
    
        // INVALID: empty or < 2 normalized characters
        if (_response_norm.length < 2) {
          invalidFlag = true;
          psychoJS.eventManager.clearEvents();
          // overlay will show on next frames; keep routine alive
        } else {
          // VALID: score & end to Feedback
          _rt = _trialClock.getTime();
          if (_correct_ans_norm.size > 0) {
            is_correct = _correct_ans_norm.has(_response_norm) ? 1 : 0;
          } else {
            is_correct = 0;
          }
    
          // Log trial data now in End Routine; prep feedback vars here
          acc = is_correct;
          resp_raw = _response_raw;
          corr_answer_display = correct_answer;
    
          continueRoutine = false; // go to Feedback
        }
      }
    }
    
    
    // *stimImage* updates
    if (t >= 0.0 && stimImage.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      stimImage.tStart = t;  // (not accounting for frame time here)
      stimImage.frameNStart = frameN;  // exact frame index
      
      stimImage.setAutoDraw(true);
    }
    
    
    // if stimImage is active this frame...
    if (stimImage.status === PsychoJS.Status.STARTED) {
    }
    
    
    // *promptTxt* updates
    if (t >= 0.0 && promptTxt.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      promptTxt.tStart = t;  // (not accounting for frame time here)
      promptTxt.frameNStart = frameN;  // exact frame index
      
      promptTxt.setAutoDraw(true);
    }
    
    
    // if promptTxt is active this frame...
    if (promptTxt.status === PsychoJS.Status.STARTED) {
    }
    
    
    // *respBox* updates
    if (t >= 0.0 && respBox.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      respBox.tStart = t;  // (not accounting for frame time here)
      respBox.frameNStart = frameN;  // exact frame index
      
      respBox.setAutoDraw(true);
    }
    
    
    // if respBox is active this frame...
    if (respBox.status === PsychoJS.Status.STARTED) {
    }
    
    
    // *warnTxt* updates
    
    // if warnTxt is active this frame...
    if (warnTxt.status === PsychoJS.Status.STARTED) {
    }
    
    
    // *invalidPanel* updates
    if (t >= 0.0 && invalidPanel.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      invalidPanel.tStart = t;  // (not accounting for frame time here)
      invalidPanel.frameNStart = frameN;  // exact frame index
      
      invalidPanel.setAutoDraw(true);
    }
    
    
    // if invalidPanel is active this frame...
    if (invalidPanel.status === PsychoJS.Status.STARTED) {
    }
    
    
    // *invalidText* updates
    if (t >= 0.0 && invalidText.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      invalidText.tStart = t;  // (not accounting for frame time here)
      invalidText.frameNStart = frameN;  // exact frame index
      
      invalidText.setAutoDraw(true);
    }
    
    
    // if invalidText is active this frame...
    if (invalidText.status === PsychoJS.Status.STARTED) {
    }
    
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {  // a component has requested a forced-end of Routine
      routineForceEnded = true;
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;  // reverts to True if at least one component still running
    for (const thisComponent of TrialComponents)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    // refresh the screen if continuing
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}

function TrialRoutineEnd(snapshot) {
  return async function () {
    //--- Ending Routine 'Trial' ---
    for (const thisComponent of TrialComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    psychoJS.experiment.addData('Trial.stopped', globalClock.getTime());
    // Run 'End Routine' code from TrialCode
    // Only log a row if there was a VALID submission this attempt
    if (is_correct >= 0) {
    // derive student + week directly from expInfo (no external constants)
    const _sn = (expInfo['Student Number'] ?? '');
    const _wStr = (expInfo['Week (4, 5, 6, 7, 8, or 10)'] ?? '').toString();
    const _m = _wStr.match(/\d+/);
    const _wk = _m ? parseInt(_m[0]) : 4;
    
    psychoJS.experiment.addData('student_number', _sn);
    psychoJS.experiment.addData('week', _wk);
    
      psychoJS.experiment.addData('topic', topic);
      psychoJS.experiment.addData('subtype', subtype);
      psychoJS.experiment.addData('item_id', item_id);
      psychoJS.experiment.addData('image_file', image_file);
      psychoJS.experiment.addData('prompt_text', prompt_text);
      psychoJS.experiment.addData('correct_answer', correct_answer);
      psychoJS.experiment.addData('response_raw', _response_raw);
      psychoJS.experiment.addData('response_norm', _response_norm);
      psychoJS.experiment.addData('rt', _rt);
      psychoJS.experiment.addData('accuracy', is_correct);
    
      TOTAL_TRIALS += 1;
      TOTAL_CORRECT += is_correct;
      // Update per-item mastery (ever-correct within the session)
      if (is_correct >= 0 && typeof item_id !== 'undefined') {
        const prev = itemStatus.get(item_id) || { everCorrect: false };
        if (is_correct === 1) prev.everCorrect = true;
        itemStatus.set(item_id, prev);
      }

    }
    
    psychoJS.experiment.addData('respBox.text',respBox.text)
    // the Routine "Trial" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset();
    
    // Routines running outside a loop should always advance the datafile row
    if (currentLoop === psychoJS.experiment) {
      psychoJS.experiment.nextEntry(snapshot);
    }
    return Scheduler.Event.NEXT;
  }
}

function FeedbackRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
    //--- Prepare to start Routine 'Feedback' ---
    t = 0;
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    // keep track of whether this Routine was forcibly ended
    routineForceEnded = false;
    FeedbackClock.reset();
    routineTimer.reset();
    FeedbackMaxDurationReached = false;
    // update component parameters for each repeat
    // Run 'Begin Routine' code from FBCode
    // If no valid submission, skip feedback
    if (acc === null) {
      continueRoutine = false;
    } else {
      if (acc === 1) {
        fbTxt.setText(`Correct!\n\nYour response: ${resp_raw}`);
      } else {
        const keyStr = corr_answer_display ? `\nCorrect answer: ${corr_answer_display}` : '';
        fbTxt.setText(`Incorrect.\n\nYour response: ${resp_raw}${keyStr}`);
      }
      fbClock = new util.Clock();
      fbClock.reset();
    }
    
    psychoJS.experiment.addData('Feedback.started', globalClock.getTime());
    FeedbackMaxDuration = null
    // keep track of which components have finished
    FeedbackComponents = [];
    FeedbackComponents.push(fbTxt);
    
    for (const thisComponent of FeedbackComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}

function FeedbackRoutineEachFrame() {
  return async function () {
    //--- Loop for each frame of Routine 'Feedback' ---
    // get current time
    t = FeedbackClock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    // Run 'Each Frame' code from FBCode
    if (typeof fbClock !== 'undefined' && fbClock.getTime() >= 2.0) {
      continueRoutine = false;
    }
    
    
    // *fbTxt* updates
    if (t >= 0.0 && fbTxt.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      fbTxt.tStart = t;  // (not accounting for frame time here)
      fbTxt.frameNStart = frameN;  // exact frame index
      
      fbTxt.setAutoDraw(true);
    }
    
    
    // if fbTxt is active this frame...
    if (fbTxt.status === PsychoJS.Status.STARTED) {
    }
    
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {  // a component has requested a forced-end of Routine
      routineForceEnded = true;
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;  // reverts to True if at least one component still running
    for (const thisComponent of FeedbackComponents)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    // refresh the screen if continuing
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}

function FeedbackRoutineEnd(snapshot) {
  return async function () {
    //--- Ending Routine 'Feedback' ---
    for (const thisComponent of FeedbackComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    psychoJS.experiment.addData('Feedback.stopped', globalClock.getTime());
    // the Routine "Feedback" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset();
    
    // Routines running outside a loop should always advance the datafile row
    if (currentLoop === psychoJS.experiment) {
      psychoJS.experiment.nextEntry(snapshot);
    }
    return Scheduler.Event.NEXT;
  }
}

function SummaryRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
    //--- Prepare to start Routine 'Summary' ---
    t = 0;
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    // keep track of whether this Routine was forcibly ended
    routineForceEnded = false;
    SummaryClock.reset();
    routineTimer.reset();
    SummaryMaxDurationReached = false;
    // update component parameters for each repeat
    sumKB.keys = undefined;
    sumKB.rt = undefined;
    _sumKB_allKeys = [];
    // Run 'Begin Routine' code from SumCode

    const uniqCorrect = uniqueCorrectCount();
    const wrongCount = Math.max(0, UNIQUE_TOTAL - uniqCorrect);
    const pct = (UNIQUE_TOTAL > 0) ? (100.0 * uniqCorrect / UNIQUE_TOTAL) : 0.0;
    const wk = getWeekVal();

    
    showRetryBtn = (wrongCount > 0);
if (wrongCount > 0) {
      sumTxt.setText(
        `Week ${wk} Spaced Retrieval Practice\n\n` +
        `Attempt ${ATTEMPT_INDEX}: you got ${uniqCorrect} / ${UNIQUE_TOTAL} correct (${pct.toFixed(1)}%).\n\n` +
        `Press [Enter] or click the Start button to reattempt ${wrongCount} incorrect question${wrongCount === 1 ? '' : 's'}.`
      );
    } else {
      sumTxt.setText(
        `Week ${wk} Spaced Retrieval Practice\n\n` +
        `You have now answered all questions correctly! 🎉\n\n` +
        `Please take a screenshot of this screen for your records.\n` +
        `Press [Enter] when finished.`
      );
    }
psychoJS.experiment.addData('Summary.started', globalClock.getTime());
    SummaryMaxDuration = null
    // keep track of which components have finished
    SummaryComponents = [];
    SummaryComponents.push(sumTxt);
    SummaryComponents.push(startBtn2);
    SummaryComponents.push(startLbl2);
    SummaryComponents.push(sumKB);
    
    for (const thisComponent of SummaryComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}

function SummaryRoutineEachFrame() {
  return async function () {
    //--- Loop for each frame of Routine 'Summary' ---
    // get current time
    t = SummaryClock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    
    // *sumTxt* updates
    if (t >= 0.0 && sumTxt.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      sumTxt.tStart = t;  // (not accounting for frame time here)
      sumTxt.frameNStart = frameN;  // exact frame index
      
      sumTxt.setAutoDraw(true);
    }
    
    
    // if sumTxt is active this frame...
    if (sumTxt.status === PsychoJS.Status.STARTED) {
    }
    
    
    // *sumKB* updates
    if (t >= 0.0 && sumKB.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      sumKB.tStart = t;  // (not accounting for frame time here)
      sumKB.frameNStart = frameN;  // exact frame index
      
      // keyboard checking is just starting
      psychoJS.window.callOnFlip(function() { sumKB.clock.reset(); });  // t=0 on next screen flip
      psychoJS.window.callOnFlip(function() { sumKB.start(); }); // start on screen flip
      psychoJS.window.callOnFlip(function() { sumKB.clearEvents(); });
    }
    
    // if sumKB is active this frame...
    if (sumKB.status === PsychoJS.Status.STARTED) {
      let theseKeys = sumKB.getKeys({keyList: ['return','enter'], waitRelease: false});
      _sumKB_allKeys = _sumKB_allKeys.concat(theseKeys);
      if (_sumKB_allKeys.length > 0) {
        sumKB.keys = _sumKB_allKeys[_sumKB_allKeys.length - 1].name;  // just the last key pressed
        sumKB.rt = _sumKB_allKeys[_sumKB_allKeys.length - 1].rt;
        sumKB.duration = _sumKB_allKeys[_sumKB_allKeys.length - 1].duration;
        // a response ends the routine
        continueRoutine = false;
      }
    }
    
    
// Show and handle Start button (mobile) if there are items to reattempt
if (showRetryBtn) {
  if (t >= 0.0 && startBtn2.status === PsychoJS.Status.NOT_STARTED) {
    startBtn2.tStart = t; startBtn2.frameNStart = frameN;
    startBtn2.setAutoDraw(true);
  }
  if (t >= 0.0 && startLbl2.status === PsychoJS.Status.NOT_STARTED) {
    startLbl2.tStart = t; startLbl2.frameNStart = frameN;
    startLbl2.setAutoDraw(true);
  }
  if (typeof mouseStart2 !== 'undefined') {
    const buttons2 = mouseStart2.getPressed();
    if ((buttons2[0] === 1) && mouseStart2.isPressedIn(startBtn2)) {
      continueRoutine = false;
    }
  }
}
// check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {  // a component has requested a forced-end of Routine
      routineForceEnded = true;
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;  // reverts to True if at least one component still running
    for (const thisComponent of SummaryComponents)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    // refresh the screen if continuing
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}

function SummaryRoutineEnd(snapshot) {
  return async function () {
    //--- Ending Routine 'Summary' ---
    for (const thisComponent of SummaryComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    psychoJS.experiment.addData('Summary.stopped', globalClock.getTime());
    // update the trial handler
    if (currentLoop instanceof MultiStairHandler) {
      currentLoop.addResponse(sumKB.corr, level);
    }
    psychoJS.experiment.addData('sumKB.keys', sumKB.keys);
    if (typeof sumKB.keys !== 'undefined') {  // we had a response
        psychoJS.experiment.addData('sumKB.rt', sumKB.rt);
        psychoJS.experiment.addData('sumKB.duration', sumKB.duration);
        routineTimer.reset();
        }
    
    sumKB.stop();
    
    // (No per-trial counters here; Summary just decides next steps)
    const uniqCorrect = uniqueCorrectCount();
    const wrongCount = Math.max(0, UNIQUE_TOTAL - uniqCorrect);

    if (wrongCount > 0) {
      // Build a new pass with only incorrect items
      const rows = wrongItemsList();
      ATTEMPT_INDEX += 1;

      const dynamicScheduler = new Scheduler(psychoJS);
      flowScheduler.add(dynamicLoopLoopBegin(dynamicScheduler, rows, `redoLoop_attempt${ATTEMPT_INDEX-1}`));
      flowScheduler.add(dynamicScheduler);
      flowScheduler.add(dynamicLoopLoopEnd);

      // After that pass, show Summary again
      flowScheduler.add(SummaryRoutineBegin());
      flowScheduler.add(SummaryRoutineEachFrame());
      flowScheduler.add(SummaryRoutineEnd());
    } else {
      // All done — now quit after this Summary (user presses Enter to continue)
      flowScheduler.add(quitPsychoJS, 'Thank you!', true);
    }
// the Routine "Summary" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset();
    
    // Routines running outside a loop should always advance the datafile row
    if (currentLoop === psychoJS.experiment) {
      psychoJS.experiment.nextEntry(snapshot);
    }
    return Scheduler.Event.NEXT;
  }
}

function importConditions(currentLoop) {
  return async function () {
    psychoJS.importAttributes(currentLoop.getCurrentTrial());
    return Scheduler.Event.NEXT;
    };
}

function quitPsychoJS(message, isCompleted) {
  try {
    const info = (typeof expInfo !== "undefined" && expInfo) ? expInfo : (psychoJS?.experiment?._experimentInfo || {});
    const student = (info.participant || info.Participant || "").toString().trim();
    const week = (info.week || info.Week || info.weekNumber || "").toString().trim();
    const today = new Date().toISOString().slice(0,10); // YYYY-MM-DD
    const filename = `CHEM112 SRP_${student}_${week}_${today}.csv`;

    if (window.CHEM112_PRIVATE?.onQuitUploadIfCompleted) {
      window.CHEM112_PRIVATE.onQuitUploadIfCompleted(psychoJS, !!isCompleted, filename);
    } else {
      console.warn("[CHEM112] helper not found on window.CHEM112_PRIVATE");
    }
  } catch (e) {
    console.error("[CHEM112] quit hook error:", e);
  }

  try { psychoJS.window.close(); } catch(e) {}
  psychoJS.quit({ message, isCompleted });
  return Scheduler.Event.QUIT;
}


