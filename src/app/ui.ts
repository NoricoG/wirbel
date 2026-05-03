import { Song } from "../music/song";
import { DrumLayer, mutations } from "../music/layers/drumLayer";

type ReplElement = HTMLElement & { editor?: any };

let repls: ReplElement[] = [];
let playingRepl = -1;

const HISTORY_COUNT = 3;

function getReplElement(id: string): ReplElement {
    return document.getElementById(id) as ReplElement;
}

async function replStop(index: number) {
    if (index === -1) return;
    repls[index].editor.stop();
}

function replLoad(index: number, code: string) {
    repls[index].editor.setCode(code);
}

function replStart(index: number) {
    if (playingRepl !== index) {
        replStop(playingRepl);
        playingRepl = index;
    }
    repls[index].editor.evaluate();
}

export async function replStopAll() {
    for (let i = 0; i <= HISTORY_COUNT; i++) {
        await replStop(i);
    }
}

function createMutationHistoryContainers(
    onRestore: (index: number) => void
) {
    const container = document.getElementById('mutationHistory')!;
    container.innerHTML = '';

    for (let i = 0; i < HISTORY_COUNT; i++) {
        const replIndex = i + 1;

        const div = document.createElement('div');
        div.id = `patternMinus${replIndex}`;
        div.style.display = 'none';

        const h3 = document.createElement('h3');
        h3.id = `versionMinus${replIndex}`;
        h3.textContent = 'Previous pattern';

        const playBtn = document.createElement('button');
        playBtn.textContent = '▶️ Play';
        playBtn.addEventListener('click', () => replStart(replIndex));

        const stopBtn = document.createElement('button');
        stopBtn.textContent = '⏸️ Stop';
        stopBtn.addEventListener('click', () => replStop(replIndex));

        const restoreBtn = document.createElement('button');
        restoreBtn.textContent = 'Restore this';
        restoreBtn.addEventListener('click', () => onRestore(replIndex));

        const editor = document.createElement('strudel-editor');
        editor.id = `songMinus${replIndex}`;
        editor.innerHTML = '<!-- // Previous pattern will appear here -->';

        div.appendChild(h3);
        div.appendChild(playBtn);
        div.appendChild(stopBtn);
        div.appendChild(restoreBtn);
        div.appendChild(editor);

        container.appendChild(div);
    }
}

export function initUI(callbacks: {
    onGenerate: () => void;
    onRestore: (index: number) => void;
}) {
    repls = [getReplElement('currentSong')];

    document.getElementById('generate-button')?.addEventListener('click', callbacks.onGenerate);

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

    createMutationHistoryContainers(callbacks.onRestore);

    for (let i = 1; i <= HISTORY_COUNT; i++) {
        repls.push(getReplElement(`songMinus${i}`));
    }
}

export function showMutationButtons(onMutation: (category: string, i: number) => void) {
    // document.getElementById('mutations')!.style.display = 'block';

    // const container = document.getElementById('mutationButtons')!;
    // container.innerHTML = '';
    // for (const [category, categoryMutations] of Object.entries(mutations)) {
    //     const categoryHeader = document.createElement('h3');
    //     categoryHeader.textContent = category;
    //     container.appendChild(categoryHeader);
    //     categoryMutations.forEach((mutation, i) => {
    //         const btn = document.createElement('button');
    //         btn.textContent = mutation.label;
    //         btn.onclick = () => onMutation(category, i);
    //         container.appendChild(btn);
    //     });
    // }
}

export function renderPattern(song: Song) {
    const fullCode = song.toCode();
    replLoad(0, fullCode);
    replStart(0);

    document.getElementById('currentVersion')!.innerText =
        "Current pattern (#" + song.version + ")";
}

export function showMutationHistory(previousSongs: Song[]) {
    for (let i = 0; i < HISTORY_COUNT; i++) {
        const replIndex = i + 1;
        if (previousSongs.length > i && previousSongs[i].version > 0) {
            document.getElementById(`patternMinus${replIndex}`)!.style.display = 'block';
            repls[replIndex].editor.setCode(previousSongs[i].toCode());
            document.getElementById(`versionMinus${replIndex}`)!.innerText =
                "Previous pattern (#" + previousSongs[i].version + ")";
        } else {
            document.getElementById(`patternMinus${replIndex}`)!.style.display = 'none';
            repls[replIndex].editor.setCode("// No previous song");
        }
    }
}
