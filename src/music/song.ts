import { Layer } from "./layers/layer";
import { DrumLayer } from "./layers/drumLayer";
import { deepCopy } from "./helpers";

export class Song {
    version: number = 0;

    bpm = 60;
    // TODO: connect this with actual cycle division
    defaultCycleDivision = 4;

    layers: Layer[];

    constructor() {
        this.layers = [
            new DrumLayer([this.defaultCycleDivision])
        ]
    }

    toCode(): string {
        let song = "";
        song += `let bpm = ${this.bpm};\n`;
        song += `let defaultCycleDivision = ${this.defaultCycleDivision};\n`;
        song += `setcpm(bpm * defaultCycleDivision / 4);\n`;

        for (const layer of this.layers) {
            song += `\n\n${layer.name}: ${layer.toCode()}.gain(slider(1.0))._spectrum()\n`;
        }

        return song;
    }

    copy(incrementVersion: boolean): Song {
        const newSong = deepCopy(this);
        if (incrementVersion) newSong.version++;
        return newSong;
    }

    undo(): Song {
        // TODO: move undo functionality here
        return this;
    }

}
