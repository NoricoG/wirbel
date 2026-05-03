import { Layer } from "./layer";
import { DrumBank } from "../func/samples/drumBank";
import { DrumBankSound } from "../func/samples/drumBankSound";
import { DrumSound } from "../func/samples/drumSound";

export class DrumLayer extends Layer {
    soundOptions: string[];
    chosenSounds: string[];

    bankOptions: string[];
    bank: string;

    pattern: string[];


    constructor(cycleDivision: number[]) {
        const funcs = Math.random() < 0.5 ? [
            new DrumSound(),
            new DrumBank(),
        ] : [
            new DrumBankSound()
        ];
        super("drum", cycleDivision, funcs);
    }

    generate() {
        for (const func of this.funcs) {
            func.createPattern();
        }
    }

    toCode() {
        return `${this.funcs.map(x => x.toCode()).join(".")}._punchcard({labels: true})`;
    }
}


export const mutations = {
    // "Sounds": [
    //     {
    //         label: "Change one sound",
    //         shortLabel: "ChangeSound",
    //         args: {},
    //         apply: (layer: DrumLayer) => {
    //             const distinctSounds = Array.from(new Set(layer.pattern));
    //             var soundToReplace = "-";
    //             while (soundToReplace == "-") {
    //                 soundToReplace = distinctSounds[Math.floor(Math.random() * distinctSounds.length)];
    //             }
    //             var newSound = soundToReplace;
    //             while (newSound == soundToReplace || distinctSounds.includes(newSound)) {
    //                 newSound = layer.soundOptions[Math.floor(Math.random() * layer.soundOptions.length)];
    //             }
    //             for (let i = 0; i < layer.pattern.length; i++) {
    //                 if (layer.pattern[i] == soundToReplace) {
    //                     layer.pattern[i] = newSound;
    //                 }
    //             }
    //             return layer
    //         }
    //     },
    //     {
    //         label: "Change all sounds",
    //         shortLabel: "ChangeAllSounds",
    //         args: {},
    //         apply: (layer: DrumLayer) => {
    //             const currentSounds = layer.chosenSounds;
    //             var newSounds = [] as string[];

    //             for (let i = 0; i < currentSounds.length; i++) {
    //                 var newSound = currentSounds[i];
    //                 // don't change -
    //                 if (newSound !== "-") {
    //                     // make sure newSound is unique and different
    //                     while (newSound == "-" || newSounds.includes(newSound) || currentSounds.includes(newSound)) {
    //                         const newSoundIndex = Math.floor(Math.random() * layer.soundOptions.length);
    //                         newSound = layer.soundOptions[newSoundIndex];
    //                     }
    //                 }
    //                 newSounds.push(newSound);
    //             }
    //             for (let i = 0; i < layer.pattern.length; i++) {
    //                 const soundIndex = currentSounds.indexOf(layer.pattern[i]);
    //                 if (soundIndex != -1) {
    //                     layer.pattern[i] = newSounds[soundIndex];
    //                 }
    //             }
    //             layer.chosenSounds = newSounds;
    //             return layer;
    //         }
    //     },
    //     {
    //         label: "Change soundbank",
    //         shortLabel: "ChangeBank",
    //         args: {},
    //         apply: (layer: DrumLayer) => {
    //             layer.randomBank();
    //             return layer;
    //         }
    //     },
    // ],
    // "Individual notes": [
    //     {
    //         label: "Change one note",
    //         shortLabel: "ChangeToChosen",
    //         args: {},
    //         apply: (layer: DrumLayer) => {
    //             const distinctSounds = Array.from(new Set(layer.pattern));
    //             var indexToChange = Math.floor(Math.random() * layer.pattern.length);
    //             var newSound = layer.pattern[indexToChange];
    //             while (newSound == layer.pattern[indexToChange]) {
    //                 newSound = layer.chosenSounds[Math.floor(Math.random() * layer.chosenSounds.length)];
    //             }
    //             layer.pattern[indexToChange] = newSound;
    //             return layer;
    //         }
    //     },
    //     {
    //         label: "Mute one note",
    //         shortLabel: "MuteSound",
    //         args: {},
    //         apply: (layer: DrumLayer) => {
    //             const distinctSounds = new Set(layer.pattern);
    //             distinctSounds.delete("-");
    //             if (Array.from(distinctSounds).length <= 1) {
    //                 console.log("Pattern has one or no unmuted sounds, cannot mute");
    //                 return layer;
    //             }

    //             var indexToMute;
    //             do {
    //                 indexToMute = Math.floor(Math.random() * layer.pattern.length);
    //             } while (layer.pattern[indexToMute] == "-")

    //             layer.pattern[indexToMute] = "-";
    //             return layer;
    //         }
    //     },
    //     {
    //         label: "Unmute one note",
    //         shortLabel: "UnmuteSound",
    //         args: {},
    //         apply: (layer: DrumLayer) => {
    //             const distinctSounds = new Set(layer.pattern);
    //             if (!distinctSounds.has("-")) {
    //                 console.log("Pattern has no muted sounds, cannot unmute");
    //                 return layer;
    //             }

    //             var indexToUnmute;
    //             do {
    //                 indexToUnmute = Math.floor(Math.random() * layer.pattern.length);
    //             } while (layer.pattern[indexToUnmute] != "-")

    //             var chosenSound = "-";
    //             while (chosenSound == "-") {
    //                 chosenSound = layer.chosenSounds[Math.floor(Math.random() * layer.chosenSounds.length)];
    //             }

    //             layer.pattern[indexToUnmute] = chosenSound;
    //             return layer;
    //         }
    //     },
    //     {
    //         label: "Swap two notes",
    //         shortLabel: "Swap",
    //         args: {},
    //         apply: (layer: DrumLayer) => {
    //             const index1 = Math.floor(Math.random() * layer.pattern.length);
    //             var index2 = index1;
    //             while (index2 == index1 || layer.pattern[index2] == layer.pattern[index1]) {
    //                 index2 = Math.floor(Math.random() * layer.pattern.length);
    //             }
    //             const spare = layer.pattern[index1];
    //             layer.pattern[index1] = layer.pattern[index2];
    //             layer.pattern[index2] = spare;
    //             return layer;
    //         }
    //     },
    // ],
    // "Individual insert/remove": [
    //     {
    //         label: "Duplicate random note",
    //         shortLabel: "DuplicateRandom",
    //         args: {},
    //         apply: (layer: DrumLayer) => {
    //             const randomIndex = Math.floor(Math.random() * layer.pattern.length);
    //             layer.pattern.splice(randomIndex, 0, layer.pattern[randomIndex]);
    //             return layer;
    //         }
    //     },
    //     {
    //         label: "Insert random note",
    //         shortLabel: "InsertRandom",
    //         args: {},
    //         apply: (layer: DrumLayer) => {
    //             const distinctSounds = Array.from(new Set(layer.pattern));
    //             const randomIndex = Math.floor(Math.random() * (layer.pattern.length + 1));
    //             const randomSound = distinctSounds[Math.floor(Math.random() * distinctSounds.length)];
    //             layer.pattern.splice(randomIndex, 0, randomSound);
    //             return layer;
    //         }
    //     },
    //     {
    //         label: "Remove last note",
    //         shortLabel: "RemoveLast",
    //         args: {},
    //         apply: (layer: DrumLayer) => {
    //             layer.pattern.pop();
    //             return layer;
    //         }
    //     },
    //     {
    //         label: "Remove random note",
    //         shortLabel: "RemoveRandom",
    //         args: {},
    //         apply: (layer: DrumLayer) => {
    //             const randomIndex = Math.floor(Math.random() * layer.pattern.length);
    //             layer.pattern.splice(randomIndex, 1);
    //             return layer;
    //         }
    //     },
    // ],
    // "Order": [
    //     {
    //         label: "Shuffle pattern",
    //         shortLabel: "Shuffle",
    //         args: {},
    //         apply: (layer: DrumLayer) => {
    //             var newPattern = [];
    //             const newIndices = Array.from(layer.pattern.keys()).sort(() => Math.random() - 0.5);
    //             for (let i = 0; i < layer.pattern.length; i++) {
    //                 newPattern[i] = layer.pattern[newIndices[i]];
    //             }
    //             layer.pattern = newPattern;
    //             return layer;
    //         },
    //     },
    //     {
    //         label: "Reverse pattern",
    //         shortLabel: "Reverse",
    //         args: {},
    //         apply: (layer: DrumLayer) => {
    //             layer.pattern = layer.pattern.reverse();
    //             return layer;
    //         }
    //     },
    //     {
    //         label: "Partially reverse pattern",
    //         shortLabel: "ReversePartial",
    //         args: {},
    //         apply: (layer: DrumLayer) => {
    //             const startIndex = Math.floor(Math.random() * layer.pattern.length);
    //             const endIndex = startIndex + Math.floor(Math.random() * (layer.pattern.length - startIndex));
    //             const segment = layer.pattern.slice(startIndex, endIndex + 1).reverse();
    //             for (let i = startIndex; i <= endIndex; i++) {
    //                 layer.pattern[i] = segment[i - startIndex];
    //             }
    //             return layer;
    //         }
    //     },
    // ],
    // "Cut copy": [
    //     {
    //         label: "Shift left",
    //         shortLabel: "ShiftLeft",
    //         args: {},
    //         apply: (layer: DrumLayer) => {
    //             const spare = layer.pattern[0];
    //             for (let i = 0; i < layer.pattern.length - 1; i++) {
    //                 layer.pattern[i] = layer.pattern[i + 1];
    //             }
    //             layer.pattern[layer.pattern.length - 1] = spare;
    //             return layer;
    //         }
    //     },
    //     {
    //         label: "Shift right",
    //         shortLabel: "ShiftRight",
    //         args: {},
    //         apply: (layer: DrumLayer) => {
    //             const spare = layer.pattern[layer.pattern.length - 1];
    //             for (let i = layer.pattern.length - 1; i > 0; i--) {
    //                 layer.pattern[i] = layer.pattern[i - 1];
    //             }
    //             layer.pattern[0] = spare;
    //             return layer;
    //         }
    //     },
    //     {
    //         label: "Duplicate pattern",
    //         shortLabel: "Duplicate",
    //         args: {},
    //         apply: (layer: DrumLayer) => {
    //             layer.pattern = layer.pattern.concat(layer.pattern);
    //             return layer;
    //         }
    //     },
    // ]
};
