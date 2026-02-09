const mutations = {
    "Sounds": [
        {
            label: "Change one sound",
            shortLabel: "ChangeSound",
            args: {},
            apply: (state: State) => {
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
                return state
            }
        },
        {
            label: "Change all sounds",
            shortLabel: "ChangeAllSounds",
            args: {},
            apply: (state: State) => {
                const currentSounds = state.chosenSounds;
                var newSounds = [] as string[];

                for (let i = 0; i < currentSounds.length; i++) {
                    var newSound = currentSounds[i];
                    // don't change -
                    if (newSound !== "-") {
                        // make sure newSound is unique and different
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
                state.chosenSounds = newSounds;
                return state;
            }
        },
        {
            label: "Change soundbank",
            shortLabel: "ChangeBank",
            args: {},
            apply: (state: State) => {
                var newBank = state.bank;
                while (newBank == state.bank) {
                    newBank = bankOptions[Math.floor(Math.random() * bankOptions.length)];
                }
                state.bank = newBank;
                return state;
            }
        },
    ],
    "Individual notes": [
        {
            label: "Change one note",
            shortLabel: "ChangeToChosen",
            args: {},
            apply: (state: State) => {
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
            label: "Mute one note",
            shortLabel: "MuteSound",
            args: {},
            apply: (state: State) => {
                const distinctSounds = new Set(state.pattern);
                distinctSounds.delete("-");
                if (Array.from(distinctSounds).length <= 1) {
                    console.log("Pattern has one or no unmuted sounds, cannot mute");
                    return state;
                }

                var indexToMute;
                do {
                    indexToMute = Math.floor(Math.random() * state.pattern.length);
                } while (state.pattern[indexToMute] == "-")

                state.pattern[indexToMute] = "-";
                return state;
            }
        },
        {
            label: "Unmute one note",
            shortLabel: "UnmuteSound",
            args: {},
            apply: (state: State) => {
                const distinctSounds = new Set(state.pattern);
                if (!distinctSounds.has("-")) {
                    console.log("Pattern has no muted sounds, cannot unmute");
                    return state;
                }

                var indexToUnmute;
                do {
                    indexToUnmute = Math.floor(Math.random() * state.pattern.length);
                } while (state.pattern[indexToUnmute] != "-")

                var chosenSound = "-";
                while (chosenSound == "-") {
                    chosenSound = state.chosenSounds[Math.floor(Math.random() * state.chosenSounds.length)];
                }

                state.pattern[indexToUnmute] = chosenSound;
                return state;
            }
        },
        {
            label: "Swap two notes",
            shortLabel: "Swap",
            args: {},
            apply: (state: State) => {
                const index1 = Math.floor(Math.random() * state.pattern.length);
                var index2 = index1;
                while (index2 == index1 || state.pattern[index2] == state.pattern[index1]) {
                    index2 = Math.floor(Math.random() * state.pattern.length);
                }
                const spare = state.pattern[index1];
                state.pattern[index1] = state.pattern[index2];
                state.pattern[index2] = spare;
                return state;
            }
        },
    ],
    "Individual insert/remove": [
        {
            label: "Duplicate random note",
            shortLabel: "DuplicateRandom",
            args: {},
            apply: (state: State) => {
                const randomIndex = Math.floor(Math.random() * state.pattern.length);
                state.pattern.splice(randomIndex, 0, state.pattern[randomIndex]);
                return state;
            }
        },
        {
            label: "Insert random note",
            shortLabel: "InsertRandom",
            args: {},
            apply: (state: State) => {
                const distinctSounds = Array.from(new Set(state.pattern));
                const randomIndex = Math.floor(Math.random() * (state.pattern.length + 1));
                const randomSound = distinctSounds[Math.floor(Math.random() * distinctSounds.length)];
                state.pattern.splice(randomIndex, 0, randomSound);
                return state;
            }
        },
        {
            label: "Remove last note",
            shortLabel: "RemoveLast",
            args: {},
            apply: (state: State) => {
                state.pattern.pop();
                return state;
            }
        },
        {
            label: "Remove random note",
            shortLabel: "RemoveRandom",
            args: {},
            apply: (state: State) => {
                const randomIndex = Math.floor(Math.random() * state.pattern.length);
                state.pattern.splice(randomIndex, 1);
                return state;
            }
        },
    ],
    "Order": [
        {
            label: "Shuffle pattern",
            shortLabel: "Shuffle",
            args: {},
            apply: (state: State) => {
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
            label: "Reverse pattern",
            shortLabel: "Reverse",
            args: {},
            apply: (state: State) => {
                state.pattern = state.pattern.reverse();
                return state;
            }
        },
        {
            label: "Partially reverse pattern",
            shortLabel: "ReversePartial",
            args: {},
            apply: (state: State) => {
                const startIndex = Math.floor(Math.random() * state.pattern.length);
                const endIndex = startIndex + Math.floor(Math.random() * (state.pattern.length - startIndex));
                const segment = state.pattern.slice(startIndex, endIndex + 1).reverse();
                for (let i = startIndex; i <= endIndex; i++) {
                    state.pattern[i] = segment[i - startIndex];
                }
                return state;
            }
        },
    ],
    "Cut copy": [
        {
            label: "Shift left",
            shortLabel: "ShiftLeft",
            args: {},
            apply: (state: State) => {
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
            apply: (state: State) => {
                const spare = state.pattern[state.pattern.length - 1];
                for (let i = state.pattern.length - 1; i > 0; i--) {
                    state.pattern[i] = state.pattern[i - 1];
                }
                state.pattern[0] = spare;
                return state;
            }
        },
        {
            label: "Duplicate pattern",
            shortLabel: "Duplicate",
            args: {},
            apply: (state: State) => {
                state.pattern = state.pattern.concat(state.pattern);
                return state;
            }
        },
    ]
};
