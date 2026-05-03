import { Func } from "../func/base/func";

export abstract class Layer {
    name: string;

    cycleDivision: number[];

    funcs: Func[];

    constructor(name: string, cycleDivision: number[], funcs: Func[]) {
        this.name = name;

        this.cycleDivision = cycleDivision;

        this.funcs = funcs;
    }

    abstract generate(): void;

    abstract toCode(): string;

    undo(): Layer {
        // TODO: move undo functionality here
        return this;
    }
}
