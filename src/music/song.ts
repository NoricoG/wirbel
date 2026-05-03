import { Layer } from "./layers/layer";
import { DrumLayer } from "./layers/drumLayer";

export class Song {
    version: number = 0;

    bpm = 60;
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
        const newSong = new Song();
        newSong.version = incrementVersion ? this.version + 1 : this.version;
        newSong.bpm = this.bpm;
        newSong.defaultCycleDivision = this.defaultCycleDivision;
        newSong.layers = this.layers.map(layer => layer.copy());
        return newSong;
    }

    undo(): Song {
        // TODO: move undo functionality hewre
        return this;
    }

}
