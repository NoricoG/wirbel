const mutations = {
    "Sounds": [
        {
            label: "Randomly change a sound in the pattern",
            shortLabel: "ChangeSound",
            args: {},
            apply: (pattern: string[]) => {
                const distinctSounds = Array.from(new Set(pattern));
                const soundToReplace = distinctSounds[Math.floor(Math.random() * distinctSounds.length)];
                var newSound = soundToReplace;
                while (newSound == soundToReplace || distinctSounds.includes(newSound)) {
                    newSound = soundOptions[Math.floor(Math.random() * soundOptions.length)];
                }
                for (let i = 0; i < pattern.length; i++) {
                    if (pattern[i] == soundToReplace) {
                        pattern[i] = newSound;
                    }
                }
                return pattern
            }
        },
        {
            label: "Randomly change all sounds in the pattern",
            shortLabel: "ChangeAllSounds",
            args: {},
            apply: (pattern: string[]) => {
                const distinctSounds = Array.from(new Set(pattern));
                var newSounds = [] as string[];
                for (let i = 0; i < distinctSounds.length; i++) {
                    var newSound = distinctSounds[i];
                    while (newSounds.includes(newSound) || distinctSounds.includes(newSound)) {
                        newSound = soundOptions[Math.floor(Math.random() * soundOptions.length)];
                    }
                    newSounds.push(newSound);
                }
                for (let i = 0; i < pattern.length; i++) {
                    const index = distinctSounds.indexOf(pattern[i]);
                    pattern[i] = newSounds[index];
                }
                return pattern;
            }
        },
    ],
    "Order": [
        {
            label: "Swap two random elements",
            shortLabel: "Swap",
            args: {},
            apply: (pattern: string[]) => {
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
            apply: (pattern: string[]) => {
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
            apply: (pattern: string[]) => {
                return pattern.reverse();
            }
        },
        {
            label: "Reverse pattern partially",
            shortLabel: "ReversePartial",
            args: {},
            apply: (pattern: string[]) => {
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
            apply: (pattern: string[]) => {
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
            apply: (pattern: string[]) => {
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
            apply: (pattern: string[]) => {
                pattern.pop();
                return pattern;
            }
        },
        {
            label: "Remove element at random location",
            shortLabel: "RemoveRandom",
            args: {},
            apply: (pattern: string[]) => {
                const randomIndex = Math.floor(Math.random() * pattern.length);
                pattern.splice(randomIndex, 1);
                return pattern;
            }
        },
        {
            label: "Duplicate element at random location",
            shortLabel: "DuplicateRandom",
            args: {},
            apply: (pattern: string[]) => {
                const randomIndex = Math.floor(Math.random() * pattern.length);
                pattern.splice(randomIndex, 0, pattern[randomIndex]);
                return pattern;
            }
        },
        {
            label: "Insert extra element at random location",
            shortLabel: "InsertRandom",
            args: {},
            apply: (pattern: string[]) => {
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
            apply: (pattern: string[]) => {
                return pattern.concat(pattern);
            }
        }
    ]
};