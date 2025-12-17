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
];
class State {
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
}
var state = new State();
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
function embedRepl(code) {
}
function replStop() {
    document.getElementById('repl').editor.stop();
}
function replLoad(code) {
    document.getElementById('repl').editor.setCode(code);
}
function replStart() {
    document.getElementById('repl').editor.evaluate();
}
function renderPattern() {
    replStop();
    const fullCode = state.toCode();
    replLoad(fullCode);
    replStart();
}
function patternGenerate() {
    const numchosenSoundsLower = parseInt(document.getElementById('numberOfSoundsLower').value);
    const numchosenSoundsUpper = parseInt(document.getElementById('numberOfSoundsUpper').value);
    const numchosenSounds = numchosenSoundsLower + Math.floor(Math.random() * (numchosenSoundsUpper - numchosenSoundsLower + 1));
    state.chosenSounds = [];
    // can include repetition, on purpose
    for (let i = 0; i < numchosenSounds; i++) {
        state.chosenSounds.push(soundOptions[Math.floor(Math.random() * soundOptions.length)]);
    }
    const chosenSoundsElement = document.getElementById('chosenSounds');
    chosenSoundsElement.innerText = "Chosen sounds: " + state.chosenSounds.join(", ");
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
    const mutation = mutations[category][mutationId];
    console.log("Applying mutation " + mutation.label);
    console.log(state.pattern, "before");
    state.pattern = mutation.apply(state.pattern);
    console.log(state.pattern, "after");
    renderPattern();
}
const mutations = {
    "Soundbank": [
        {
            label: "Change soundbank",
            shortLabel: "ChangeBank",
            args: {},
            apply: (pattern) => {
                var newBank = state.bank;
                while (newBank == state.bank) {
                    newBank = bankOptions[Math.floor(Math.random() * bankOptions.length)];
                }
                state.bank = newBank;
                return pattern;
            }
        },
    ],
    "Sounds": [
        {
            label: "Randomly change a sound in the pattern",
            shortLabel: "ChangeSound",
            args: {},
            apply: (pattern) => {
                const distinctSounds = Array.from(new Set(pattern));
                var soundToReplace = "-";
                while (soundToReplace == "-") {
                    soundToReplace = distinctSounds[Math.floor(Math.random() * distinctSounds.length)];
                }
                var newSound = soundToReplace;
                while (newSound == soundToReplace || distinctSounds.includes(newSound)) {
                    newSound = soundOptions[Math.floor(Math.random() * soundOptions.length)];
                }
                for (let i = 0; i < pattern.length; i++) {
                    if (pattern[i] == soundToReplace) {
                        pattern[i] = newSound;
                    }
                }
                return pattern;
            }
        },
        {
            label: "Randomly change all sounds in the pattern",
            shortLabel: "ChangeAllSounds",
            args: {},
            apply: (pattern) => {
                const currentSounds = Array.from(new Set(pattern));
                var newSounds = [];
                for (let i = 0; i < currentSounds.length; i++) {
                    var newSound = currentSounds[i];
                    if (newSound !== "-") {
                        while (newSounds.includes(newSound) || currentSounds.includes(newSound)) {
                            newSound = soundOptions[Math.floor(Math.random() * soundOptions.length)];
                        }
                    }
                    newSounds.push(newSound);
                }
                for (let i = 0; i < pattern.length; i++) {
                    const soundIndex = currentSounds.indexOf(pattern[i]);
                    pattern[i] = newSounds[soundIndex];
                }
                return pattern;
            }
        },
        {
            label: "Mute a random location in the pattern",
            shortLabel: "MuteSound",
            args: {},
            apply: (pattern) => {
                const distinctSounds = new Set(pattern);
                distinctSounds.delete("-");
                if (Array.from(distinctSounds).length <= 1) {
                    console.log("Pattern has one or no unmuted sounds, cannot mute");
                    return pattern;
                }
                var indexToMute;
                do {
                    indexToMute = Math.floor(Math.random() * pattern.length);
                } while (pattern[indexToMute] == "-");
                pattern[indexToMute] = "-";
                return pattern;
            }
        },
        {
            label: "Unmute a random location in the pattern",
            shortLabel: "UnmuteSound",
            args: {},
            apply: (pattern) => {
                const distinctSounds = new Set(pattern);
                if (!distinctSounds.has("-")) {
                    console.log("Pattern has no muted sounds, cannot unmute");
                    return pattern;
                }
                var indexToUnmute;
                do {
                    indexToUnmute = Math.floor(Math.random() * pattern.length);
                } while (pattern[indexToUnmute] != "-");
                var chosenSound = "-";
                while (chosenSound == "-") {
                    chosenSound = state.chosenSounds[Math.floor(Math.random() * state.chosenSounds.length)];
                }
                pattern[indexToUnmute] = chosenSound;
                return pattern;
            }
        },
    ],
    "Order": [
        {
            label: "Swap two random elements",
            shortLabel: "Swap",
            args: {},
            apply: (pattern) => {
                const index1 = Math.floor(Math.random() * pattern.length);
                var index2 = index1;
                while (index2 == index1) {
                    index2 = Math.floor(Math.random() * pattern.length);
                }
                const spare = pattern[index1];
                pattern[index1] = pattern[index2];
                pattern[index2] = spare;
                return pattern;
            }
        },
        {
            label: "Completely shuffle pattern",
            shortLabel: "Shuffle",
            args: {},
            apply: (pattern) => {
                var newPattern = [];
                const newIndices = Array.from(pattern.keys()).sort(() => Math.random() - 0.5);
                for (let i = 0; i < pattern.length; i++) {
                    newPattern[i] = pattern[newIndices[i]];
                }
                return newPattern;
            },
        },
        {
            label: "Reverse pattern completely",
            shortLabel: "Reverse",
            args: {},
            apply: (pattern) => {
                return pattern.reverse();
            }
        },
        {
            label: "Reverse pattern partially",
            shortLabel: "ReversePartial",
            args: {},
            apply: (pattern) => {
                const startIndex = Math.floor(Math.random() * pattern.length);
                const endIndex = startIndex + Math.floor(Math.random() * (pattern.length - startIndex));
                const segment = pattern.slice(startIndex, endIndex + 1).reverse();
                for (let i = startIndex; i <= endIndex; i++) {
                    pattern[i] = segment[i - startIndex];
                }
                return pattern;
            }
        },
        {
            label: "Shift left",
            shortLabel: "ShiftLeft",
            args: {},
            apply: (pattern) => {
                const spare = pattern[0];
                for (let i = 0; i < pattern.length - 1; i++) {
                    pattern[i] = pattern[i + 1];
                }
                pattern[pattern.length - 1] = spare;
                return pattern;
            }
        },
        {
            label: "Shift right",
            shortLabel: "ShiftRight",
            args: {},
            apply: (pattern) => {
                const spare = pattern[pattern.length - 1];
                for (let i = pattern.length - 1; i > 0; i--) {
                    pattern[i] = pattern[i - 1];
                }
                pattern[0] = spare;
                return pattern;
            }
        },
    ],
    "Cut copy": [
        {
            label: "Remove last element",
            shortLabel: "RemoveLast",
            args: {},
            apply: (pattern) => {
                pattern.pop();
                return pattern;
            }
        },
        {
            label: "Remove element at random location",
            shortLabel: "RemoveRandom",
            args: {},
            apply: (pattern) => {
                const randomIndex = Math.floor(Math.random() * pattern.length);
                pattern.splice(randomIndex, 1);
                return pattern;
            }
        },
        {
            label: "Duplicate element at random location",
            shortLabel: "DuplicateRandom",
            args: {},
            apply: (pattern) => {
                const randomIndex = Math.floor(Math.random() * pattern.length);
                pattern.splice(randomIndex, 0, pattern[randomIndex]);
                return pattern;
            }
        },
        {
            label: "Insert extra element at random location",
            shortLabel: "InsertRandom",
            args: {},
            apply: (pattern) => {
                const distinctSounds = Array.from(new Set(pattern));
                const randomIndex = Math.floor(Math.random() * (pattern.length + 1));
                const randomSound = distinctSounds[Math.floor(Math.random() * distinctSounds.length)];
                pattern.splice(randomIndex, 0, randomSound);
                return pattern;
            }
        },
        {
            label: "Duplicate pattern",
            shortLabel: "Duplicate",
            args: {},
            apply: (pattern) => {
                return pattern.concat(pattern);
            }
        },
    ]
};
