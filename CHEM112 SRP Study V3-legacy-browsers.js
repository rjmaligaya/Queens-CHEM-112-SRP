/***************************** 
 * Chem112 Srp Study V3 *
 *****************************/


// store info about the experiment session:
let expName = 'CHEM112 SRP Study V3';  // from the Builder filename that created this script
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
if (window.CHEM112_PRIVATE) window.CHEM112_PRIVATE.patchExperiment(psychoJS);

// open window:
psychoJS.openWindow({
  fullscr: true,
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
psychoJS.schedule(async function(){
  try {
    const cfg = window.CHEM112_CONFIG || {};
    const rawSN = String(expInfo['Student Number']||'').trim();
    const rawWeek = String(expInfo['Week (4, 5, 6, 7, 8, or 10)']||'').trim();
    const week = rawWeek.replace(/[^0-9]/g,'');
    const student = rawSN.replace(/\D/g,'');
    if (window.CHEM112_PRIVATE) window.CHEM112_PRIVATE.setExpInfo(student, week);
    const digits = (cfg.REQUIRE_DIGITS|0) || 8;
    const allowed = (cfg.ALLOWED_WEEKS||[]).map(String);
    const okSN = /^\d+$/.test(student) && student.length===digits;
    const okWk = allowed.includes(week);
    if (!okSN || !okWk){
      window.alert('Please enter a valid 8-digit student number and choose a valid week: ' + allowed.join(', '));
      psychoJS.gui.dialogComponent.button = undefined;
      psychoJS.schedule(psychoJS.gui.DlgFromDict({dictionary: expInfo, title: expName}));
      return Scheduler.Event.NEXT;
    }
  } catch(e){}
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
flowScheduler.add(quitPsychoJS, 'Thank you for your participation!', true);

// quit if user presses Cancel in dialog box:
dialogCancelScheduler.add(quitPsychoJS, 'Thank you for your participation!', false);

psychoJS.start({
  expName: expName,
  expInfo: expInfo,
  resources: [
    // resources:
    {'name': 'default.png', 'path': 'https://pavlovia.org/assets/default/default.png'},
    {'name': 'stimuli_master_simple.csv', 'path': 'stimuli_master_simple.csv'},
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
    text: 'Welcome to the Spaced Retrieval Practice Study!\nYou will be given a set of questions, please answer to the best of your ability. Once you have finished typing, press [Enter] to submit.\nFeedback for a Correct or Incorrect Answer will be shown for 10 seconds, afterwards the new question will show.\nIf you are ready, press [Space] to begin.',
    font: 'Arial',
    units: undefined, 
    pos: [0, 0], draggable: false, height: 0.05,  wrapWidth: undefined, ori: 0.0,
    languageStyle: 'LTR',
    color: new util.Color('white'),  opacity: undefined,
    depth: 0.0 
  });
  
  introKey = new core.Keyboard({psychoJS: psychoJS, clock: new util.Clock(), waitForStart: true});
  
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
    if (!s) return '';
    s = s.trim().toLowerCase();
    s = s.replace(/[\s,-]+/g, '');
    s = s.replace(/[–—]/g, '-');
    return s;
  }
  
  function answer_set(correct_answer) {
    if (!correct_answer) return new Set();
    const alts = correct_answer.split('||').map(a => a.trim()).filter(a => a.length > 0);
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
  var TOTAL_TRIALS = 0;
  var TOTAL_CORRECT = 0;
  
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
    size : [0.5, 0.45],
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
    pos: [0, 0.05], draggable: false, height: 0.05,  wrapWidth: undefined, ori: 0.0,
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
    color: 'white', colorSpace: 'rgb',
    fillColor: undefined, borderColor: undefined,
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
    
    IntroComponents.forEach( function(thisComponent) {
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
       });
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
    IntroComponents.forEach( function(thisComponent) {
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
      }
    });
    
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
    IntroComponents.forEach( function(thisComponent) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    });
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
      trialList: undefined,
      seed: undefined, name: 'trialsLoop'
    });
    psychoJS.experiment.addLoop(trialsLoop); // add the loop to the experiment
    currentLoop = trialsLoop;  // we're now the current loop
    
    // Schedule all the trials in the trialList:
    trialsLoop.forEach(function() {
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
    });
    
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
    attemptLoop.forEach(function() {
      snapshot = attemptLoop.getSnapshot();
    
      attemptLoopLoopScheduler.add(importConditions(snapshot));
      attemptLoopLoopScheduler.add(TrialRoutineBegin(snapshot));
      attemptLoopLoopScheduler.add(TrialRoutineEachFrame());
      attemptLoopLoopScheduler.add(TrialRoutineEnd(snapshot));
      attemptLoopLoopScheduler.add(FeedbackRoutineBegin(snapshot));
      attemptLoopLoopScheduler.add(FeedbackRoutineEachFrame());
      attemptLoopLoopScheduler.add(FeedbackRoutineEnd(snapshot));
      attemptLoopLoopScheduler.add(attemptLoopLoopEndIteration(attemptLoopLoopScheduler, snapshot));
    });
    
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
      window.attemptReps = 4;
    } else if (_t === 'organic' && [4,5,7,10].includes(_wk)) {
      window.attemptReps = 1;
    } else if (_t === 'dimensional' && [4,6,8,10].includes(_wk)) {
      window.attemptReps = 1;
    } else {
      window.attemptReps = 0;
    }
    
    psychoJS.experiment.addData('SetReps.started', globalClock.getTime());
    SetRepsMaxDuration = null
    // keep track of which components have finished
    SetRepsComponents = [];
    
    SetRepsComponents.forEach( function(thisComponent) {
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
       });
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
    SetRepsComponents.forEach( function(thisComponent) {
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
      }
    });
    
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
    SetRepsComponents.forEach( function(thisComponent) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    });
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
    var invalidFlag = false;
    var invalidClock = null;
    invalidPanel.setOpacity(0);
    invalidText.setOpacity(0);
    
    // RT & scoring state
    var _trialClock = new util.Clock();
    var _rt_started = false;
    var _rt = -1.0;
    
    var _response_raw = '';
    var _response_norm = '';
    var is_correct = -1;  // becomes 0/1 only on valid submission
    
    // Acceptable answers for this row
    var _correct_ans_norm = answer_set(correct_answer);
    
    // Image visibility for prompt-only trials
    const stim_has_image = !!(image_file && image_file.toString().trim().length > 0);
    stimImage.setOpacity(stim_has_image ? 1 : 0);
    
    // Reset hand-off vars
    acc = null;
    resp_raw = '';
    corr_answer_display = '';
    
    stimImage.setImage(image_file);
    promptTxt.setText(prompt_text);
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
    
    TrialComponents.forEach( function(thisComponent) {
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
       });
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
    TrialComponents.forEach( function(thisComponent) {
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
      }
    });
    
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
    TrialComponents.forEach( function(thisComponent) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    });
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
    
    FeedbackComponents.forEach( function(thisComponent) {
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
       });
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
    FeedbackComponents.forEach( function(thisComponent) {
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
      }
    });
    
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
    FeedbackComponents.forEach( function(thisComponent) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    });
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
    const pct = (TOTAL_TRIALS > 0) ? (100.0 * TOTAL_CORRECT / TOTAL_TRIALS) : 0.0;
    sumTxt.setText(
      `Session complete!\n\n` +
      `Correct: ${TOTAL_CORRECT} / ${TOTAL_TRIALS} (${pct.toFixed(1)}%)\n\n` +
      `Press SPACE to finish.`
    );
    
    psychoJS.experiment.addData('Summary.started', globalClock.getTime());
    SummaryMaxDuration = null
    // keep track of which components have finished
    SummaryComponents = [];
    SummaryComponents.push(sumTxt);
    SummaryComponents.push(sumKB);
    
    SummaryComponents.forEach( function(thisComponent) {
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
       });
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
      let theseKeys = sumKB.getKeys({keyList: 'space', waitRelease: false});
      _sumKB_allKeys = _sumKB_allKeys.concat(theseKeys);
      if (_sumKB_allKeys.length > 0) {
        sumKB.keys = _sumKB_allKeys[_sumKB_allKeys.length - 1].name;  // just the last key pressed
        sumKB.rt = _sumKB_allKeys[_sumKB_allKeys.length - 1].rt;
        sumKB.duration = _sumKB_allKeys[_sumKB_allKeys.length - 1].duration;
        // a response ends the routine
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
    SummaryComponents.forEach( function(thisComponent) {
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
      }
    });
    
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
    SummaryComponents.forEach( function(thisComponent) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    });
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
    // Run 'End Routine' code from SumCode
    TOTAL_TRIALS += 1;
    TOTAL_CORRECT += is_correct;
    
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

async function quitPsychoJS(message, isCompleted) {
  try { if (window.CHEM112_PRIVATE) { await window.CHEM112_PRIVATE.onQuitUploadIfCompleted(psychoJS, isCompleted); } } catch(e){}

  // Check for and save orphaned data
  if (psychoJS.experiment.isEntryEmpty()) {
    psychoJS.experiment.nextEntry();
  }
  psychoJS.window.close();
  psychoJS.quit({message: message, isCompleted: isCompleted});
  
  return Scheduler.Event.QUIT;
}
