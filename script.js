let workMinutes = 25;
let breakMinutes = 5;
let time = workMinutes * 60; // 25分（残り時間）
let totalTime = time; // 作業or休憩ごとに設定する
let isWorkTime = true; // true: 作業中, false: 休憩
let timerRunning = false;
let lastUpdate = Date.now();
let sound = new Audio("sei_ge_bell01.mp3");

// 表示更新
function updateDisplay() {
    let minutes = Math.floor(time / 60); // 分に変換
    let seconds = Math.floor(time % 60); // 秒

    // HTMLを書き換える
    document.getElementById("timer").textContent = 
        String(minutes).padStart(2, '0') + ":" +
        String(seconds).padStart(2, '0');
}

function updateMode() {
    if (isWorkTime) {
        document.getElementById("mode").textContent = "作業中";
    } else {
        document.getElementById("mode").textContent = "休憩中";
    }
}

function updateProgressBar() {
    let percent = (time / totalTime) * 100;
    let bar = document.getElementById("progressBar");
    bar.style.width = percent + "%";
    bar.style.backgroundColor = isWorkTime ? "#4CAF50" : "#2196F3"; // 青と緑を切り替える 
}

function timeLoop() {
    if (!timerRunning) return;

    let now = Date.now();
    let delta = (now - lastUpdate) / 1000; // 秒単位
    lastUpdate = now;

    time -= delta; // 小数でバーを減少させていく
    if (time <= 0) {
        time = 0;
        updateDisplay();
        updateProgressBar();
        sound.play();
        handleSwitch(); // 作業, 休憩の切り替えをする
        return;
    }

    updateDisplay();
    updateProgressBar();
    requestAnimationFrame(timeLoop);
}

// スタート処理
function startTimer() {
    if (timerRunning) return; // 多重起動を防ぐ

    lastUpdate = Date.now();
    timerRunning = true;
    requestAnimationFrame(timeLoop);
}

// ストップ処理
function stopTimer() {
    timerRunning = false;
}

// リセット処理
function resetTimer() {
    timerRunning = false;
    isWorkTime = true;
    time = workMinutes * 60;
    totalTime = time;
    updateDisplay();
    updateMode();
    updateProgressBar();
}

// 時間指定
function setDurations() {
    let work = document.getElementById("workMinutes").value;
    let rest = document.getElementById("breakMinutes").value;

    if (work <= 0 || rest <= 0) {
        alert("正しい時間を入力してください。");
        return;
    }

    workMinutes = work;
    breakMinutes = rest;

    // 作業状態に戻す
    isWorkTime = true;
    time = workMinutes * 60;
    totalTime = time;

    timerRunning = false;

    lastUpdate = Date.now();
    updateDisplay();
    updateMode();
    updateProgressBar();
}

function handleSwitch() {
    if (isWorkTime) {
        //alert("作業終了！休憩に入ります。");
        isWorkTime = false;
        time = breakMinutes * 60;
        totalTime = time;
    } else {
        //alert("休憩終了！作業に入ります。");
        isWorkTime = true;
        time = workMinutes * 60;
        totalTime = time;
    }

    timerRunning = false;
    updateDisplay();
    updateMode();
    updateProgressBar();
}

// 初期表示
updateDisplay();
updateProgressBar();
updateMode();