import { Wrapper, NoOpWrapper } from "./wrapper";

type PatternItem = Pattern | string;

export class Pattern {
    items: PatternItem[];
    wrapper: Wrapper;

    constructor(items: PatternItem[], wrapper: Wrapper = new NoOpWrapper()) {
        this.items = items;
        this.wrapper = wrapper;
    }

    toString(): string {
        if (this.items.length >= 1) {
            return this.wrapper.before + this.items.map(item => item.toString()).join(" ") + this.wrapper.after;
        } else {
            return "";
        }
    }
}
