var soundOptions = ["-", "bd", "sd", "rim", "hh", "oh", "lt", "mt", "ht", "rd", "cr"];
// to make sure we have enough to choose from, also in mutations
while (soundOptions.length < 10) {
    soundOptions = soundOptions.concat(soundOptions);
}
var chosenSounds = [];
var currentPattern = [];
var userHasInteracted = false;
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
    replStop();
    replLoad(code);
    replStart();
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
    const numchosenSoundsLower = parseInt(document.getElementById('numberOfSoundsLower').value);
    const numchosenSoundsUpper = parseInt(document.getElementById('numberOfSoundsUpper').value);
    const numchosenSounds = numchosenSoundsLower + Math.floor(Math.random() * (numchosenSoundsUpper - numchosenSoundsLower + 1));
    chosenSounds = [];
    // can include repetition, on purpose
    for (let i = 0; i < numchosenSounds; i++) {
        chosenSounds.push(soundOptions[Math.floor(Math.random() * soundOptions.length)]);
    }
    const chosenSoundsElement = document.getElementById('chosenSounds');
    chosenSoundsElement.innerText = "Chosen sounds: " + chosenSounds.join(", ");
    const patternLengthLower = parseInt(document.getElementById('patternLengthLower').value);
    const patternLengthUpper = parseInt(document.getElementById('patternLengthUpper').value);
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
function applyMutation(category, mutationId) {
    const mutation = mutations[category][mutationId];
    console.log("Applying mutation " + mutation.label);
    console.log(currentPattern, "before");
    currentPattern = mutation.apply(currentPattern);
    console.log(currentPattern, "after");
    renderPattern();
}
const mutations = {
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
                var indexToMute;
                do {
                    indexToMute = Math.floor(Math.random() * pattern.length);
                } while (pattern[indexToMute] != "-");
                var chosenSound = "-";
                while (chosenSound == "-") {
                    chosenSound = chosenSounds[Math.floor(Math.random() * chosenSounds.length)];
                }
                pattern[indexToMute] = chosenSound;
                return pattern;
            }
        }
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
        }
    ]
};
