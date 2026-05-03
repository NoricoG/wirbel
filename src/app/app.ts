import { Song } from "../music/song";
import { mutations } from "../music/layers/drumLayer";
import { initUI, showMutationButtons, showMutationHistory, renderPattern } from "./ui";

var song = new Song();
var previousSongs = [] as Song[];
const maxPreviousSongs = 10;

document.addEventListener('DOMContentLoaded', function () {
    initUI({
        onGenerate: patternGenerate,
        onRestore: restorePreviousSong,
    });
});

function patternGenerate() {
    const firstSong = song.version === 0;

    if (firstSong) {
        // showMutationButtons(applyMutation);
    } else {
        makeSpaceForNextSong();
    }

    const newVersion = song.version + 1;
    song = new Song();
    song.version = newVersion;

    song.layers[0].generate();

    renderPattern(song);
}

function applyMutation(category: string, mutationId: number) {
    makeSpaceForNextSong();

    const newVersion = song.version + 1;

    const mutation = mutations[category][mutationId];
    // TODO: generalise mutations
    song.layers[0] = mutation.apply(song.layers[0]);
    song.version = newVersion;

    renderPattern(song);
}

function restorePreviousSong(iterations: number) {
    song = previousSongs.shift()!.copy(false);

    if (iterations > 1) {
        return restorePreviousSong(iterations - 1);
    }

    showMutationHistory(previousSongs);

    renderPattern(song);
}

function makeSpaceForNextSong() {
    previousSongs.unshift(song.copy(false));
    if (previousSongs.length > maxPreviousSongs) {
        previousSongs.pop();
    }

    showMutationHistory(previousSongs);
}
