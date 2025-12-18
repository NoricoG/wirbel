var soundOptions = ["-", "bd", "sd", "rim", "hh", "oh", "lt", "mt", "ht", "rd", "cr"];
// to make sure we have enough to choose from, also in mutations
while (soundOptions.length < 10) {
    soundOptions = soundOptions.concat(soundOptions);
}
// banks that have at most 4 missing drum sounds
var bankOptions = [
    "",
    "9000",
    "AkaiLinn",
    "AkaiMPC60",
    "AkaiXR10",
    "AlesisSR16",
    "BossDR550",
    "CircuitsDrumTracks",
    "CompuRhythm1000",
    "CompuRhythm8000",
    "D110",
    "D70",
    "DMX",
    "DPM48",
    "DR550",
    "Drumulator",
    "EmuDrumulator",
    "EmuSP12",
    "JD990",
    "KorgM1",
    "Linn",
    "Linn9000",
    "Linndrum",
    "LinnLM1",
    "LinnLM2",
    "LM1",
    "LM2",
    "M1",
    "MC303",
    "MPC60",
    "MT32",
    "OberheimDMX",
    "R8",
    "RM50",
    "RolandCompuRhythm1000",
    "RolandCompuRhythm8000",
    "RolandD110",
    "RolandD70",
    "RolandJD990",
    "RolandMC303",
    "RolandMT32",
    "RolandR8",
    "RolandS50",
    "RolandTR505",
    "RolandTR626",
    "RolandTR707",
    "RolandTR808",
    "RY30",
    "S50",
    "SakataDPM48",
    "SequentialCircuitsDrumTracks",
    "SP12",
    "SR16",
    "TG33",
    "TR505",
    "TR626",
    "TR707",
    "TR808",
    "XR10",
    "YamahaRM50",
    "YamahaRY30",
    "YamahaTG33",
];
class State {
    version = 0;
    speed;
    chosenSounds;
    pattern;
    bank;
    constructor() {
        this.speed = 120;
        this.chosenSounds = [];
        this.pattern = [];
        this.bank = "";
    }
    toCode() {
        const patternLength = this.pattern.length;
        var patternString = "";
        for (let i = 0; i < patternLength; i++) {
            patternString += this.pattern[i] + " ";
            const addExtraSpace = i + 1 == patternLength / 2;
            if (addExtraSpace) {
                patternString += " ";
            }
        }
        var fullCode = "setcpm(120)\n" + "s(`<[" + patternString + "]@" + (patternLength / 2) + ">`)\n.bank('" + this.bank + "')";
        return fullCode;
    }
    copy() {
        const newState = new State();
        newState.version = this.version;
        newState.speed = this.speed;
        newState.chosenSounds = this.chosenSounds.slice();
        newState.pattern = this.pattern.slice();
        newState.bank = this.bank;
        return newState;
    }
}
var state = new State();
var previousStates = [];
const maxPreviousStates = 10;
function showMutationButtons() {
    const container = document.getElementById('mutationButtons');
    container.innerHTML = "";
    for (const [category, categoryMutations] of Object.entries(mutations)) {
        const categoryHeader = document.createElement('h3');
        categoryHeader.textContent = category;
        container.appendChild(categoryHeader);
        categoryMutations.forEach((mutation, i) => {
            const btn = document.createElement('button');
            btn.textContent = mutation.label;
            btn.onclick = function () { applyMutation(category, i); };
            container.appendChild(btn);
        });
    }
    ;
}
document.addEventListener('DOMContentLoaded', function () {
    showMutationButtons();
});
async function replStop() {
    document.getElementById('currentState').editor.stop();
}
function replLoad(code) {
    document.getElementById('currentState').editor.setCode(code);
}
function replStart() {
    document.getElementById('currentState').editor.evaluate();
}
function renderPattern() {
    replStop().then(() => {
        const fullCode = state.toCode();
        replLoad(fullCode);
        replStart();
    });
    const chosenSoundsElement = document.getElementById('chosenSounds');
    chosenSoundsElement.innerText = "Chosen sounds: " + state.chosenSounds.join(", ");
    const versionElement = document.getElementById('currentVersion');
    versionElement.innerText = "Current pattern (#" + state.version + ")";
}
function patternGenerate() {
    const newVersion = state.version + 1;
    makeSpaceForNextState();
    state.version = newVersion;
    const numchosenSoundsLower = parseInt(document.getElementById('numberOfSoundsLower').value);
    const numchosenSoundsUpper = parseInt(document.getElementById('numberOfSoundsUpper').value);
    const numchosenSounds = numchosenSoundsLower + Math.floor(Math.random() * (numchosenSoundsUpper - numchosenSoundsLower + 1));
    state.chosenSounds = [];
    // can include repetition, on purpose
    for (let i = 0; i < numchosenSounds; i++) {
        state.chosenSounds.push(soundOptions[Math.floor(Math.random() * soundOptions.length)]);
    }
    state.bank = bankOptions[Math.floor(Math.random() * bankOptions.length)];
    const patternLengthLower = parseInt(document.getElementById('patternLengthLower').value);
    const patternLengthUpper = parseInt(document.getElementById('patternLengthUpper').value);
    const patternLength = patternLengthLower + Math.floor(Math.random() * (patternLengthUpper - patternLengthLower + 1));
    state.pattern = [];
    for (let i = 0; i < patternLength; i++) {
        const newSound = state.chosenSounds[Math.floor(Math.random() * state.chosenSounds.length)];
        state.pattern.push(newSound);
    }
    console.log("Generated pattern: " + state.pattern);
    const distinctSounds = Array.from(new Set(state.pattern));
    if (distinctSounds.length == 1) {
        console.log("Regenerating pattern because it had only one distinct sound");
        patternGenerate();
        return;
    }
    renderPattern();
}
function applyMutation(category, mutationId) {
    makeSpaceForNextState();
    const newVersion = state.version + 1;
    const mutation = mutations[category][mutationId];
    state = mutation.apply(state);
    state.version = newVersion;
    renderPattern();
}
function restorePreviousState(iterations) {
    state = previousStates[0].copy();
    for (let i = 0; i < previousStates.length - 1; i++) {
        previousStates[i] = previousStates[i + 1];
    }
    previousStates.pop();
    if (iterations > 1) {
        return restorePreviousState(iterations - 1);
    }
    showMutationHistory();
    renderPattern();
}
function makeSpaceForNextState() {
    if (previousStates.length < maxPreviousStates) {
        previousStates.push(new State());
    }
    for (let i = previousStates.length - 1; i > 0; i--) {
        previousStates[i] = previousStates[i - 1];
    }
    previousStates[0] = state.copy();
    showMutationHistory();
}
function showMutationHistory() {
    if (previousStates.length > 0 && previousStates[0].version > 0) {
        document.getElementById('stateMinusOne').editor.setCode(previousStates[0].toCode());
        document.getElementById('versionMinusOne').innerText = "Previous pattern (#" + previousStates[0].version + ")";
    }
    else {
        document.getElementById('stateMinusOne').editor.setCode("// No previous state");
        document.getElementById('versionMinusOne').innerText = "Previous pattern";
    }
    if (previousStates.length > 1 && previousStates[1].version > 0) {
        document.getElementById('stateMinusTwo').editor.setCode(previousStates[1].toCode());
        document.getElementById('versionMinusTwo').innerText = "Previous pattern (#" + previousStates[1].version + ")";
    }
    else {
        document.getElementById('stateMinusTwo').editor.setCode("// No previous state");
        document.getElementById('versionMinusTwo').innerText = "Previous pattern";
    }
}
const mutations = {
    "Soundbank": [
        {
            label: "Change soundbank",
            shortLabel: "ChangeBank",
            args: {},
            apply: (state) => {
                var newBank = state.bank;
                while (newBank == state.bank) {
                    newBank = bankOptions[Math.floor(Math.random() * bankOptions.length)];
                }
                state.bank = newBank;
                return state;
            }
        },
    ],
    "Sounds": [
        {
            label: "Change one location in the pattern to a random chosen sound",
            shortLabel: "ChangeToChosen",
            args: {},
            apply: (state) => {
                const distinctSounds = Array.from(new Set(state.pattern));
                var indexToChange = Math.floor(Math.random() * state.pattern.length);
                var newSound = state.pattern[indexToChange];
                while (newSound == state.pattern[indexToChange]) {
                    newSound = state.chosenSounds[Math.floor(Math.random() * state.chosenSounds.length)];
                }
                state.pattern[indexToChange] = newSound;
                return state;
            }
        },
        {
            label: "Change one of the sounds everywhere in the pattern",
            shortLabel: "ChangeSound",
            args: {},
            apply: (state) => {
                const distinctSounds = Array.from(new Set(state.pattern));
                var soundToReplace = "-";
                while (soundToReplace == "-") {
                    soundToReplace = distinctSounds[Math.floor(Math.random() * distinctSounds.length)];
                }
                var newSound = soundToReplace;
                while (newSound == soundToReplace || distinctSounds.includes(newSound)) {
                    newSound = soundOptions[Math.floor(Math.random() * soundOptions.length)];
                }
                for (let i = 0; i < state.pattern.length; i++) {
                    if (state.pattern[i] == soundToReplace) {
                        state.pattern[i] = newSound;
                    }
                }
                return state;
            }
        },
        {
            label: "Change all of the sounds in the pattern",
            shortLabel: "ChangeAllSounds",
            args: {},
            apply: (state) => {
                const currentSounds = Array.from(new Set(state.pattern));
                var newSounds = [];
                for (let i = 0; i < currentSounds.length; i++) {
                    var newSound = currentSounds[i];
                    if (newSound !== "-") {
                        while (newSound == "-" || newSounds.includes(newSound) || currentSounds.includes(newSound)) {
                            newSound = soundOptions[Math.floor(Math.random() * soundOptions.length)];
                        }
                    }
                    newSounds.push(newSound);
                }
                for (let i = 0; i < state.pattern.length; i++) {
                    const soundIndex = currentSounds.indexOf(state.pattern[i]);
                    state.pattern[i] = newSounds[soundIndex];
                }
                return state;
            }
        },
        {
            label: "Mute a random location in the pattern",
            shortLabel: "MuteSound",
            args: {},
            apply: (state) => {
                const distinctSounds = new Set(state.pattern);
                distinctSounds.delete("-");
                if (Array.from(distinctSounds).length <= 1) {
                    console.log("Pattern has one or no unmuted sounds, cannot mute");
                    return state;
                }
                var indexToMute;
                do {
                    indexToMute = Math.floor(Math.random() * state.pattern.length);
                } while (state.pattern[indexToMute] == "-");
                state.pattern[indexToMute] = "-";
                return state;
            }
        },
        {
            label: "Unmute a random location in the pattern",
            shortLabel: "UnmuteSound",
            args: {},
            apply: (state) => {
                const distinctSounds = new Set(state.pattern);
                if (!distinctSounds.has("-")) {
                    console.log("Pattern has no muted sounds, cannot unmute");
                    return state;
                }
                var indexToUnmute;
                do {
                    indexToUnmute = Math.floor(Math.random() * state.pattern.length);
                } while (state.pattern[indexToUnmute] != "-");
                var chosenSound = "-";
                while (chosenSound == "-") {
                    chosenSound = state.chosenSounds[Math.floor(Math.random() * state.chosenSounds.length)];
                }
                state.pattern[indexToUnmute] = chosenSound;
                return state;
            }
        },
    ],
    "Order": [
        {
            label: "Swap two random elements",
            shortLabel: "Swap",
            args: {},
            apply: (state) => {
                const index1 = Math.floor(Math.random() * state.pattern.length);
                var index2 = index1;
                while (index2 == index1) {
                    index2 = Math.floor(Math.random() * state.pattern.length);
                }
                const spare = state.pattern[index1];
                state.pattern[index1] = state.pattern[index2];
                state.pattern[index2] = spare;
                return state;
            }
        },
        {
            label: "Completely shuffle pattern",
            shortLabel: "Shuffle",
            args: {},
            apply: (state) => {
                var newPattern = [];
                const newIndices = Array.from(state.pattern.keys()).sort(() => Math.random() - 0.5);
                for (let i = 0; i < state.pattern.length; i++) {
                    newPattern[i] = state.pattern[newIndices[i]];
                }
                state.pattern = newPattern;
                return state;
            },
        },
        {
            label: "Reverse pattern completely",
            shortLabel: "Reverse",
            args: {},
            apply: (state) => {
                state.pattern = state.pattern.reverse();
                return state;
            }
        },
        {
            label: "Reverse pattern partially",
            shortLabel: "ReversePartial",
            args: {},
            apply: (state) => {
                const startIndex = Math.floor(Math.random() * state.pattern.length);
                const endIndex = startIndex + Math.floor(Math.random() * (state.pattern.length - startIndex));
                const segment = state.pattern.slice(startIndex, endIndex + 1).reverse();
                for (let i = startIndex; i <= endIndex; i++) {
                    state.pattern[i] = segment[i - startIndex];
                }
                return state;
            }
        },
        {
            label: "Shift left",
            shortLabel: "ShiftLeft",
            args: {},
            apply: (state) => {
                const spare = state.pattern[0];
                for (let i = 0; i < state.pattern.length - 1; i++) {
                    state.pattern[i] = state.pattern[i + 1];
                }
                state.pattern[state.pattern.length - 1] = spare;
                return state;
            }
        },
        {
            label: "Shift right",
            shortLabel: "ShiftRight",
            args: {},
            apply: (state) => {
                const spare = state.pattern[state.pattern.length - 1];
                for (let i = state.pattern.length - 1; i > 0; i--) {
                    state.pattern[i] = state.pattern[i - 1];
                }
                state.pattern[0] = spare;
                return state;
            }
        },
    ],
    "Cut copy": [
        {
            label: "Remove last element",
            shortLabel: "RemoveLast",
            args: {},
            apply: (state) => {
                state.pattern.pop();
                return state;
            }
        },
        {
            label: "Remove element at random location",
            shortLabel: "RemoveRandom",
            args: {},
            apply: (state) => {
                const randomIndex = Math.floor(Math.random() * state.pattern.length);
                state.pattern.splice(randomIndex, 1);
                return state;
            }
        },
        {
            label: "Duplicate element at random location",
            shortLabel: "DuplicateRandom",
            args: {},
            apply: (state) => {
                const randomIndex = Math.floor(Math.random() * state.pattern.length);
                state.pattern.splice(randomIndex, 0, state.pattern[randomIndex]);
                return state;
            }
        },
        {
            label: "Insert extra element at random location",
            shortLabel: "InsertRandom",
            args: {},
            apply: (state) => {
                const distinctSounds = Array.from(new Set(state.pattern));
                const randomIndex = Math.floor(Math.random() * (state.pattern.length + 1));
                const randomSound = distinctSounds[Math.floor(Math.random() * distinctSounds.length)];
                state.pattern.splice(randomIndex, 0, randomSound);
                return state;
            }
        },
        {
            label: "Duplicate pattern",
            shortLabel: "Duplicate",
            args: {},
            apply: (state) => {
                state.pattern = state.pattern.concat(state.pattern);
                return state;
            }
        },
    ]
};
