import { Layer } from "./layer";

var soundOptions = ["-", "bd", "cb", "cp", "cr", "hh", "ht", "lt", "mt", "oh", "perc", "rd", "rim", "sd", "sh", "tb"];
var soundIgnored = ["misc"]
// to make sure we have enough to choose from, also in mutations
while (soundOptions.length < 10) {
    soundOptions = soundOptions.concat(soundOptions);
}

// banks that have at most 4 missing drum sounds
var bankOptions = [
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

export class DrumLayer extends Layer {
    soundOptions: string[];
    chosenSounds: string[];

    bankOptions: string[];
    bank: string;

    pattern: string[];


    constructor(cycleDivision: number[]) {
        super("drum", cycleDivision);

        this.soundOptions = soundOptions;
        this.chosenSounds = [];

        this.bankOptions = bankOptions;
        this.bank = "";

        this.pattern = [];
    }

    copy(): DrumLayer {
        const newLayer = new DrumLayer(
            [...this.cycleDivison]
        );
        newLayer.soundOptions = [...this.soundOptions];
        newLayer.chosenSounds = [...this.chosenSounds];
        newLayer.bankOptions = [...this.bankOptions];
        newLayer.bank = this.bank;
        newLayer.pattern = [...this.pattern];
        return newLayer;
    }

    generate() {
        // choose sounds
        const numChosenSoundsLower = parseInt((document.getElementById('numberOfSoundsLower') as HTMLInputElement).value);
        const numChosenSoundsUpper = parseInt((document.getElementById('numberOfSoundsUpper') as HTMLInputElement).value);
        const numChosenSounds = numChosenSoundsLower + Math.floor(Math.random() * (numChosenSoundsUpper - numChosenSoundsLower + 1));

        this.chosenSounds = [];
        // can include repetition, on purpose
        for (let i = 0; i < numChosenSounds; i++) {
            this.chosenSounds.push(this.soundOptions[Math.floor(Math.random() * this.soundOptions.length)]);
        }

        // generate sound pattern
        const patternLengthLower = parseInt((document.getElementById('patternLengthLower') as HTMLInputElement).value);
        const patternLengthUpper = parseInt((document.getElementById('patternLengthUpper') as HTMLInputElement).value);
        const patternLength = patternLengthLower + Math.floor(Math.random() * (patternLengthUpper - patternLengthLower + 1));

        this.pattern = [];
        for (let i = 0; i < patternLength; i++) {
            const newSound = this.chosenSounds[Math.floor(Math.random() * this.chosenSounds.length)];
            this.pattern.push(newSound);
        }

        console.log(this.cycleDivison);
        const originalCycleDivision = this.cycleDivison[0];
        const multipleCycles = originalCycleDivision < patternLength;
        if (multipleCycles) {
            const fullCycles = patternLength / originalCycleDivision;
            const matchingCycles = patternLength % originalCycleDivision == 0;
            if (matchingCycles) {
                this.cycleDivison = Array(fullCycles).fill(originalCycleDivision);
            } else {
                this.cycleDivison = Array(Math.ceil(fullCycles)).fill(originalCycleDivision);
                const remaining = patternLength % originalCycleDivision;
                this.cycleDivison[Math.floor(Math.random() * this.cycleDivison.length)] = remaining;
            }
        }
        console.log(this.cycleDivison);

        console.log("Generated pattern: " + this.pattern);

        const distinctSounds = Array.from(new Set(this.pattern));
        if (distinctSounds.length == 1) {
            console.log("Regenerating pattern because it had only one distinct sound");
            this.generate();
            return;
        }

        this.randomBank();
    }

    randomBank() {
        const numberOfBanks = 1 + Math.floor(Math.random() * 3);
        const chooseDefaultBank = Math.random() < 0.1;
        const divideCycle = Math.random() < 0.5;
        if (chooseDefaultBank) {
            this.bank = "''";
        } else {
            if (numberOfBanks == 1) {
                this.bank = `'${this.bankOptions[Math.floor(Math.random() * this.bankOptions.length)]}'`;
            } else {
                const chosenBanks = [];
                for (let i = 0; i < numberOfBanks; i++) {
                    let chosenBank = this.bankOptions[Math.floor(Math.random() * this.bankOptions.length)];
                    if (!divideCycle) {
                        chosenBank += this.cycleDivison.length;
                    }
                    chosenBanks.push(chosenBank);
                }
                this.bank = `\`<${chosenBanks.join(" ")}>\``;
            }
        }
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

        let fullCode = "s(`<[";
        for (let i = 0; i < this.pattern.length; i++) {
            // TODO: use other cycle divisions as well
            if (i % this.cycleDivison[0] == 0 && i != 0) {
                fullCode += "] [";
            }
            fullCode += this.pattern[i] + " ";
        }
        console.log(fullCode);
        fullCode += "]>`)._punchcard({labels: true})\n.bank(" + this.bank + ")";
        console.log(fullCode);
        return fullCode;
    }
}


export const mutations = {
    "Sounds": [
        {
            label: "Change one sound",
            shortLabel: "ChangeSound",
            args: {},
            apply: (layer: DrumLayer) => {
                const distinctSounds = Array.from(new Set(layer.pattern));
                var soundToReplace = "-";
                while (soundToReplace == "-") {
                    soundToReplace = distinctSounds[Math.floor(Math.random() * distinctSounds.length)];
                }
                var newSound = soundToReplace;
                while (newSound == soundToReplace || distinctSounds.includes(newSound)) {
                    newSound = layer.soundOptions[Math.floor(Math.random() * layer.soundOptions.length)];
                }
                for (let i = 0; i < layer.pattern.length; i++) {
                    if (layer.pattern[i] == soundToReplace) {
                        layer.pattern[i] = newSound;
                    }
                }
                return layer
            }
        },
        {
            label: "Change all sounds",
            shortLabel: "ChangeAllSounds",
            args: {},
            apply: (layer: DrumLayer) => {
                const currentSounds = layer.chosenSounds;
                var newSounds = [] as string[];

                for (let i = 0; i < currentSounds.length; i++) {
                    var newSound = currentSounds[i];
                    // don't change -
                    if (newSound !== "-") {
                        // make sure newSound is unique and different
                        while (newSound == "-" || newSounds.includes(newSound) || currentSounds.includes(newSound)) {
                            const newSoundIndex = Math.floor(Math.random() * layer.soundOptions.length);
                            newSound = layer.soundOptions[newSoundIndex];
                        }
                    }
                    newSounds.push(newSound);
                }
                for (let i = 0; i < layer.pattern.length; i++) {
                    const soundIndex = currentSounds.indexOf(layer.pattern[i]);
                    if (soundIndex != -1) {
                        layer.pattern[i] = newSounds[soundIndex];
                    }
                }
                layer.chosenSounds = newSounds;
                return layer;
            }
        },
        {
            label: "Change soundbank",
            shortLabel: "ChangeBank",
            args: {},
            apply: (layer: DrumLayer) => {
                layer.randomBank();
                return layer;
            }
        },
    ],
    "Individual notes": [
        {
            label: "Change one note",
            shortLabel: "ChangeToChosen",
            args: {},
            apply: (layer: DrumLayer) => {
                const distinctSounds = Array.from(new Set(layer.pattern));
                var indexToChange = Math.floor(Math.random() * layer.pattern.length);
                var newSound = layer.pattern[indexToChange];
                while (newSound == layer.pattern[indexToChange]) {
                    newSound = layer.chosenSounds[Math.floor(Math.random() * layer.chosenSounds.length)];
                }
                layer.pattern[indexToChange] = newSound;
                return layer;
            }
        },
        {
            label: "Mute one note",
            shortLabel: "MuteSound",
            args: {},
            apply: (layer: DrumLayer) => {
                const distinctSounds = new Set(layer.pattern);
                distinctSounds.delete("-");
                if (Array.from(distinctSounds).length <= 1) {
                    console.log("Pattern has one or no unmuted sounds, cannot mute");
                    return layer;
                }

                var indexToMute;
                do {
                    indexToMute = Math.floor(Math.random() * layer.pattern.length);
                } while (layer.pattern[indexToMute] == "-")

                layer.pattern[indexToMute] = "-";
                return layer;
            }
        },
        {
            label: "Unmute one note",
            shortLabel: "UnmuteSound",
            args: {},
            apply: (layer: DrumLayer) => {
                const distinctSounds = new Set(layer.pattern);
                if (!distinctSounds.has("-")) {
                    console.log("Pattern has no muted sounds, cannot unmute");
                    return layer;
                }

                var indexToUnmute;
                do {
                    indexToUnmute = Math.floor(Math.random() * layer.pattern.length);
                } while (layer.pattern[indexToUnmute] != "-")

                var chosenSound = "-";
                while (chosenSound == "-") {
                    chosenSound = layer.chosenSounds[Math.floor(Math.random() * layer.chosenSounds.length)];
                }

                layer.pattern[indexToUnmute] = chosenSound;
                return layer;
            }
        },
        {
            label: "Swap two notes",
            shortLabel: "Swap",
            args: {},
            apply: (layer: DrumLayer) => {
                const index1 = Math.floor(Math.random() * layer.pattern.length);
                var index2 = index1;
                while (index2 == index1 || layer.pattern[index2] == layer.pattern[index1]) {
                    index2 = Math.floor(Math.random() * layer.pattern.length);
                }
                const spare = layer.pattern[index1];
                layer.pattern[index1] = layer.pattern[index2];
                layer.pattern[index2] = spare;
                return layer;
            }
        },
    ],
    "Individual insert/remove": [
        {
            label: "Duplicate random note",
            shortLabel: "DuplicateRandom",
            args: {},
            apply: (layer: DrumLayer) => {
                const randomIndex = Math.floor(Math.random() * layer.pattern.length);
                layer.pattern.splice(randomIndex, 0, layer.pattern[randomIndex]);
                return layer;
            }
        },
        {
            label: "Insert random note",
            shortLabel: "InsertRandom",
            args: {},
            apply: (layer: DrumLayer) => {
                const distinctSounds = Array.from(new Set(layer.pattern));
                const randomIndex = Math.floor(Math.random() * (layer.pattern.length + 1));
                const randomSound = distinctSounds[Math.floor(Math.random() * distinctSounds.length)];
                layer.pattern.splice(randomIndex, 0, randomSound);
                return layer;
            }
        },
        {
            label: "Remove last note",
            shortLabel: "RemoveLast",
            args: {},
            apply: (layer: DrumLayer) => {
                layer.pattern.pop();
                return layer;
            }
        },
        {
            label: "Remove random note",
            shortLabel: "RemoveRandom",
            args: {},
            apply: (layer: DrumLayer) => {
                const randomIndex = Math.floor(Math.random() * layer.pattern.length);
                layer.pattern.splice(randomIndex, 1);
                return layer;
            }
        },
    ],
    "Order": [
        {
            label: "Shuffle pattern",
            shortLabel: "Shuffle",
            args: {},
            apply: (layer: DrumLayer) => {
                var newPattern = [];
                const newIndices = Array.from(layer.pattern.keys()).sort(() => Math.random() - 0.5);
                for (let i = 0; i < layer.pattern.length; i++) {
                    newPattern[i] = layer.pattern[newIndices[i]];
                }
                layer.pattern = newPattern;
                return layer;
            },
        },
        {
            label: "Reverse pattern",
            shortLabel: "Reverse",
            args: {},
            apply: (layer: DrumLayer) => {
                layer.pattern = layer.pattern.reverse();
                return layer;
            }
        },
        {
            label: "Partially reverse pattern",
            shortLabel: "ReversePartial",
            args: {},
            apply: (layer: DrumLayer) => {
                const startIndex = Math.floor(Math.random() * layer.pattern.length);
                const endIndex = startIndex + Math.floor(Math.random() * (layer.pattern.length - startIndex));
                const segment = layer.pattern.slice(startIndex, endIndex + 1).reverse();
                for (let i = startIndex; i <= endIndex; i++) {
                    layer.pattern[i] = segment[i - startIndex];
                }
                return layer;
            }
        },
    ],
    "Cut copy": [
        {
            label: "Shift left",
            shortLabel: "ShiftLeft",
            args: {},
            apply: (layer: DrumLayer) => {
                const spare = layer.pattern[0];
                for (let i = 0; i < layer.pattern.length - 1; i++) {
                    layer.pattern[i] = layer.pattern[i + 1];
                }
                layer.pattern[layer.pattern.length - 1] = spare;
                return layer;
            }
        },
        {
            label: "Shift right",
            shortLabel: "ShiftRight",
            args: {},
            apply: (layer: DrumLayer) => {
                const spare = layer.pattern[layer.pattern.length - 1];
                for (let i = layer.pattern.length - 1; i > 0; i--) {
                    layer.pattern[i] = layer.pattern[i - 1];
                }
                layer.pattern[0] = spare;
                return layer;
            }
        },
        {
            label: "Duplicate pattern",
            shortLabel: "Duplicate",
            args: {},
            apply: (layer: DrumLayer) => {
                layer.pattern = layer.pattern.concat(layer.pattern);
                return layer;
            }
        },
    ]
};
