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

    const tasksMoreBtn = document.getElementById("more");
    const tasksMorePanel = document.querySelector(".tasks-more");
    const taskMenuBtn = document.querySelector(".task-menu");
    const taskMenuPanel = document.querySelector(".edit-tasks");
    const addTaskBtn = document.getElementById("addTask");
    const addTaskPanel = document.querySelector(".add-tasks");
    const cancelBtn = document.getElementById("cancel");

    const clearFinishedBtn = document.getElementById("clearFinishedTasks");
    const clearActPomodorosBtn = document.getElementById("clearActPomodoros");
    const clearAllBtn = document.getElementById("clearAllTasks");
    const taskContent = document.querySelector(".task-content");

    const saveBtn = document.getElementById("save");
    const taskTitleInput = document.getElementById("work");
    const taskDetailsInput = document.getElementById("notes");
    const taskPomodorosInput = document.getElementById("numPomodoros");

    const autoStartBreaksToggle = document.getElementById("autoStartBreaksToggle");
    const autoStartPomodorosToggle = document.getElementById("autoStartPomodorosToggle");

    // State
    let timer;
    let time = 25 * 60;
    let mode = "pomodoro";
    let pomodorosCompleted = 0;

    let autoStartBreaks = false;
    let autoStartPomodoros = false;

    pomodoroInput.value = 25;
    shortBreakInput.value = 5;
    longBreakInput.value = 15;
    intervalInput.value = 4;

    let tasks = [];
    let selectedTask = null;

    //Functions
    function updateTimeDisplay() {
        const minutes = String(Math.floor(time / 60)).padStart(2, '0');
        const seconds = String(time % 60).padStart(2, '0');
        timeDisplay.textContent = `${minutes}:${seconds}`;
    }

    function setMode(newMode) {
        clearInterval(timer);

        let duration = 25;
        // if(newMode === "pomodoro") {
        //     time = (parseInt(pomodoroInput.value) || 25) * 60;
        //     studyBg.classList.add("visible");
        //     longRestBg.classList.remove("visible");
        //     shortRestBg.classList.remove("visible");
        // } else if (newMode === "short") {
        //     time = (parseInt(shortBreakInput.value) || 5) * 60;
        //     studyBg.classList.remove("visible");
        //     shortRestBg.classList.add("visible");
        //     longRestBg.classList.remove("visible");
        // } else if (newMode === "long") {
        //     time = (parseInt(longBreakInput.value) || 15) * 60;
        //     studyBg.classList.remove("visible");
        //     shortRestBg.classList.remove("visible");
        //     longRestBg.classList.add("visible");
        // }
        if(selectedTask) {
            if(newMode === "pomodoro") duration = selectedTask.pomodoroDuration;
            else if(newMode === "short") duration = selectedTask.shortBreakDuration;
            else if(newMode === "long") duration = selectedTask.longBreakDuration;
        } else {
            if(newMode === "pomodoro") duration = parseInt(pomodoroInput.value) || 25;
            else if(newMode === "short") duration = parseInt(shortBreakInput.value) || 5;
            else if(newMode === "long") duration = parseInt(longBreakInput.value) || 15;
        }

        time = duration * 60;

        studyBg.classList.toggle("visible", newMode === "pomodoro");
        shortRestBg.classList.toggle("visible", newMode === "short");
        longRestBg.classList.toggle("visible", newMode === "long");

        mode = newMode;
        updateTimeDisplay();
        startBtn.textContent = "START";
    }

    function startTimer() {
        // if(!selectedTask && mode === "pomodoro") {
        //     alert("Please select a task before starting.");
        //     return;
        // }

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
            if(selectedTask) {
                selectedTask.completedPomodoros++;
                const progress = `${selectedTask.completedPomodoros}/${selectedTask.totalPomodoros}`;
                selectedTask.element.querySelector(".num").textContent = progress;
            }
            
            const interval = parseInt(intervalInput.value); // || 4;
            const isValidInterval = !isNaN(interval) && interval > 0;
            const shouldTakeLongBreak = (
                isValidInterval &&
                selectedTask &&
                selectedTask.completedPomodoros > 0 &&
                selectedTask.completedPomodoros % interval === 0
            );

            //if (isValidInterval && selectedTask && selectedTask.completedPomodoros % interval === 0) {
            if (shouldTakeLongBreak) {
                setMode("long");
            } else {
                setMode("short");
            } 

            if (autoStartBreaks) startTimer();

        } else {
            setMode("pomodoro");
            if (autoStartPomodoros) startTimer();
        }
    }

    function createTaskElement(title, details="", pomodoros) {
        const task = document.createElement("div");
        task.className = "task";

        const taskData = {
            title,
            details,
            totalPomodoros: pomodoros,
            completedPomodoros: 0,
            element: task,
            pomodoroDuration: parseInt(pomodoroInput.value) || 25,
            shortBreakDuration: parseInt(shortBreakInput.value) || 5,
            longBreakDuration: parseInt(longBreakInput.value) || 15
        };

        task.innerHTML = `
            <div class="left">
                <img src="images/unchecked.png" alt="unchecked">
                <div class="text">
                    <p id="content">${title}</p>
                    <p id="details">${details || ""}</p>
                </div>
            </div>
            <div class="right">
                <p id="num">0/${pomodoros}</p>
                <button class="task-menu">
                    <img src="images/moreBlack.png" alt="moreBlack">
                </button>
            </div>    
        `;

        task.querySelector(".task-menu").addEventListener("click", () => {
            openEditTask(task);
        });

        task.addEventListener("click", () => {
            selectTask(taskData);
        });

        taskContent.appendChild(task);
        tasks.push(taskData);
    }

    // function selectTask(taskData) {
    //     tasks.forEach(t => t.element.classList.remove("selected"));

    //     selectedTask = taskData;
    //     taskData.element.classList.add("selected");

    //     setMode("pomodoro");
    // }

    function openEditTask(task) {
        const title = task.querySelector("#content").textContent;
        const details = task.querySelector("#details").textContent;
        const [, total] = task.querySelector("#num").textContent.split("/").map(Number);

        taskTitleInput.value = title;
        taskDetailsInput.value = details;
        taskPomodorosInput.value = total;

        addTaskPanel.classList.add("visible");
        taskBeingEdited = task;
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

    tasksMoreBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        tasksMorePanel.classList.toggle("visible");
    });

    document.addEventListener("click", (event) => {
        if(
            tasksMorePanel.classList.contains("visible") &&
            !tasksMorePanel.contains(event.target) &&
            !tasksMoreBtn.contains(event.target)
        ) {
            tasksMorePanel.classList.remove("visible");
        }
    });

    taskMenuBtn.addEventListener("click", () => {
        taskMenuPanel.classList.toggle("visible");
    });

    addTaskBtn.addEventListener("click", () => {
        addTaskPanel.classList.add("visible");
    });

    cancelBtn.addEventListener("click", () => {
        addTaskPanel.classList.remove("visible");
        tasksMorePanel.classList.remove("visible");

        // Reset edit state
        taskBeingEdited = null;
        taskTitleInput.value = "";
        taskDetailsInput.value = "";
        taskPomodorosInput.value = 1;
    });

    clearFinishedBtn.addEventListener("click", () => {
        const tasks = taskContent.querySelectorAll(".task");
        tasks.forEach(task => {
            const numText = task.querySelector("#num")?.textContent.trim();
            if(numText) {
                const [done, total] = numText.split("/").map(Number);
                if(done === total) {
                    task.remove();
                }
            }
        });
    });

    clearActPomodorosBtn.addEventListener("click", () => {
        const tasks = taskContent.querySelectorAll(".task");
        tasks.forEach(task => {
            const numElem = task.querySelector("#num");
            const numText = numElem?.textContent.trim();
            if(numText) {
                const [, total] = numText.split("/").map(Number);
                numElem.textContent = `0/${total}`;
            }
        });
    });

    clearAllBtn.addEventListener("click", () => {
        taskContent.innerHTML = "";
    });

    // document.querySelectorAll("#cancel").forEach(cancelBtn => {
    //     cancelBtn.addEventListener("click", () => {
    //         tasksMorePanel.classList.remove("visible");
    //     });
    // });

    saveBtn.addEventListener("click", () => {
        const title = taskTitleInput.value.trim();
        const details = taskDetailsInput.value.trim();
        const pomodoros = parseInt(taskPomodorosInput.value);

        if(!title || isNaN(pomodoros) || pomodoros <= 0) {
            alert("Please enter a valid title and pomodoro count.");
            return;
        }

        if(taskBeingEdited) {
            taskBeingEdited.querySelector("#content").textContent = title;
            taskBeingEdited.querySelector("#details").textContent = details;
            taskBeingEdited.querySelector("#num").textContent = `0/${pomodoros}`;
            taskBeingEdited = null;
        } else {
            createTaskElement(title, details, pomodoros);
        }

        //Reset panel
        taskTitleInput.value = "";
        taskDetailsInput.value = "";
        taskPomodorosInput.value = 1;
        addTaskPanel.classList.remove("visible");
    });

    autoStartBreaksToggle.addEventListener("click", () => {
        autoStartBreaks = !autoStartBreaks;
        autoStartBreaksToggle.querySelector("img").src = autoStartBreaks ? "images/on.png" : "images/off.png";
    });

    autoStartPomodorosToggle.addEventListener("click", () => {
        autoStartPomodoros = !autoStartPomodoros;
        autoStartPomodorosToggle.querySelector("img").src = autoStartPomodoros ? "images/on.png" : "images/off.png";
    });

    // Init
    setMode("pomodoro");

    window.onload = () => {
        const examples = document.querySelectorAll("#ex");
        examples.forEach(example => {
            example.remove();
        });
    };
});