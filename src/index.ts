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
]

class State {
    version: number = 0;
    speed: number;
    chosenSounds: string[];
    pattern: string[];
    bank: string;

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
var previousStates = [] as State[];
const maxPreviousStates = 10;

type Mutation = {
    label: string,
    shortLabel: string,
    args: {},
    apply: (state: State) => State
}

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
    };
}

document.addEventListener('DOMContentLoaded', function () {
    showMutationButtons();
});

async function replStop() {
    (document.getElementById('currentState') as any).editor.stop();
}

function replLoad(code: string) {
    (document.getElementById('currentState') as any).editor.setCode(code);
}

function replStart() {
    (document.getElementById('currentState') as any).editor.evaluate();
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

    const numchosenSoundsLower = parseInt((document.getElementById('numberOfSoundsLower') as HTMLInputElement).value);
    const numchosenSoundsUpper = parseInt((document.getElementById('numberOfSoundsUpper') as HTMLInputElement).value);
    const numchosenSounds = numchosenSoundsLower + Math.floor(Math.random() * (numchosenSoundsUpper - numchosenSoundsLower + 1));

    state.chosenSounds = [];
    // can include repetition, on purpose
    for (let i = 0; i < numchosenSounds; i++) {
        state.chosenSounds.push(soundOptions[Math.floor(Math.random() * soundOptions.length)]);
    }

    state.bank = bankOptions[Math.floor(Math.random() * bankOptions.length)];

    const patternLengthLower = parseInt((document.getElementById('patternLengthLower') as HTMLInputElement).value);
    const patternLengthUpper = parseInt((document.getElementById('patternLengthUpper') as HTMLInputElement).value);
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

function applyMutation(category: string, mutationId: number) {
    makeSpaceForNextState()

    const newVersion = state.version + 1;

    const mutation = mutations[category][mutationId];
    state = mutation.apply(state);
    state.version = newVersion;

    renderPattern();
}

function restorePreviousState(iterations: number) {
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
        (document.getElementById('stateMinusOne') as any).editor.setCode(previousStates[0].toCode());
        document.getElementById('versionMinusOne').innerText = "Previous pattern (#" + previousStates[0].version + ")";
    } else {
        (document.getElementById('stateMinusOne') as any).editor.setCode("// No previous state");
        document.getElementById('versionMinusOne').innerText = "Previous pattern";
    }

    if (previousStates.length > 1 && previousStates[1].version > 0) {
        (document.getElementById('stateMinusTwo') as any).editor.setCode(previousStates[1].toCode());
        document.getElementById('versionMinusTwo').innerText = "Previous pattern (#" + previousStates[1].version + ")";
    } else {
        (document.getElementById('stateMinusTwo') as any).editor.setCode("// No previous state");
        document.getElementById('versionMinusTwo').innerText = "Previous pattern";
    }
}
