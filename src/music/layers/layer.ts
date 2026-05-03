export abstract class Layer {
    name: string;

    cycleDivison: number[];

    constructor(name: string, cycleDivison: number[]) {
        this.name = name;

        this.cycleDivison = cycleDivison;
    }

    abstract copy(): Layer;

    abstract generate(): void;

    abstract toCode(): string;

    undo(): Layer {
        // TODO: move undo functionality here
        return this;
    }
}
