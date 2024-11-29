// Seleciona os elementos do DOM
const pianoKeys = document.querySelectorAll(".piano-keys .key");
const volumeSlider = document.querySelector(".volume-slider input");
const keysCheck = document.querySelector(".keys-check input");
const waveformSelector = document.getElementById("waveformSelector");

// Inicializa a API de áudio
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const volumeGain = audioContext.createGain();
volumeGain.connect(audioContext.destination);
volumeGain.gain.value = volumeSlider.value;

let selectedWaveform = "sine"; // Tipo de onda inicial
waveformSelector.addEventListener("change", (e) => {
    selectedWaveform = e.target.value;
});

// Mapeamento das teclas para frequências das notas musicais
const keyFrequencies = {
    a: 261.63, // C4
    w: 277.18, // C#4
    s: 293.66, // D4
    e: 311.13, // D#4
    d: 329.63, // E4
    f: 349.23, // F4
    t: 369.99, // F#4
    g: 392.00, // G4
    y: 415.30, // G#4
    h: 440.00, // A4
    u: 466.16, // A#4
    j: 493.88, // B4
    k: 523.25, // C5
    o: 554.37, // C#5
    l: 587.33, // D5
    p: 622.25, // D#5
    "ç": 659.25, // E5
};

// Armazena os osciladores ativos para controle de sustain
const activeOscillators = {};

// Reproduz o som de uma tecla
const playTune = (key) => {
    const frequency = keyFrequencies[key];
    if (!frequency) return; // Ignorar se a tecla não está mapeada

    if (activeOscillators[key]) return; // Evitar criar múltiplos osciladores para a mesma tecla

    // Cria e configura um oscilador
    const oscillator = audioContext.createOscillator();
    oscillator.type = selectedWaveform; // Configura o tipo de onda
    oscillator.frequency.value = frequency;
    oscillator.connect(volumeGain);
    oscillator.start();

    activeOscillators[key] = oscillator;

    // Feedback visual
    const clickedKey = document.querySelector(`[data-key="${key}"]`);
    if (clickedKey) {
        clickedKey.classList.add("active");
    }
};

// Para o som de uma tecla
const stopTune = (key) => {
    if (activeOscillators[key]) {
        activeOscillators[key].stop();
        delete activeOscillators[key];
    }

    // Remove o feedback visual
    const clickedKey = document.querySelector(`[data-key="${key}"]`);
    if (clickedKey) {
        clickedKey.classList.remove("active");
    }
};

// Evento para pressionar teclas do teclado
document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase(); // Normaliza para minúsculas
    if (!keyFrequencies[key]) return; // Ignorar teclas não mapeadas
    playTune(key);
});

document.addEventListener("keyup", (e) => {
    const key = e.key.toLowerCase();
    stopTune(key);
});

// Evento para clicar nas teclas
pianoKeys.forEach((key) => {
    key.addEventListener("mousedown", () => playTune(key.dataset.key));
    key.addEventListener("mouseup", () => stopTune(key.dataset.key));
});

// Função para ajustar o volume
const handleVolume = (e) => {
    volumeGain.gain.value = e.target.value;
};

// Alternar visibilidade das labels nas teclas
const showHideKeys = () => {
    pianoKeys.forEach((key) => {
        const label = key.querySelector("span");
        label.style.display = keysCheck.checked ? "block" : "none";
    });
};

// Configura eventos para o controle de volume e visibilidade das teclas
volumeSlider.addEventListener("input", handleVolume);
keysCheck.addEventListener("change", showHideKeys);
