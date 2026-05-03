import { Pattern } from "../../pattern/pattern";
import { NoOpWrapper, VaryAcrossCycles, VaryInCycle, Wrapper } from "../../pattern/wrapper";

export abstract class Func {
    label: string;
    name: string;

    pattern: Pattern = new Pattern([]);

    possibleCycleDivisons = [[3, 3], [4, 4], [4, 4], [2, 3], [2, 4], [3, 2], [4, 2]];
    cycleDivision: number[] = this.possibleCycleDivisons[Math.floor(Math.random() * this.possibleCycleDivisons.length)];

    abstract createPattern(): void;

    toCode(): string {
        const patternCode = this.pattern.toString();
        if (patternCode === "") {
            return `${this.name}('')`;
        } else {
            return `${this.name}("${patternCode}")`;
        }
    }
}

abstract class OptionsFunc extends Func {
    allOptions: string[];
    activeOptions: string[];

    chosenOptionsCount: number;
    minimalDistinctOptions: number;

    allowRepetition: boolean;

    innerWrapper: Wrapper;
    outerWrapper: Wrapper;


    constructor() {
        super();
        this.activeOptions = this.allOptions;
    }

    createPattern(): void {
        if (this.chosenOptionsCount == 1) {
            const chosen = this.activeOptions[Math.floor(Math.random() * this.activeOptions.length)];
            this.pattern = new Pattern([chosen]);
        }
        else {
            const optionsUsed = new Set<string>();

            const cycles = [];
            for (const cycle of this.cycleDivision) {
                const cycleChosen = [];
                for (let i = 0; i < cycle; i++) {
                    // TODO: sometimes make item last longer
                    let chosen = this.activeOptions[Math.floor(Math.random() * this.activeOptions.length)];
                    if (!this.allowRepetition) {
                        let optionsTried = 0;
                        while (optionsUsed.has(chosen) && optionsTried < 100) {
                            chosen = this.activeOptions[Math.floor(Math.random() * this.activeOptions.length)];
                            optionsTried++;
                        }
                    }
                    optionsUsed.add(chosen);
                    cycleChosen.push(chosen);
                }
                cycles.push(new Pattern(cycleChosen, this.innerWrapper));

            }
            this.pattern = new Pattern(cycles, this.outerWrapper);
        }
    }
}

export abstract class LimitedOptionsFunc extends OptionsFunc {
    constructor(allOptions: string[], chosenOptionsCount: number, minimalDistinctOptions: number, allowRepetition: boolean, innerWrapper: Wrapper, outerWrapper: Wrapper) {
        super();

        this.allOptions = allOptions;

        this.chosenOptionsCount = chosenOptionsCount;
        this.minimalDistinctOptions = minimalDistinctOptions;

        this.allowRepetition = allowRepetition;

        this.innerWrapper = innerWrapper;
        this.outerWrapper = outerWrapper;

        this.randomActiveOptions();
    }

    randomActiveOptions() {
        this.activeOptions = [];
        for (let i = 0; i < this.chosenOptionsCount; i++) {
            const option = this.allOptions[Math.floor(Math.random() * this.allOptions.length)];
            if (this.allowRepetition || !this.activeOptions.includes(option)) {
                this.activeOptions.push(option);
            }
        }
        console.log("chose", this.chosenOptionsCount, this.activeOptions);
    }

    // TODO
    mutations = {

    }
}

abstract class RangeFunc extends OptionsFunc {
    lower: number
    upper: number
    step: number;

    constructor() {
        super();
        this.setRange(this.lower, this.upper, this.step);
    }

    setRange(lower: number, upper: number, step: number) {
        this.lower = lower;
        this.upper = upper;
        this.step = step;

        this.allOptions = []
        for (let i = this.lower; i <= this.upper; i += this.step) {
            this.allOptions.push(String(i));
        }
        this.activeOptions = this.allOptions;
    }
}
