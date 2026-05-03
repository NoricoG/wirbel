export abstract class Wrapper {
    before: string;
    after: string;
}

export class NoOpWrapper extends Wrapper {
    before = "";
    after = "";
}

export class VaryInCycle extends Wrapper {
    before = "[";
    after = "]";
}

export class VaryAcrossCycles extends Wrapper {
    before = "<";
    after = ">";
}

export class VaryAcrossLoops extends Wrapper {
    constructor(loops: number) {
        super();
        this.before = "";
        this.after = `@${loops}`;
    }
}

// TODO: expand with
// repeats !x
// polyrythm {}
// probability ?
// choice |
// stacking ,
