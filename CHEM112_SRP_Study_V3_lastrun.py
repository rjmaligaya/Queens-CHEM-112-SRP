#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
This experiment was created using PsychoPy3 Experiment Builder (v2025.1.1),
    on August 20, 2025, at 17:11
If you publish work using this script the most relevant publication is:

    Peirce J, Gray JR, Simpson S, MacAskill M, Höchenberger R, Sogo H, Kastman E, Lindeløv JK. (2019) 
        PsychoPy2: Experiments in behavior made easy Behav Res 51: 195. 
        https://doi.org/10.3758/s13428-018-01193-y

"""

# --- Import packages ---
from psychopy import locale_setup
from psychopy import prefs
from psychopy import plugins
plugins.activatePlugins()
prefs.hardware['audioLib'] = 'ptb'
from psychopy import sound, gui, visual, core, data, event, logging, clock, colors, layout, hardware
from psychopy.tools import environmenttools
from psychopy.constants import (
    NOT_STARTED, STARTED, PLAYING, PAUSED, STOPPED, STOPPING, FINISHED, PRESSED, 
    RELEASED, FOREVER, priority
)

import numpy as np  # whole numpy lib is available, prepend 'np.'
from numpy import (sin, cos, tan, log, log10, pi, average,
                   sqrt, std, deg2rad, rad2deg, linspace, asarray)
from numpy.random import random, randint, normal, shuffle, choice as randchoice
import os  # handy system and path functions
import sys  # to get file system encoding

from psychopy.hardware import keyboard

# --- Setup global variables (available in all functions) ---
# create a device manager to handle hardware (keyboards, mice, mirophones, speakers, etc.)
deviceManager = hardware.DeviceManager()
# ensure that relative paths start from the same directory as this script
_thisDir = os.path.dirname(os.path.abspath(__file__))
# store info about the experiment session
psychopyVersion = '2025.1.1'
expName = 'CHEM112 SRP Study V3'  # from the Builder filename that created this script
expVersion = ''
# a list of functions to run when the experiment ends (starts off blank)
runAtExit = []
# information about this experiment
expInfo = {
    'Student Number': '',
    'Week (4, 5, 6, 7, 8, or 10)': '',
    'date|hid': data.getDateStr(),
    'expName|hid': expName,
    'expVersion|hid': expVersion,
    'psychopyVersion|hid': psychopyVersion,
}

# --- Define some variables which will change depending on pilot mode ---
'''
To run in pilot mode, either use the run/pilot toggle in Builder, Coder and Runner, 
or run the experiment with `--pilot` as an argument. To change what pilot 
#mode does, check out the 'Pilot mode' tab in preferences.
'''
# work out from system args whether we are running in pilot mode
PILOTING = core.setPilotModeFromArgs()
# start off with values from experiment settings
_fullScr = True
_winSize = [1707, 1067]
# if in pilot mode, apply overrides according to preferences
if PILOTING:
    # force windowed mode
    if prefs.piloting['forceWindowed']:
        _fullScr = False
        # set window size
        _winSize = prefs.piloting['forcedWindowSize']

def showExpInfoDlg(expInfo):
    """
    Show participant info dialog.
    Parameters
    ==========
    expInfo : dict
        Information about this experiment.
    
    Returns
    ==========
    dict
        Information about this experiment.
    """
    # show participant info dialog
    dlg = gui.DlgFromDict(
        dictionary=expInfo, sortKeys=False, title=expName, alwaysOnTop=True
    )
    if dlg.OK == False:
        core.quit()  # user pressed cancel
    # return expInfo
    return expInfo


def setupData(expInfo, dataDir=None):
    """
    Make an ExperimentHandler to handle trials and saving.
    
    Parameters
    ==========
    expInfo : dict
        Information about this experiment, created by the `setupExpInfo` function.
    dataDir : Path, str or None
        Folder to save the data to, leave as None to create a folder in the current directory.    
    Returns
    ==========
    psychopy.data.ExperimentHandler
        Handler object for this experiment, contains the data to save and information about 
        where to save it to.
    """
    # remove dialog-specific syntax from expInfo
    for key, val in expInfo.copy().items():
        newKey, _ = data.utils.parsePipeSyntax(key)
        expInfo[newKey] = expInfo.pop(key)
    
    # data file name stem = absolute path + name; later add .psyexp, .csv, .log, etc
    if dataDir is None:
        dataDir = _thisDir
    filename = u"data/%s_%s_%s" % (expInfo['Student Number'] or 'anon', expName, expInfo['date'])
    # make sure filename is relative to dataDir
    if os.path.isabs(filename):
        dataDir = os.path.commonprefix([dataDir, filename])
        filename = os.path.relpath(filename, dataDir)
    
    # an ExperimentHandler isn't essential but helps with data saving
    thisExp = data.ExperimentHandler(
        name=expName, version=expVersion,
        extraInfo=expInfo, runtimeInfo=None,
        originPath='C:\\Users\\RJ Maligaya\\Desktop\\CHEM112 SRP Study at Queens\\CHEM112_SRP_Study_V3_lastrun.py',
        savePickle=True, saveWideText=True,
        dataFileName=dataDir + os.sep + filename, sortColumns='time'
    )
    thisExp.setPriority('thisRow.t', priority.CRITICAL)
    thisExp.setPriority('expName', priority.LOW)
    # return experiment handler
    return thisExp


def setupLogging(filename):
    """
    Setup a log file and tell it what level to log at.
    
    Parameters
    ==========
    filename : str or pathlib.Path
        Filename to save log file and data files as, doesn't need an extension.
    
    Returns
    ==========
    psychopy.logging.LogFile
        Text stream to receive inputs from the logging system.
    """
    # set how much information should be printed to the console / app
    if PILOTING:
        logging.console.setLevel(
            prefs.piloting['pilotConsoleLoggingLevel']
        )
    else:
        logging.console.setLevel('warning')
    # save a log file for detail verbose info
    logFile = logging.LogFile(filename+'.log')
    if PILOTING:
        logFile.setLevel(
            prefs.piloting['pilotLoggingLevel']
        )
    else:
        logFile.setLevel(
            logging.getLevel('info')
        )
    
    return logFile


def setupWindow(expInfo=None, win=None):
    """
    Setup the Window
    
    Parameters
    ==========
    expInfo : dict
        Information about this experiment, created by the `setupExpInfo` function.
    win : psychopy.visual.Window
        Window to setup - leave as None to create a new window.
    
    Returns
    ==========
    psychopy.visual.Window
        Window in which to run this experiment.
    """
    if PILOTING:
        logging.debug('Fullscreen settings ignored as running in pilot mode.')
    
    if win is None:
        # if not given a window to setup, make one
        win = visual.Window(
            size=_winSize, fullscr=_fullScr, screen=0,
            winType='pyglet', allowGUI=False, allowStencil=True,
            monitor='testMonitor', color=[0,0,0], colorSpace='rgb',
            backgroundImage='', backgroundFit='none',
            blendMode='avg', useFBO=True,
            units='height',
            checkTiming=False  # we're going to do this ourselves in a moment
        )
    else:
        # if we have a window, just set the attributes which are safe to set
        win.color = [0,0,0]
        win.colorSpace = 'rgb'
        win.backgroundImage = ''
        win.backgroundFit = 'none'
        win.units = 'height'
    if expInfo is not None:
        # get/measure frame rate if not already in expInfo
        if win._monitorFrameRate is None:
            win._monitorFrameRate = win.getActualFrameRate(infoMsg='Attempting to measure frame rate of screen, please wait...')
        expInfo['frameRate'] = win._monitorFrameRate
    win.hideMessage()
    if PILOTING:
        # show a visual indicator if we're in piloting mode
        if prefs.piloting['showPilotingIndicator']:
            win.showPilotingIndicator()
        # always show the mouse in piloting mode
        if prefs.piloting['forceMouseVisible']:
            win.mouseVisible = True
    
    return win


def setupDevices(expInfo, thisExp, win):
    """
    Setup whatever devices are available (mouse, keyboard, speaker, eyetracker, etc.) and add them to 
    the device manager (deviceManager)
    
    Parameters
    ==========
    expInfo : dict
        Information about this experiment, created by the `setupExpInfo` function.
    thisExp : psychopy.data.ExperimentHandler
        Handler object for this experiment, contains the data to save and information about 
        where to save it to.
    win : psychopy.visual.Window
        Window in which to run this experiment.
    Returns
    ==========
    bool
        True if completed successfully.
    """
    # --- Setup input devices ---
    ioConfig = {}
    ioSession = ioServer = eyetracker = None
    
    # store ioServer object in the device manager
    deviceManager.ioServer = ioServer
    
    # create a default keyboard (e.g. to check for escape)
    if deviceManager.getDevice('defaultKeyboard') is None:
        deviceManager.addDevice(
            deviceClass='keyboard', deviceName='defaultKeyboard', backend='ptb'
        )
    if deviceManager.getDevice('introKey') is None:
        # initialise introKey
        introKey = deviceManager.addDevice(
            deviceClass='keyboard',
            deviceName='introKey',
        )
    if deviceManager.getDevice('sumKB') is None:
        # initialise sumKB
        sumKB = deviceManager.addDevice(
            deviceClass='keyboard',
            deviceName='sumKB',
        )
    # return True if completed successfully
    return True

def pauseExperiment(thisExp, win=None, timers=[], currentRoutine=None):
    """
    Pause this experiment, preventing the flow from advancing to the next routine until resumed.
    
    Parameters
    ==========
    thisExp : psychopy.data.ExperimentHandler
        Handler object for this experiment, contains the data to save and information about 
        where to save it to.
    win : psychopy.visual.Window
        Window for this experiment.
    timers : list, tuple
        List of timers to reset once pausing is finished.
    currentRoutine : psychopy.data.Routine
        Current Routine we are in at time of pausing, if any. This object tells PsychoPy what Components to pause/play/dispatch.
    """
    # if we are not paused, do nothing
    if thisExp.status != PAUSED:
        return
    
    # start a timer to figure out how long we're paused for
    pauseTimer = core.Clock()
    # pause any playback components
    if currentRoutine is not None:
        for comp in currentRoutine.getPlaybackComponents():
            comp.pause()
    # make sure we have a keyboard
    defaultKeyboard = deviceManager.getDevice('defaultKeyboard')
    if defaultKeyboard is None:
        defaultKeyboard = deviceManager.addKeyboard(
            deviceClass='keyboard',
            deviceName='defaultKeyboard',
            backend='PsychToolbox',
        )
    # run a while loop while we wait to unpause
    while thisExp.status == PAUSED:
        # check for quit (typically the Esc key)
        if defaultKeyboard.getKeys(keyList=['escape']):
            endExperiment(thisExp, win=win)
        # dispatch messages on response components
        if currentRoutine is not None:
            for comp in currentRoutine.getDispatchComponents():
                comp.device.dispatchMessages()
        # sleep 1ms so other threads can execute
        clock.time.sleep(0.001)
    # if stop was requested while paused, quit
    if thisExp.status == FINISHED:
        endExperiment(thisExp, win=win)
    # resume any playback components
    if currentRoutine is not None:
        for comp in currentRoutine.getPlaybackComponents():
            comp.play()
    # reset any timers
    for timer in timers:
        timer.addTime(-pauseTimer.getTime())


def run(expInfo, thisExp, win, globalClock=None, thisSession=None):
    """
    Run the experiment flow.
    
    Parameters
    ==========
    expInfo : dict
        Information about this experiment, created by the `setupExpInfo` function.
    thisExp : psychopy.data.ExperimentHandler
        Handler object for this experiment, contains the data to save and information about 
        where to save it to.
    psychopy.visual.Window
        Window in which to run this experiment.
    globalClock : psychopy.core.clock.Clock or None
        Clock to get global time from - supply None to make a new one.
    thisSession : psychopy.session.Session or None
        Handle of the Session object this experiment is being run from, if any.
    """
    # mark experiment as started
    thisExp.status = STARTED
    # make sure window is set to foreground to prevent losing focus
    win.winHandle.activate()
    # make sure variables created by exec are available globally
    exec = environmenttools.setExecEnvironment(globals())
    # get device handles from dict of input devices
    ioServer = deviceManager.ioServer
    # get/create a default keyboard (e.g. to check for escape)
    defaultKeyboard = deviceManager.getDevice('defaultKeyboard')
    if defaultKeyboard is None:
        deviceManager.addDevice(
            deviceClass='keyboard', deviceName='defaultKeyboard', backend='PsychToolbox'
        )
    eyetracker = deviceManager.getDevice('eyetracker')
    # make sure we're running in the directory for this experiment
    os.chdir(_thisDir)
    # get filename from ExperimentHandler for convenience
    filename = thisExp.dataFileName
    frameTolerance = 0.001  # how close to onset before 'same' frame
    endExpNow = False  # flag for 'escape' or other condition => quit the exp
    # get frame duration from frame rate in expInfo
    if 'frameRate' in expInfo and expInfo['frameRate'] is not None:
        frameDur = 1.0 / round(expInfo['frameRate'])
    else:
        frameDur = 1.0 / 60.0  # could not measure, so guess
    
    # Start Code - component code to be run after the window creation
    
    # --- Initialize components for Routine "Intro" ---
    introText = visual.TextStim(win=win, name='introText',
        text='Welcome to the Spaced Retrieval Practice Study!\nYou will be given a set of questions, please answer to the best of your ability. Once you have finished typing, press [Enter] to submit.\nFeedback for a Correct or Incorrect Answer will be shown for 10 seconds, afterwards the new question will show.\nIf you are ready, press [Space] to begin.',
        font='Arial',
        pos=(0, 0), draggable=False, height=0.05, wrapWidth=None, ori=0.0, 
        color='white', colorSpace='rgb', opacity=None, 
        languageStyle='LTR',
        depth=0.0);
    introKey = keyboard.Keyboard(deviceName='introKey')
    
    # --- Initialize components for Routine "SetReps" ---
    
    # --- Initialize components for Routine "Trial" ---
    # Run 'Begin Experiment' code from TrialCode
    # --- Dialog keys (since you renamed the fields) ---
    WEEK_KEY = 'Week (4, 5, 6, 7, 8, or 10)'
    STUDENT_KEY = 'Student Number'
    ALLOWED_WEEKS = {4, 5, 6, 7, 8, 10}
    
    import re
    from psychopy import core
    import psychopy.hardware.keyboard as hwkb  # aliased to avoid shadowing Builder's 'keyboard'
    
    # Parse the week from the renamed dialog field
    def _parse_week(expInfo):
        s = str(expInfo.get(WEEK_KEY, '')).strip()
        m = re.search(r'\d+', s)
        wk = int(m.group()) if m else 4
        return wk if wk in ALLOWED_WEEKS else 4
    
    CURRENT_WEEK = _parse_week(expInfo)
    
    # Our keyboard for the Trial routine
    kb = hwkb.Keyboard()
    
    # ---------- Utilities ----------
    def norm_answer(s: str) -> str:
        if s is None:
            return ""
        s = s.strip().lower()
        s = re.sub(r'[\s,-]+', '', s)
        s = s.replace('–','-').replace('—','-')
        return s
    
    def answer_set(correct_answer: str):
        if not correct_answer:
            return set()
        alts = [a.strip() for a in correct_answer.split('||')]
        return {norm_answer(a) for a in alts}
    
    def repsFor(topic_val, week_val: int) -> int:
        t = (topic_val or "").strip().lower()
        if t == "organic":
            return 1 if week_val in (4, 5, 7, 10) else 0
        if t == "dimensional":
            return 1 if week_val in (4, 6, 8, 10) else 0
        if t == "inorganic":
            return 4 if week_val == 10 else 0
        return 0
    
    # Summary counters
    TOTAL_TRIALS = 0
    TOTAL_CORRECT = 0
    
    # Vars passed to Feedback
    acc = None
    resp_raw = ""
    corr_answer_display = ""
    
    stimImage = visual.ImageStim(
        win=win,
        name='stimImage', units='height', 
        image='default.png', mask=None, anchor='center',
        ori=0.0, pos=(0, 0.25), draggable=False, size=(0.5, 0.45),
        color=[1,1,1], colorSpace='rgb', opacity=None,
        flipHoriz=False, flipVert=False,
        texRes=128.0, interpolate=True, depth=-1.0)
    promptTxt = visual.TextStim(win=win, name='promptTxt',
        text='',
        font='Arial',
        pos=(0, 0.05), draggable=False, height=0.05, wrapWidth=None, ori=0.0, 
        color='white', colorSpace='rgb', opacity=None, 
        languageStyle='LTR',
        depth=-2.0);
    respBox = visual.TextBox2(
         win, text=None, placeholder='Type your answer, then press [Enter]', font='Arial',
         ori=0.0, pos=(0, -0.35), draggable=False,      letterHeight=0.05,
         size=(0.9, 0.12), borderWidth=2.0,
         color='white', colorSpace='rgb',
         opacity=None,
         bold=False, italic=False,
         lineSpacing=1.0, speechPoint=None,
         padding=0.0, alignment='center',
         anchor='center', overflow='visible',
         fillColor=None, borderColor=None,
         flipHoriz=False, flipVert=False, languageStyle='LTR',
         editable=True,
         name='respBox',
         depth=-3, autoLog=True,
    )
    warnTxt = visual.TextStim(win=win, name='warnTxt',
        text='Please type an answer before submitting',
        font='Arial',
        pos=(0, -0.48), draggable=False, height=0.05, wrapWidth=None, ori=0.0, 
        color=[1.0000, -1.0000, -1.0000], colorSpace='rgb', opacity=0.0, 
        languageStyle='LTR',
        depth=-4.0);
    invalidPanel = visual.Rect(
        win=win, name='invalidPanel',
        width=(2, 2)[0], height=(2, 2)[1],
        ori=0.0, pos=(0, 0), draggable=False, anchor='center',
        lineWidth=1.0,
        colorSpace='rgb', lineColor='white', fillColor=[-1.0000, -1.0000, -1.0000],
        opacity=0.0, depth=-5.0, interpolate=True)
    invalidText = visual.TextStim(win=win, name='invalidText',
        text='Answer invalid. Please properly attempt the question.',
        font='Arial',
        pos=(0, 0), draggable=False, height=0.05, wrapWidth=None, ori=0.0, 
        color='white', colorSpace='rgb', opacity=0.0, 
        languageStyle='LTR',
        depth=-6.0);
    
    # --- Initialize components for Routine "Feedback" ---
    fbTxt = visual.TextStim(win=win, name='fbTxt',
        text=None,
        font='Arial',
        pos=(0, 0), draggable=False, height=0.05, wrapWidth=None, ori=0.0, 
        color='white', colorSpace='rgb', opacity=None, 
        languageStyle='LTR',
        depth=-1.0);
    
    # --- Initialize components for Routine "Summary" ---
    sumTxt = visual.TextStim(win=win, name='sumTxt',
        text=None,
        font='Arial',
        pos=(0, 0), draggable=False, height=0.05, wrapWidth=None, ori=0.0, 
        color='white', colorSpace='rgb', opacity=None, 
        languageStyle='LTR',
        depth=0.0);
    sumKB = keyboard.Keyboard(deviceName='sumKB')
    # Run 'Begin Experiment' code from SumCode
    TOTAL_TRIALS = 0
    TOTAL_CORRECT = 0
    
    
    # create some handy timers
    
    # global clock to track the time since experiment started
    if globalClock is None:
        # create a clock if not given one
        globalClock = core.Clock()
    if isinstance(globalClock, str):
        # if given a string, make a clock accoridng to it
        if globalClock == 'float':
            # get timestamps as a simple value
            globalClock = core.Clock(format='float')
        elif globalClock == 'iso':
            # get timestamps in ISO format
            globalClock = core.Clock(format='%Y-%m-%d_%H:%M:%S.%f%z')
        else:
            # get timestamps in a custom format
            globalClock = core.Clock(format=globalClock)
    if ioServer is not None:
        ioServer.syncClock(globalClock)
    logging.setDefaultClock(globalClock)
    # routine timer to track time remaining of each (possibly non-slip) routine
    routineTimer = core.Clock()
    win.flip()  # flip window to reset last flip timer
    # store the exact time the global clock started
    expInfo['expStart'] = data.getDateStr(
        format='%Y-%m-%d %Hh%M.%S.%f %z', fractionalSecondDigits=6
    )
    
    # --- Prepare to start Routine "Intro" ---
    # create an object to store info about Routine Intro
    Intro = data.Routine(
        name='Intro',
        components=[introText, introKey],
    )
    Intro.status = NOT_STARTED
    continueRoutine = True
    # update component parameters for each repeat
    # create starting attributes for introKey
    introKey.keys = []
    introKey.rt = []
    _introKey_allKeys = []
    # store start times for Intro
    Intro.tStartRefresh = win.getFutureFlipTime(clock=globalClock)
    Intro.tStart = globalClock.getTime(format='float')
    Intro.status = STARTED
    thisExp.addData('Intro.started', Intro.tStart)
    Intro.maxDuration = None
    # keep track of which components have finished
    IntroComponents = Intro.components
    for thisComponent in Intro.components:
        thisComponent.tStart = None
        thisComponent.tStop = None
        thisComponent.tStartRefresh = None
        thisComponent.tStopRefresh = None
        if hasattr(thisComponent, 'status'):
            thisComponent.status = NOT_STARTED
    # reset timers
    t = 0
    _timeToFirstFrame = win.getFutureFlipTime(clock="now")
    frameN = -1
    
    # --- Run Routine "Intro" ---
    Intro.forceEnded = routineForceEnded = not continueRoutine
    while continueRoutine:
        # get current time
        t = routineTimer.getTime()
        tThisFlip = win.getFutureFlipTime(clock=routineTimer)
        tThisFlipGlobal = win.getFutureFlipTime(clock=None)
        frameN = frameN + 1  # number of completed frames (so 0 is the first frame)
        # update/draw components on each frame
        
        # *introText* updates
        
        # if introText is starting this frame...
        if introText.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
            # keep track of start time/frame for later
            introText.frameNStart = frameN  # exact frame index
            introText.tStart = t  # local t and not account for scr refresh
            introText.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(introText, 'tStartRefresh')  # time at next scr refresh
            # add timestamp to datafile
            thisExp.timestampOnFlip(win, 'introText.started')
            # update status
            introText.status = STARTED
            introText.setAutoDraw(True)
        
        # if introText is active this frame...
        if introText.status == STARTED:
            # update params
            pass
        
        # *introKey* updates
        waitOnFlip = False
        
        # if introKey is starting this frame...
        if introKey.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
            # keep track of start time/frame for later
            introKey.frameNStart = frameN  # exact frame index
            introKey.tStart = t  # local t and not account for scr refresh
            introKey.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(introKey, 'tStartRefresh')  # time at next scr refresh
            # add timestamp to datafile
            thisExp.timestampOnFlip(win, 'introKey.started')
            # update status
            introKey.status = STARTED
            # keyboard checking is just starting
            waitOnFlip = True
            win.callOnFlip(introKey.clock.reset)  # t=0 on next screen flip
            win.callOnFlip(introKey.clearEvents, eventType='keyboard')  # clear events on next screen flip
        if introKey.status == STARTED and not waitOnFlip:
            theseKeys = introKey.getKeys(keyList=['space'], ignoreKeys=["escape"], waitRelease=False)
            _introKey_allKeys.extend(theseKeys)
            if len(_introKey_allKeys):
                introKey.keys = _introKey_allKeys[-1].name  # just the last key pressed
                introKey.rt = _introKey_allKeys[-1].rt
                introKey.duration = _introKey_allKeys[-1].duration
                # a response ends the routine
                continueRoutine = False
        
        # check for quit (typically the Esc key)
        if defaultKeyboard.getKeys(keyList=["escape"]):
            thisExp.status = FINISHED
        if thisExp.status == FINISHED or endExpNow:
            endExperiment(thisExp, win=win)
            return
        # pause experiment here if requested
        if thisExp.status == PAUSED:
            pauseExperiment(
                thisExp=thisExp, 
                win=win, 
                timers=[routineTimer, globalClock], 
                currentRoutine=Intro,
            )
            # skip the frame we paused on
            continue
        
        # check if all components have finished
        if not continueRoutine:  # a component has requested a forced-end of Routine
            Intro.forceEnded = routineForceEnded = True
            break
        continueRoutine = False  # will revert to True if at least one component still running
        for thisComponent in Intro.components:
            if hasattr(thisComponent, "status") and thisComponent.status != FINISHED:
                continueRoutine = True
                break  # at least one component has not yet finished
        
        # refresh the screen
        if continueRoutine:  # don't flip if this routine is over or we'll get a blank screen
            win.flip()
    
    # --- Ending Routine "Intro" ---
    for thisComponent in Intro.components:
        if hasattr(thisComponent, "setAutoDraw"):
            thisComponent.setAutoDraw(False)
    # store stop times for Intro
    Intro.tStop = globalClock.getTime(format='float')
    Intro.tStopRefresh = tThisFlipGlobal
    thisExp.addData('Intro.stopped', Intro.tStop)
    # check responses
    if introKey.keys in ['', [], None]:  # No response was made
        introKey.keys = None
    thisExp.addData('introKey.keys',introKey.keys)
    if introKey.keys != None:  # we had a response
        thisExp.addData('introKey.rt', introKey.rt)
        thisExp.addData('introKey.duration', introKey.duration)
    thisExp.nextEntry()
    # the Routine "Intro" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset()
    
    # set up handler to look after randomisation of conditions etc
    trialsLoop = data.TrialHandler2(
        name='trialsLoop',
        nReps=1.0, 
        method='random', 
        extraInfo=expInfo, 
        originPath=-1, 
        trialList=data.importConditions('stimuli_master_simple.csv'), 
        seed=None, 
    )
    thisExp.addLoop(trialsLoop)  # add the loop to the experiment
    thisTrialsLoop = trialsLoop.trialList[0]  # so we can initialise stimuli with some values
    # abbreviate parameter names if possible (e.g. rgb = thisTrialsLoop.rgb)
    if thisTrialsLoop != None:
        for paramName in thisTrialsLoop:
            globals()[paramName] = thisTrialsLoop[paramName]
    if thisSession is not None:
        # if running in a Session with a Liaison client, send data up to now
        thisSession.sendExperimentData()
    
    for thisTrialsLoop in trialsLoop:
        trialsLoop.status = STARTED
        if hasattr(thisTrialsLoop, 'status'):
            thisTrialsLoop.status = STARTED
        currentLoop = trialsLoop
        thisExp.timestampOnFlip(win, 'thisRow.t', format=globalClock.format)
        if thisSession is not None:
            # if running in a Session with a Liaison client, send data up to now
            thisSession.sendExperimentData()
        # abbreviate parameter names if possible (e.g. rgb = thisTrialsLoop.rgb)
        if thisTrialsLoop != None:
            for paramName in thisTrialsLoop:
                globals()[paramName] = thisTrialsLoop[paramName]
        
        # --- Prepare to start Routine "SetReps" ---
        # create an object to store info about Routine SetReps
        SetReps = data.Routine(
            name='SetReps',
            components=[],
        )
        SetReps.status = NOT_STARTED
        continueRoutine = True
        # update component parameters for each repeat
        # Run 'Begin Routine' code from SetRepsCode
        import re
        _wstr = str(expInfo['Week (4, 5, 6, 7, 8, or 10)']).strip()
        _m = re.search(r'\d+', _wstr); _wk = int(_m.group()) if _m else 4
        
        try:
            _t = (topic or '').strip().lower()
        except NameError:
            _t = ''
        
        if _t == 'inorganic' and _wk == 10:
            attemptReps = 4
        elif _t == 'organic' and _wk in (4, 5, 7, 10):
            attemptReps = 1
        elif _t == 'dimensional' and _wk in (4, 6, 8, 10):
            attemptReps = 1
        else:
            attemptReps = 0
        
        # store start times for SetReps
        SetReps.tStartRefresh = win.getFutureFlipTime(clock=globalClock)
        SetReps.tStart = globalClock.getTime(format='float')
        SetReps.status = STARTED
        thisExp.addData('SetReps.started', SetReps.tStart)
        SetReps.maxDuration = None
        # keep track of which components have finished
        SetRepsComponents = SetReps.components
        for thisComponent in SetReps.components:
            thisComponent.tStart = None
            thisComponent.tStop = None
            thisComponent.tStartRefresh = None
            thisComponent.tStopRefresh = None
            if hasattr(thisComponent, 'status'):
                thisComponent.status = NOT_STARTED
        # reset timers
        t = 0
        _timeToFirstFrame = win.getFutureFlipTime(clock="now")
        frameN = -1
        
        # --- Run Routine "SetReps" ---
        SetReps.forceEnded = routineForceEnded = not continueRoutine
        while continueRoutine:
            # if trial has changed, end Routine now
            if hasattr(thisTrialsLoop, 'status') and thisTrialsLoop.status == STOPPING:
                continueRoutine = False
            # get current time
            t = routineTimer.getTime()
            tThisFlip = win.getFutureFlipTime(clock=routineTimer)
            tThisFlipGlobal = win.getFutureFlipTime(clock=None)
            frameN = frameN + 1  # number of completed frames (so 0 is the first frame)
            # update/draw components on each frame
            
            # check for quit (typically the Esc key)
            if defaultKeyboard.getKeys(keyList=["escape"]):
                thisExp.status = FINISHED
            if thisExp.status == FINISHED or endExpNow:
                endExperiment(thisExp, win=win)
                return
            # pause experiment here if requested
            if thisExp.status == PAUSED:
                pauseExperiment(
                    thisExp=thisExp, 
                    win=win, 
                    timers=[routineTimer, globalClock], 
                    currentRoutine=SetReps,
                )
                # skip the frame we paused on
                continue
            
            # check if all components have finished
            if not continueRoutine:  # a component has requested a forced-end of Routine
                SetReps.forceEnded = routineForceEnded = True
                break
            continueRoutine = False  # will revert to True if at least one component still running
            for thisComponent in SetReps.components:
                if hasattr(thisComponent, "status") and thisComponent.status != FINISHED:
                    continueRoutine = True
                    break  # at least one component has not yet finished
            
            # refresh the screen
            if continueRoutine:  # don't flip if this routine is over or we'll get a blank screen
                win.flip()
        
        # --- Ending Routine "SetReps" ---
        for thisComponent in SetReps.components:
            if hasattr(thisComponent, "setAutoDraw"):
                thisComponent.setAutoDraw(False)
        # store stop times for SetReps
        SetReps.tStop = globalClock.getTime(format='float')
        SetReps.tStopRefresh = tThisFlipGlobal
        thisExp.addData('SetReps.stopped', SetReps.tStop)
        # the Routine "SetReps" was not non-slip safe, so reset the non-slip timer
        routineTimer.reset()
        
        # set up handler to look after randomisation of conditions etc
        attemptLoop = data.TrialHandler2(
            name='attemptLoop',
            nReps=attemptReps, 
            method='random', 
            extraInfo=expInfo, 
            originPath=-1, 
            trialList=[None], 
            seed=None, 
        )
        thisExp.addLoop(attemptLoop)  # add the loop to the experiment
        thisAttemptLoop = attemptLoop.trialList[0]  # so we can initialise stimuli with some values
        # abbreviate parameter names if possible (e.g. rgb = thisAttemptLoop.rgb)
        if thisAttemptLoop != None:
            for paramName in thisAttemptLoop:
                globals()[paramName] = thisAttemptLoop[paramName]
        if thisSession is not None:
            # if running in a Session with a Liaison client, send data up to now
            thisSession.sendExperimentData()
        
        for thisAttemptLoop in attemptLoop:
            attemptLoop.status = STARTED
            if hasattr(thisAttemptLoop, 'status'):
                thisAttemptLoop.status = STARTED
            currentLoop = attemptLoop
            thisExp.timestampOnFlip(win, 'thisRow.t', format=globalClock.format)
            if thisSession is not None:
                # if running in a Session with a Liaison client, send data up to now
                thisSession.sendExperimentData()
            # abbreviate parameter names if possible (e.g. rgb = thisAttemptLoop.rgb)
            if thisAttemptLoop != None:
                for paramName in thisAttemptLoop:
                    globals()[paramName] = thisAttemptLoop[paramName]
            
            # --- Prepare to start Routine "Trial" ---
            # create an object to store info about Routine Trial
            Trial = data.Routine(
                name='Trial',
                components=[stimImage, promptTxt, respBox, warnTxt, invalidPanel, invalidText],
            )
            Trial.status = NOT_STARTED
            continueRoutine = True
            # update component parameters for each repeat
            # Run 'Begin Routine' code from TrialCode
            respBox.reset()
            
            # purge any stray keys so prior Enter can't leak
            try:
                kb.clearEvents(eventType='keyboard')
            except Exception:
                pass
            
            # invalid overlay state
            invalidFlag = False
            invalidClock = None
            invalidPanel.opacity = 0
            invalidText.opacity = 0
            
            # RT & scoring state
            from psychopy import core
            _trialClock = core.Clock()
            _rt_started = False
            _rt = -1.0
            
            _response_raw = ""
            _response_norm = ""
            is_correct = -1  # becomes 0/1 only on valid submission
            
            _correct_ans_norm = answer_set(correct_answer)
            
            # show/hide image
            stim_has_image = bool(image_file) and str(image_file).strip() != ""
            stimImage.opacity = 1 if stim_has_image else 0
            
            # reset hand-off vars to feedback
            acc = None
            resp_raw = ""
            corr_answer_display = ""
            
            stimImage.setImage(image_file)
            promptTxt.setText(prompt_text)
            respBox.reset()
            # store start times for Trial
            Trial.tStartRefresh = win.getFutureFlipTime(clock=globalClock)
            Trial.tStart = globalClock.getTime(format='float')
            Trial.status = STARTED
            thisExp.addData('Trial.started', Trial.tStart)
            Trial.maxDuration = None
            # keep track of which components have finished
            TrialComponents = Trial.components
            for thisComponent in Trial.components:
                thisComponent.tStart = None
                thisComponent.tStop = None
                thisComponent.tStartRefresh = None
                thisComponent.tStopRefresh = None
                if hasattr(thisComponent, 'status'):
                    thisComponent.status = NOT_STARTED
            # reset timers
            t = 0
            _timeToFirstFrame = win.getFutureFlipTime(clock="now")
            frameN = -1
            
            # --- Run Routine "Trial" ---
            Trial.forceEnded = routineForceEnded = not continueRoutine
            while continueRoutine:
                # if trial has changed, end Routine now
                if hasattr(thisAttemptLoop, 'status') and thisAttemptLoop.status == STOPPING:
                    continueRoutine = False
                # get current time
                t = routineTimer.getTime()
                tThisFlip = win.getFutureFlipTime(clock=routineTimer)
                tThisFlipGlobal = win.getFutureFlipTime(clock=None)
                frameN = frameN + 1  # number of completed frames (so 0 is the first frame)
                # update/draw components on each frame
                # Run 'Each Frame' code from TrialCode
                # Keep routine alive unless we explicitly end it
                continueRoutine = True
                
                # Start RT on first draw
                if not _rt_started:
                    _rt_started = True
                    _trialClock.reset()
                
                # If overlay is up, hold ~2 s then hide and let them retry
                if invalidFlag:
                    if invalidClock is None:
                        from psychopy import core
                        invalidClock = core.Clock()
                        invalidClock.reset()
                    invalidPanel.opacity = 0.8
                    invalidText.opacity = 1
                    # Keep routine alive while overlay is showing
                    if invalidClock.getTime() >= 2.0:
                        invalidFlag = False
                        invalidPanel.opacity = 0
                        invalidText.opacity = 0
                        # clear the box so they must type afresh
                        respBox.text = ""
                        # clear key buffer so the previous Enter can't retrigger
                        try:
                            kb.clearEvents(eventType='keyboard')
                        except Exception:
                            pass
                    # DO NOT end routine here
                    # (no return; just let Builder draw next frame)
                else:
                    # Normal key handling (our own keyboard — no Builder keyboard component)
                    keys = kb.getKeys(keyList=['return'], waitRelease=False)
                    if keys:
                        # Sanitize textbox (remove CR/LF so Enter never adds a newline)
                        _response_raw = (respBox.text or "").replace('\r','').replace('\n','')
                        respBox.text = _response_raw  # reflect cleaned text in the box
                        _response_norm = norm_answer(_response_raw)
                
                        # INVALID: empty or < 2 normalized characters
                        if len(_response_norm) < 2:
                            invalidFlag = True
                            # also clear any pending keys right away
                            try:
                                kb.clearEvents(eventType='keyboard')
                            except Exception:
                                pass
                        else:
                            # VALID → score and end to Feedback
                            _rt = _trialClock.getTime()
                            is_correct = 1 if (len(_correct_ans_norm) > 0 and _response_norm in _correct_ans_norm) else 0
                
                            # Hand to Feedback (globals defined in Begin Routine)
                            acc = is_correct
                            resp_raw = _response_raw
                            corr_answer_display = correct_answer
                
                            continueRoutine = False  # proceed to Feedback
                
                
                # *stimImage* updates
                
                # if stimImage is starting this frame...
                if stimImage.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
                    # keep track of start time/frame for later
                    stimImage.frameNStart = frameN  # exact frame index
                    stimImage.tStart = t  # local t and not account for scr refresh
                    stimImage.tStartRefresh = tThisFlipGlobal  # on global time
                    win.timeOnFlip(stimImage, 'tStartRefresh')  # time at next scr refresh
                    # add timestamp to datafile
                    thisExp.timestampOnFlip(win, 'stimImage.started')
                    # update status
                    stimImage.status = STARTED
                    stimImage.setAutoDraw(True)
                
                # if stimImage is active this frame...
                if stimImage.status == STARTED:
                    # update params
                    pass
                
                # *promptTxt* updates
                
                # if promptTxt is starting this frame...
                if promptTxt.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
                    # keep track of start time/frame for later
                    promptTxt.frameNStart = frameN  # exact frame index
                    promptTxt.tStart = t  # local t and not account for scr refresh
                    promptTxt.tStartRefresh = tThisFlipGlobal  # on global time
                    win.timeOnFlip(promptTxt, 'tStartRefresh')  # time at next scr refresh
                    # add timestamp to datafile
                    thisExp.timestampOnFlip(win, 'promptTxt.started')
                    # update status
                    promptTxt.status = STARTED
                    promptTxt.setAutoDraw(True)
                
                # if promptTxt is active this frame...
                if promptTxt.status == STARTED:
                    # update params
                    pass
                
                # *respBox* updates
                
                # if respBox is starting this frame...
                if respBox.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
                    # keep track of start time/frame for later
                    respBox.frameNStart = frameN  # exact frame index
                    respBox.tStart = t  # local t and not account for scr refresh
                    respBox.tStartRefresh = tThisFlipGlobal  # on global time
                    win.timeOnFlip(respBox, 'tStartRefresh')  # time at next scr refresh
                    # add timestamp to datafile
                    thisExp.timestampOnFlip(win, 'respBox.started')
                    # update status
                    respBox.status = STARTED
                    respBox.setAutoDraw(True)
                
                # if respBox is active this frame...
                if respBox.status == STARTED:
                    # update params
                    pass
                
                # *warnTxt* updates
                
                # if warnTxt is active this frame...
                if warnTxt.status == STARTED:
                    # update params
                    pass
                
                # *invalidPanel* updates
                
                # if invalidPanel is starting this frame...
                if invalidPanel.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
                    # keep track of start time/frame for later
                    invalidPanel.frameNStart = frameN  # exact frame index
                    invalidPanel.tStart = t  # local t and not account for scr refresh
                    invalidPanel.tStartRefresh = tThisFlipGlobal  # on global time
                    win.timeOnFlip(invalidPanel, 'tStartRefresh')  # time at next scr refresh
                    # add timestamp to datafile
                    thisExp.timestampOnFlip(win, 'invalidPanel.started')
                    # update status
                    invalidPanel.status = STARTED
                    invalidPanel.setAutoDraw(True)
                
                # if invalidPanel is active this frame...
                if invalidPanel.status == STARTED:
                    # update params
                    pass
                
                # *invalidText* updates
                
                # if invalidText is starting this frame...
                if invalidText.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
                    # keep track of start time/frame for later
                    invalidText.frameNStart = frameN  # exact frame index
                    invalidText.tStart = t  # local t and not account for scr refresh
                    invalidText.tStartRefresh = tThisFlipGlobal  # on global time
                    win.timeOnFlip(invalidText, 'tStartRefresh')  # time at next scr refresh
                    # add timestamp to datafile
                    thisExp.timestampOnFlip(win, 'invalidText.started')
                    # update status
                    invalidText.status = STARTED
                    invalidText.setAutoDraw(True)
                
                # if invalidText is active this frame...
                if invalidText.status == STARTED:
                    # update params
                    pass
                
                # check for quit (typically the Esc key)
                if defaultKeyboard.getKeys(keyList=["escape"]):
                    thisExp.status = FINISHED
                if thisExp.status == FINISHED or endExpNow:
                    endExperiment(thisExp, win=win)
                    return
                # pause experiment here if requested
                if thisExp.status == PAUSED:
                    pauseExperiment(
                        thisExp=thisExp, 
                        win=win, 
                        timers=[routineTimer, globalClock], 
                        currentRoutine=Trial,
                    )
                    # skip the frame we paused on
                    continue
                
                # check if all components have finished
                if not continueRoutine:  # a component has requested a forced-end of Routine
                    Trial.forceEnded = routineForceEnded = True
                    break
                continueRoutine = False  # will revert to True if at least one component still running
                for thisComponent in Trial.components:
                    if hasattr(thisComponent, "status") and thisComponent.status != FINISHED:
                        continueRoutine = True
                        break  # at least one component has not yet finished
                
                # refresh the screen
                if continueRoutine:  # don't flip if this routine is over or we'll get a blank screen
                    win.flip()
            
            # --- Ending Routine "Trial" ---
            for thisComponent in Trial.components:
                if hasattr(thisComponent, "setAutoDraw"):
                    thisComponent.setAutoDraw(False)
            # store stop times for Trial
            Trial.tStop = globalClock.getTime(format='float')
            Trial.tStopRefresh = tThisFlipGlobal
            thisExp.addData('Trial.stopped', Trial.tStop)
            # Run 'End Routine' code from TrialCode
            # Only log a row if there was a VALID submission this attempt
            if is_correct >= 0:
                thisExp.addData('student_number', expInfo.get(STUDENT_KEY, ''))
                thisExp.addData('week', CURRENT_WEEK)
                thisExp.addData('topic', topic)
                thisExp.addData('subtype', subtype)
                thisExp.addData('item_id', item_id)
                thisExp.addData('image_file', image_file)
                thisExp.addData('prompt_text', prompt_text)
                thisExp.addData('correct_answer', correct_answer)
                thisExp.addData('response_raw', _response_raw)
                thisExp.addData('response_norm', _response_norm)
                thisExp.addData('rt', _rt)
                thisExp.addData('accuracy', is_correct)
            
                TOTAL_TRIALS += 1
                TOTAL_CORRECT += is_correct
            
            attemptLoop.addData('respBox.text',respBox.text)
            # the Routine "Trial" was not non-slip safe, so reset the non-slip timer
            routineTimer.reset()
            
            # --- Prepare to start Routine "Feedback" ---
            # create an object to store info about Routine Feedback
            Feedback = data.Routine(
                name='Feedback',
                components=[fbTxt],
            )
            Feedback.status = NOT_STARTED
            continueRoutine = True
            # update component parameters for each repeat
            # Run 'Begin Routine' code from FBCode
            from psychopy import core
            
            if acc is None:
                continueRoutine = False
            else:
                if acc == 1:
                    fbTxt.text = f"Correct!\n\nYour response: {resp_raw}"
                else:
                    key_str = f"\nCorrect answer: {corr_answer_display}" if corr_answer_display else ""
                    fbTxt.text = f"Incorrect.\n\nYour response: {resp_raw}{key_str}"
                fbClock = core.Clock()
                fbClock.reset()
            
            # store start times for Feedback
            Feedback.tStartRefresh = win.getFutureFlipTime(clock=globalClock)
            Feedback.tStart = globalClock.getTime(format='float')
            Feedback.status = STARTED
            thisExp.addData('Feedback.started', Feedback.tStart)
            Feedback.maxDuration = None
            # keep track of which components have finished
            FeedbackComponents = Feedback.components
            for thisComponent in Feedback.components:
                thisComponent.tStart = None
                thisComponent.tStop = None
                thisComponent.tStartRefresh = None
                thisComponent.tStopRefresh = None
                if hasattr(thisComponent, 'status'):
                    thisComponent.status = NOT_STARTED
            # reset timers
            t = 0
            _timeToFirstFrame = win.getFutureFlipTime(clock="now")
            frameN = -1
            
            # --- Run Routine "Feedback" ---
            Feedback.forceEnded = routineForceEnded = not continueRoutine
            while continueRoutine:
                # if trial has changed, end Routine now
                if hasattr(thisAttemptLoop, 'status') and thisAttemptLoop.status == STOPPING:
                    continueRoutine = False
                # get current time
                t = routineTimer.getTime()
                tThisFlip = win.getFutureFlipTime(clock=routineTimer)
                tThisFlipGlobal = win.getFutureFlipTime(clock=None)
                frameN = frameN + 1  # number of completed frames (so 0 is the first frame)
                # update/draw components on each frame
                # Run 'Each Frame' code from FBCode
                if fbClock.getTime() >= 2.0:
                    continueRoutine = False
                
                
                # *fbTxt* updates
                
                # if fbTxt is starting this frame...
                if fbTxt.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
                    # keep track of start time/frame for later
                    fbTxt.frameNStart = frameN  # exact frame index
                    fbTxt.tStart = t  # local t and not account for scr refresh
                    fbTxt.tStartRefresh = tThisFlipGlobal  # on global time
                    win.timeOnFlip(fbTxt, 'tStartRefresh')  # time at next scr refresh
                    # add timestamp to datafile
                    thisExp.timestampOnFlip(win, 'fbTxt.started')
                    # update status
                    fbTxt.status = STARTED
                    fbTxt.setAutoDraw(True)
                
                # if fbTxt is active this frame...
                if fbTxt.status == STARTED:
                    # update params
                    pass
                
                # check for quit (typically the Esc key)
                if defaultKeyboard.getKeys(keyList=["escape"]):
                    thisExp.status = FINISHED
                if thisExp.status == FINISHED or endExpNow:
                    endExperiment(thisExp, win=win)
                    return
                # pause experiment here if requested
                if thisExp.status == PAUSED:
                    pauseExperiment(
                        thisExp=thisExp, 
                        win=win, 
                        timers=[routineTimer, globalClock], 
                        currentRoutine=Feedback,
                    )
                    # skip the frame we paused on
                    continue
                
                # check if all components have finished
                if not continueRoutine:  # a component has requested a forced-end of Routine
                    Feedback.forceEnded = routineForceEnded = True
                    break
                continueRoutine = False  # will revert to True if at least one component still running
                for thisComponent in Feedback.components:
                    if hasattr(thisComponent, "status") and thisComponent.status != FINISHED:
                        continueRoutine = True
                        break  # at least one component has not yet finished
                
                # refresh the screen
                if continueRoutine:  # don't flip if this routine is over or we'll get a blank screen
                    win.flip()
            
            # --- Ending Routine "Feedback" ---
            for thisComponent in Feedback.components:
                if hasattr(thisComponent, "setAutoDraw"):
                    thisComponent.setAutoDraw(False)
            # store stop times for Feedback
            Feedback.tStop = globalClock.getTime(format='float')
            Feedback.tStopRefresh = tThisFlipGlobal
            thisExp.addData('Feedback.stopped', Feedback.tStop)
            # the Routine "Feedback" was not non-slip safe, so reset the non-slip timer
            routineTimer.reset()
            # mark thisAttemptLoop as finished
            if hasattr(thisAttemptLoop, 'status'):
                thisAttemptLoop.status = FINISHED
            # if awaiting a pause, pause now
            if attemptLoop.status == PAUSED:
                thisExp.status = PAUSED
                pauseExperiment(
                    thisExp=thisExp, 
                    win=win, 
                    timers=[globalClock], 
                )
                # once done pausing, restore running status
                attemptLoop.status = STARTED
            thisExp.nextEntry()
            
        # completed attemptReps repeats of 'attemptLoop'
        attemptLoop.status = FINISHED
        
        if thisSession is not None:
            # if running in a Session with a Liaison client, send data up to now
            thisSession.sendExperimentData()
        # mark thisTrialsLoop as finished
        if hasattr(thisTrialsLoop, 'status'):
            thisTrialsLoop.status = FINISHED
        # if awaiting a pause, pause now
        if trialsLoop.status == PAUSED:
            thisExp.status = PAUSED
            pauseExperiment(
                thisExp=thisExp, 
                win=win, 
                timers=[globalClock], 
            )
            # once done pausing, restore running status
            trialsLoop.status = STARTED
        thisExp.nextEntry()
        
    # completed 1.0 repeats of 'trialsLoop'
    trialsLoop.status = FINISHED
    
    if thisSession is not None:
        # if running in a Session with a Liaison client, send data up to now
        thisSession.sendExperimentData()
    
    # --- Prepare to start Routine "Summary" ---
    # create an object to store info about Routine Summary
    Summary = data.Routine(
        name='Summary',
        components=[sumTxt, sumKB],
    )
    Summary.status = NOT_STARTED
    continueRoutine = True
    # update component parameters for each repeat
    # create starting attributes for sumKB
    sumKB.keys = []
    sumKB.rt = []
    _sumKB_allKeys = []
    # Run 'Begin Routine' code from SumCode
    pct = (100.0 * TOTAL_CORRECT / TOTAL_TRIALS) if TOTAL_TRIALS > 0 else 0.0
    sumTxt.text = (
        f"Session complete!\n\n"
        f"Correct: {TOTAL_CORRECT} / {TOTAL_TRIALS} ({pct:.1f}%)\n\n"
        f"Press SPACE to finish."
    )
    
    # store start times for Summary
    Summary.tStartRefresh = win.getFutureFlipTime(clock=globalClock)
    Summary.tStart = globalClock.getTime(format='float')
    Summary.status = STARTED
    thisExp.addData('Summary.started', Summary.tStart)
    Summary.maxDuration = None
    # keep track of which components have finished
    SummaryComponents = Summary.components
    for thisComponent in Summary.components:
        thisComponent.tStart = None
        thisComponent.tStop = None
        thisComponent.tStartRefresh = None
        thisComponent.tStopRefresh = None
        if hasattr(thisComponent, 'status'):
            thisComponent.status = NOT_STARTED
    # reset timers
    t = 0
    _timeToFirstFrame = win.getFutureFlipTime(clock="now")
    frameN = -1
    
    # --- Run Routine "Summary" ---
    Summary.forceEnded = routineForceEnded = not continueRoutine
    while continueRoutine:
        # get current time
        t = routineTimer.getTime()
        tThisFlip = win.getFutureFlipTime(clock=routineTimer)
        tThisFlipGlobal = win.getFutureFlipTime(clock=None)
        frameN = frameN + 1  # number of completed frames (so 0 is the first frame)
        # update/draw components on each frame
        
        # *sumTxt* updates
        
        # if sumTxt is starting this frame...
        if sumTxt.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
            # keep track of start time/frame for later
            sumTxt.frameNStart = frameN  # exact frame index
            sumTxt.tStart = t  # local t and not account for scr refresh
            sumTxt.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(sumTxt, 'tStartRefresh')  # time at next scr refresh
            # add timestamp to datafile
            thisExp.timestampOnFlip(win, 'sumTxt.started')
            # update status
            sumTxt.status = STARTED
            sumTxt.setAutoDraw(True)
        
        # if sumTxt is active this frame...
        if sumTxt.status == STARTED:
            # update params
            pass
        
        # *sumKB* updates
        waitOnFlip = False
        
        # if sumKB is starting this frame...
        if sumKB.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
            # keep track of start time/frame for later
            sumKB.frameNStart = frameN  # exact frame index
            sumKB.tStart = t  # local t and not account for scr refresh
            sumKB.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(sumKB, 'tStartRefresh')  # time at next scr refresh
            # add timestamp to datafile
            thisExp.timestampOnFlip(win, 'sumKB.started')
            # update status
            sumKB.status = STARTED
            # keyboard checking is just starting
            waitOnFlip = True
            win.callOnFlip(sumKB.clock.reset)  # t=0 on next screen flip
            win.callOnFlip(sumKB.clearEvents, eventType='keyboard')  # clear events on next screen flip
        if sumKB.status == STARTED and not waitOnFlip:
            theseKeys = sumKB.getKeys(keyList=['space'], ignoreKeys=["escape"], waitRelease=False)
            _sumKB_allKeys.extend(theseKeys)
            if len(_sumKB_allKeys):
                sumKB.keys = _sumKB_allKeys[-1].name  # just the last key pressed
                sumKB.rt = _sumKB_allKeys[-1].rt
                sumKB.duration = _sumKB_allKeys[-1].duration
                # a response ends the routine
                continueRoutine = False
        
        # check for quit (typically the Esc key)
        if defaultKeyboard.getKeys(keyList=["escape"]):
            thisExp.status = FINISHED
        if thisExp.status == FINISHED or endExpNow:
            endExperiment(thisExp, win=win)
            return
        # pause experiment here if requested
        if thisExp.status == PAUSED:
            pauseExperiment(
                thisExp=thisExp, 
                win=win, 
                timers=[routineTimer, globalClock], 
                currentRoutine=Summary,
            )
            # skip the frame we paused on
            continue
        
        # check if all components have finished
        if not continueRoutine:  # a component has requested a forced-end of Routine
            Summary.forceEnded = routineForceEnded = True
            break
        continueRoutine = False  # will revert to True if at least one component still running
        for thisComponent in Summary.components:
            if hasattr(thisComponent, "status") and thisComponent.status != FINISHED:
                continueRoutine = True
                break  # at least one component has not yet finished
        
        # refresh the screen
        if continueRoutine:  # don't flip if this routine is over or we'll get a blank screen
            win.flip()
    
    # --- Ending Routine "Summary" ---
    for thisComponent in Summary.components:
        if hasattr(thisComponent, "setAutoDraw"):
            thisComponent.setAutoDraw(False)
    # store stop times for Summary
    Summary.tStop = globalClock.getTime(format='float')
    Summary.tStopRefresh = tThisFlipGlobal
    thisExp.addData('Summary.stopped', Summary.tStop)
    # check responses
    if sumKB.keys in ['', [], None]:  # No response was made
        sumKB.keys = None
    thisExp.addData('sumKB.keys',sumKB.keys)
    if sumKB.keys != None:  # we had a response
        thisExp.addData('sumKB.rt', sumKB.rt)
        thisExp.addData('sumKB.duration', sumKB.duration)
    # Run 'End Routine' code from SumCode
    TOTAL_TRIALS += 1
    TOTAL_CORRECT += is_correct
    
    thisExp.nextEntry()
    # the Routine "Summary" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset()
    
    # mark experiment as finished
    endExperiment(thisExp, win=win)


def saveData(thisExp):
    """
    Save data from this experiment
    
    Parameters
    ==========
    thisExp : psychopy.data.ExperimentHandler
        Handler object for this experiment, contains the data to save and information about 
        where to save it to.
    """
    filename = thisExp.dataFileName
    # these shouldn't be strictly necessary (should auto-save)
    thisExp.saveAsWideText(filename + '.csv', delim='auto')
    thisExp.saveAsPickle(filename)


def endExperiment(thisExp, win=None):
    """
    End this experiment, performing final shut down operations.
    
    This function does NOT close the window or end the Python process - use `quit` for this.
    
    Parameters
    ==========
    thisExp : psychopy.data.ExperimentHandler
        Handler object for this experiment, contains the data to save and information about 
        where to save it to.
    win : psychopy.visual.Window
        Window for this experiment.
    """
    if win is not None:
        # remove autodraw from all current components
        win.clearAutoDraw()
        # Flip one final time so any remaining win.callOnFlip() 
        # and win.timeOnFlip() tasks get executed
        win.flip()
    # return console logger level to WARNING
    logging.console.setLevel(logging.WARNING)
    # mark experiment handler as finished
    thisExp.status = FINISHED
    # run any 'at exit' functions
    for fcn in runAtExit:
        fcn()
    logging.flush()


def quit(thisExp, win=None, thisSession=None):
    """
    Fully quit, closing the window and ending the Python process.
    
    Parameters
    ==========
    win : psychopy.visual.Window
        Window to close.
    thisSession : psychopy.session.Session or None
        Handle of the Session object this experiment is being run from, if any.
    """
    thisExp.abort()  # or data files will save again on exit
    # make sure everything is closed down
    if win is not None:
        # Flip one final time so any remaining win.callOnFlip() 
        # and win.timeOnFlip() tasks get executed before quitting
        win.flip()
        win.close()
    logging.flush()
    if thisSession is not None:
        thisSession.stop()
    # terminate Python process
    core.quit()


# if running this experiment as a script...
if __name__ == '__main__':
    # call all functions in order
    expInfo = showExpInfoDlg(expInfo=expInfo)
    thisExp = setupData(expInfo=expInfo)
    logFile = setupLogging(filename=thisExp.dataFileName)
    win = setupWindow(expInfo=expInfo)
    setupDevices(expInfo=expInfo, thisExp=thisExp, win=win)
    run(
        expInfo=expInfo, 
        thisExp=thisExp, 
        win=win,
        globalClock='float'
    )
    saveData(thisExp=thisExp)
    quit(thisExp=thisExp, win=win)
