var soundOptions = ["-", "bd", "sd", "rim", "hh", "oh", "lt", "mt", "ht", "rd", "cr"];
// to make sure we have enough to choose from, also in mutations
while (soundOptions.length < 10) {
    soundOptions = soundOptions.concat(soundOptions);
}

var chosenSounds = [];
var currentPattern = [] as string[];

var userHasInteracted = false;

type Pattern = {
    speed: number,
    sounds: string[],
    pattern: string[],
    bank: string
}

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
    replStop();
    replLoad(code);
    replStart();
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
    var patternString = "";
    for (let i = 0; i < currentPattern.length; i++) {
        patternString += currentPattern[i] + " ";
        const addExtraSpace = i + 1 == currentPattern.length / 2;
        if (addExtraSpace) {
            patternString += " ";
        }
    }
    const fullCode = "setcpm(120)\n" + "s(`<[" + patternString + "]@" + (currentPattern.length / 2) + ">`)";

    embedRepl(fullCode);
}

function patternGenerate() {
    const numchosenSoundsLower = parseInt((document.getElementById('numberOfSoundsLower') as HTMLInputElement).value);
    const numchosenSoundsUpper = parseInt((document.getElementById('numberOfSoundsUpper') as HTMLInputElement).value);
    const numchosenSounds = numchosenSoundsLower + Math.floor(Math.random() * (numchosenSoundsUpper - numchosenSoundsLower + 1));

    chosenSounds = [] as string[];
    // can include repetition, on purpose
    for (let i = 0; i < numchosenSounds; i++) {
        chosenSounds.push(soundOptions[Math.floor(Math.random() * soundOptions.length)]);
    }

    const chosenSoundsElement = document.getElementById('chosenSounds');
    chosenSoundsElement.innerText = "Chosen sounds: " + chosenSounds.join(", ");

    const patternLengthLower = parseInt((document.getElementById('patternLengthLower') as HTMLInputElement).value);
    const patternLengthUpper = parseInt((document.getElementById('patternLengthUpper') as HTMLInputElement).value);
    const patternLength = patternLengthLower + Math.floor(Math.random() * (patternLengthUpper - patternLengthLower + 1));

    currentPattern = [];
    for (let i = 0; i < patternLength; i++) {
        const newSound = chosenSounds[Math.floor(Math.random() * chosenSounds.length)];
        currentPattern.push(newSound);
    }

    console.log("Generated pattern: " + currentPattern);

    const distinctSounds = Array.from(new Set(currentPattern));
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
    console.log(currentPattern, "before");
    currentPattern = mutation.apply(currentPattern);
    console.log(currentPattern, "after");

    renderPattern();
}