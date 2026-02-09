var soundOptions = ["-", "bd", "cb", "cp", "cr", "hh", "ht", "lt", "mt", "oh", "perc", "rd", "rim", "sd", "sh", "tb"];
var soundIgnored = ["misc"]
// to make sure we have enough to choose from, also in mutations
while (soundOptions.length < 10) {
    soundOptions = soundOptions.concat(soundOptions);
}

// banks that have at most 4 missing drum sounds
var bankOptions = [
    "", // Strudel default, twice for higher chance
    "", // Strudel default, twice for higher chance
    "AkaiLinn",
    "AkaiMPC60", // 1988
    "AkaiXR10",
    "AlesisSR16", // 1990
    "BossDR550", // 1989
    "CircuitsDrumTracks", // 1984
    "CompuRhythm1000", // 1986, CR-1000
    "CompuRhythm8000", // 1981, CR-8000
    "EmuDrumulator", // 1983
    "EmuSP12",
    "KorgM1", // 1988
    "Linn9000", // 1984
    "Linndrum", // 1982
    "LinnLM1", // 1980
    "LinnLM2",
    "OberheimDMX", // 1980
    "RolandD110",
    "RolandD70",
    "RolandJD990",
    "RolandMC303",
    "RolandMT32", // 1987
    "RolandR8", // 1989
    "RolandS50", // 1986
    "RolandTR505", // 1986
    "RolandTR626",
    "RolandTR707", // 1985
    "RolandTR808", // 1980
    "SakataDPM48", // 1984
    "YamahaRM50", // 1992
    "YamahaRY30", // 1991
    "YamahaTG33", // 1990
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

var repls = [] as any[];
var playingRepl = -1;

type Mutation = {
    label: string,
    shortLabel: string,
    args: {},
    apply: (state: State) => State
}

function showMutationButtons() {
    document.getElementById('mutations').style.display = 'block';

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
    repls = [
        document.getElementById('currentState'),
        document.getElementById('stateMinusOne'),
        document.getElementById('stateMinusTwo'),
        document.getElementById('stateMinusThree'),
    ]
});

async function replStopAll() {
    for (let i = 0; i <= 3; i++) {
        await replStop(i);
    }
}

async function replStop(index: number) {
    if (index == -1) {
        return;
    }
    repls[index].editor.stop();
}

function replLoad(index: number, code: string) {
    repls[index].editor.setCode(code);
}

function replStart(index: number) {
    if (playingRepl != index) {
        replStop(playingRepl);
        playingRepl = index;
    }
    repls[index].editor.evaluate();
}

function renderPattern(index: number) {
    const fullCode = state.toCode();
    replLoad(index, fullCode);
    replStart(index);

    const chosenSoundsElement = document.getElementById('chosenSounds');
    chosenSoundsElement.innerText = "Chosen sounds: " + state.chosenSounds.join(", ");

    const versionElement = document.getElementById('currentVersion');
    versionElement.innerText = "Current pattern (#" + state.version + ")";
}

function patternGenerate() {
    if (state.version == 0) {
        showMutationButtons();
    }

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

    renderPattern(0);
}

function applyMutation(category: string, mutationId: number) {
    makeSpaceForNextState()

    const newVersion = state.version + 1;

    const mutation = mutations[category][mutationId];
    state = mutation.apply(state);
    state.version = newVersion;

    renderPattern(0);
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

    renderPattern(0);

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
        document.getElementById("patternMinusOne").style.display = "block";
        (document.getElementById('stateMinusOne') as any).editor.setCode(previousStates[0].toCode());
        document.getElementById('versionMinusOne').innerText = "Previous pattern (#" + previousStates[0].version + ")";
    } else {
        document.getElementById("patternMinusOne").style.display = "none";
        (document.getElementById('stateMinusOne') as any).editor.setCode("// No previous state");
    }

    if (previousStates.length > 1 && previousStates[1].version > 0) {
        document.getElementById("patternMinusTwo").style.display = "block";
        (document.getElementById('stateMinusTwo') as any).editor.setCode(previousStates[1].toCode());
        document.getElementById('versionMinusTwo').innerText = "Previous pattern (#" + previousStates[1].version + ")";
    } else {
        document.getElementById("patternMinusTwo").style.display = "none";
        (document.getElementById('stateMinusTwo') as any).editor.setCode("// No previous state");

    }

    if (previousStates.length > 2 && previousStates[2].version > 0) {
        document.getElementById("patternMinusThree").style.display = "block";
        (document.getElementById('stateMinusThree') as any).editor.setCode(previousStates[2].toCode());
        document.getElementById('versionMinusThree').innerText = "Previous pattern (#" + previousStates[2].version + ")";
    } else {
        document.getElementById("patternMinusThree").style.display = "none";
        (document.getElementById('stateMinusThree') as any).editor.setCode("// No previous state");
    }
}
