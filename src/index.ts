var soundOptions = ["-", "bd", "sd", "rim", "hh", "oh", "lt", "mt", "ht", "rd", "cr"];
// to make sure we have enough to choose from, also in mutations
while (soundOptions.length < 10) {
    soundOptions = soundOptions.concat(soundOptions);
}

// banks that have at most 4 missing drum sounds
var bankOptions = [
    "",
    "9000",
    "akailinn",
    "akaimpc60",
    "akaixr10",
    "alesissr16",
    "bossdr550",
    "circuitsdrumtracks",
    "compurhythm1000",
    "compurhythm8000",
    "d110",
    "d70",
    "dmx",
    "dpm48",
    "dr550",
    "drumulator",
    "emudrumulator",
    "emusp12",
    "jd990",
    "korgm1",
    "linn",
    "linn9000",
    "linndrum",
    "linnlm1",
    "linnlm2",
    "lm1",
    "lm2",
    "m1",
    "mc303",
    "mpc60",
    "mt32",
    "oberheimdmx",
    "r8",
    "rm50",
    "rolandcompurhythm1000",
    "rolandcompurhythm8000",
    "rolandd110",
    "rolandd70",
    "rolandjd990",
    "rolandmc303",
    "rolandmt32",
    "rolandr8",
    "rolands50",
    "rolandtr505",
    "rolandtr626",
    "rolandtr707",
    "rolandtr808",
    "ry30",
    "s50",
    "sakatadpm48",
    "sequentialcircuitsdrumtracks",
    "sp12",
    "sr16",
    "tg33",
    "tr505",
    "tr626",
    "tr707",
    "tr808",
    "xr10",
    "yamaharm50",
    "yamahary30",
    "yamahatg33",
]

class State {
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
}

var state = new State();

type Mutation = {
    label: string,
    shortLabel: string,
    args: {},
    apply: (pattern: string[]) => string[]
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

function embedRepl(code: string) {

}

function replStop() {
    (document.getElementById('repl') as any).editor.stop();
}

function replLoad(code: string) {
    (document.getElementById('repl') as any).editor.setCode(code);
}

function replStart() {
    (document.getElementById('repl') as any).editor.evaluate();
}

function renderPattern() {
    replStop();
    const fullCode = state.toCode();
    replLoad(fullCode);
    replStart();
}

function patternGenerate() {
    const numchosenSoundsLower = parseInt((document.getElementById('numberOfSoundsLower') as HTMLInputElement).value);
    const numchosenSoundsUpper = parseInt((document.getElementById('numberOfSoundsUpper') as HTMLInputElement).value);
    const numchosenSounds = numchosenSoundsLower + Math.floor(Math.random() * (numchosenSoundsUpper - numchosenSoundsLower + 1));

    state.chosenSounds = [];
    // can include repetition, on purpose
    for (let i = 0; i < numchosenSounds; i++) {
        state.chosenSounds.push(soundOptions[Math.floor(Math.random() * soundOptions.length)]);
    }

    const chosenSoundsElement = document.getElementById('chosenSounds');
    chosenSoundsElement.innerText = "Chosen sounds: " + state.chosenSounds.join(", ");

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
    const mutation = mutations[category][mutationId];
    console.log("Applying mutation " + mutation.label);
    console.log(state.pattern, "before");
    state.pattern = mutation.apply(state.pattern);
    console.log(state.pattern, "after");

    renderPattern();
}