import { Song } from "./music/song";
import { DrumLayer, mutations } from "./music/layers/drumLayer";

var song = new Song();
var previousSongs = [] as Song[];
const maxPreviousSongs = 10;

var repls = [] as any[];
var playingRepl = -1;

type ReplElement = HTMLElement & { editor?: any };

type Mutation = {
    label: string,
    shortLabel: string,
    args: {},
    apply: (song: Song) => Song
}

function showMutationButtons() {
    document.getElementById('mutations').style.display = 'block';

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
    const getReplElement = (id: string): ReplElement => {
        return document.getElementById(id) as ReplElement;
    };

    repls = [
        getReplElement('currentSong'),
        getReplElement('songMinusOne'),
        getReplElement('songMinusTwo'),
        getReplElement('songMinusThree'),
    ];

    document.getElementById('generate-button')?.addEventListener('click', () => {
        patternGenerate();
    });

    document.querySelectorAll('[data-action="replStart"]').forEach((element) => {
        element.addEventListener('click', () => {
            const index = parseInt((element as HTMLElement).dataset.index || '-1');
            replStart(index);
        });
    });

    document.querySelectorAll('[data-action="replStop"]').forEach((element) => {
        element.addEventListener('click', () => {
            const index = parseInt((element as HTMLElement).dataset.index || '-1');
            replStop(index);
        });
    });

    document.querySelectorAll('[data-action="restorePreviousSong"]').forEach((element) => {
        element.addEventListener('click', () => {
            const index = parseInt((element as HTMLElement).dataset.index || '1');
            restorePreviousSong(index);
        });
    });
});

async function replStopAll() {
    for (let i = 0; i <= 3; i++) {
        await replStop(i);
    }
}

async function replStop(index: number) {
    if (index == -1) {
        return;
    }
    repls[index].editor.stop();
}

function replLoad(index: number, code: string) {
    repls[index].editor.setCode(code);
}

function replStart(index: number) {
    if (playingRepl != index) {
        replStop(playingRepl);
        playingRepl = index;
    }
    repls[index].editor.evaluate();
}

function renderPattern(index: number) {
    const fullCode = song.toCode();
    replLoad(index, fullCode);
    replStart(index);

    const chosenSoundsElement = document.getElementById('chosenSounds');
    chosenSoundsElement.innerText = "Chosen sounds: " + (song.layers[0] as DrumLayer).chosenSounds.join(", ");

    const versionElement = document.getElementById('currentVersion');
    versionElement.innerText = "Current pattern (#" + song.version + ")";
}

function patternGenerate() {
    if (song.version == 0) {
        showMutationButtons();
    }

    const newVersion = song.version + 1;
    song = new Song();
    song.version = newVersion;

    makeSpaceForNextSong();

    song.layers[0].generate();

    renderPattern(0);
}

function applyMutation(category: string, mutationId: number) {
    makeSpaceForNextSong()

    const newVersion = song.version + 1;

    const mutation = mutations[category][mutationId];
    // TODO: generalise mutations
    song.layers[0] = mutation.apply(song.layers[0]);
    song.version = newVersion;

    renderPattern(0);
}

function restorePreviousSong(iterations: number) {
    song = previousSongs[0].copy(false);
    for (let i = 0; i < previousSongs.length - 1; i++) {
        previousSongs[i] = previousSongs[i + 1];
    }
    previousSongs.pop();

    if (iterations > 1) {
        return restorePreviousSong(iterations - 1);
    }

    showMutationHistory();

    renderPattern(0);

}

function makeSpaceForNextSong() {
    if (previousSongs.length < maxPreviousSongs) {
        previousSongs.push(new Song());
    }

    for (let i = previousSongs.length - 1; i > 0; i--) {
        previousSongs[i] = previousSongs[i - 1];
    }
    previousSongs[0] = song.copy(false);

    showMutationHistory();
}

function showMutationHistory() {
    if (previousSongs.length > 0 && previousSongs[0].version > 0) {
        document.getElementById("patternMinusOne").style.display = "block";
        (repls[1] as any).editor.setCode(previousSongs[0].toCode());
        document.getElementById('versionMinusOne').innerText = "Previous pattern (#" + previousSongs[0].version + ")";
    } else {
        document.getElementById("patternMinusOne").style.display = "none";
        (repls[1] as any).editor.setCode("// No previous song");
    }

    if (previousSongs.length > 1 && previousSongs[1].version > 0) {
        document.getElementById("patternMinusTwo").style.display = "block";
        (repls[2] as any).editor.setCode(previousSongs[1].toCode());
        document.getElementById('versionMinusTwo').innerText = "Previous pattern (#" + previousSongs[1].version + ")";
    } else {
        document.getElementById("patternMinusTwo").style.display = "none";
        (repls[2] as any).editor.setCode("// No previous song");

    }

    if (previousSongs.length > 2 && previousSongs[2].version > 0) {
        document.getElementById("patternMinusThree").style.display = "block";
        (repls[3] as any).editor.setCode(previousSongs[2].toCode());
        document.getElementById('versionMinusThree').innerText = "Previous pattern (#" + previousSongs[2].version + ")";
    } else {
        document.getElementById("patternMinusThree").style.display = "none";
        (repls[3] as any).editor.setCode("// No previous song");
    }
}
