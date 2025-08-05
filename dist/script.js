document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const timeDisplay = document.querySelector(".time");
    const startBtn = document.getElementById("start");
    const pomodoroBtn = document.getElementById("pomodoro");
    const shortBreakBtn = document.getElementById("shortBreak");
    const longBreakBtn = document.getElementById("longBreak");

    const studyBg = document.querySelector(".study");
    const shortRestBg = document.querySelector(".rest-short");
    const longRestBg = document.querySelector(".rest-long");

    const settingPanel = document.querySelector(".settings");
    const openSettingBtn = document.getElementById("setting");
    const closeSettingBtn = document.getElementById("close");

    const pomodoroInput = document.getElementById("pomodoroInput");
    const shortBreakInput = document.getElementById("shortBreakInput");
    const longBreakInput = document.getElementById("longBreakInput");
    const intervalInput = document.getElementById("intervalsInput");
    const okBtn = document.getElementById("ok");

    // State
    let timer;
    let time = 25 * 60;
    let mode = "pomodoro";
    let pomodorosCompleted = 0;

    //Functions
    function updateTimeDisplay() {
        const minutes = String(Math.floor(time / 60)).padStart(2, '0');
        const seconds = String(time % 60).padStart(2, '0');
        timeDisplay.textContent = `${minutes}:${seconds}`;
    }

    function setMode(newMode) {
        clearInterval(timer);
        if(newMode === "pomodoro") {
            time = (parseInt(pomodoroInput.value) || 25) * 60;
            studyBg.classList.add("visible");
            longRestBg.classList.remove("visible");
            shortRestBg.classList.remove("visible");
        } else if (newMode === "short") {
            time = (parseInt(shortBreakInput.value) || 5) * 60;
            studyBg.classList.remove("visible");
            shortRestBg.classList.add("visible");
            longRestBg.classList.remove("visible");
        } else if (newMode === "long") {
            time = (parseInt(longBreakInput.value) || 15) * 60;
            studyBg.classList.remove("visible");
            shortRestBg.classList.remove("visible");
            longRestBg.classList.add("visible");
        }
        mode = newMode;
        updateTimeDisplay();
        startBtn.textContent = "START";
    }

    function startTimer() {
        clearInterval(timer);
        timer = setInterval(() => {
            if (time > 0) {
                time--;
                updateTimeDisplay();
            } else {
                clearInterval(timer);
                handleSessionEnd();
            }
        }, 1000);
        startBtn.textContent = "PAUSE";
    }

    function pauseTimer() {
        clearInterval(timer);
        startBtn.textContent = "START";
    }

    function toggleTimer() {
        if (startBtn.textContent === "START") {
            startTimer();
        } else {
            pauseTimer();
        }
    }

    function handleSessionEnd() {
        if (mode === "pomodoro") {
            pomodorosCompleted++;
            const interval = parseInt(intervalInput.value) || 4;
            if (pomodorosCompleted % interval === 0) {
                setMode("long");
            } else {
                setMode("short");
            } 
        } else {
            setMode("pomodoro");
        }
    }

    // Event Listeners 
    startBtn.addEventListener("click", toggleTimer);

    pomodoroBtn.addEventListener("click", () => setMode("pomodoro"));
    shortBreakBtn.addEventListener("click", () => setMode("short"));
    longBreakBtn.addEventListener("click", () => setMode("long"));

    openSettingBtn.addEventListener("click", () => {
        settingPanel.classList.add("visible");
    });

    closeSettingBtn.addEventListener("click", () => {
        settingPanel.classList.remove("visible");
    });

    okBtn.addEventListener("click", () => {
        settingPanel.classList.remove("visible");
        setMode(mode);
    });

    // Init
    setMode("pomodoro");
});