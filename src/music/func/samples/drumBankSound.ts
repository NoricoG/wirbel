import { LimitedOptionsFunc } from "../base/func";
import { VaryAcrossCycles, VaryInCycle } from "../../pattern/wrapper";
import { drumDefaultOptionsGrouped, drumOptionsGrouped } from "./sampleLists";

export class DrumBankSound extends LimitedOptionsFunc {
    name = "s"

    constructor() {
        const allOptions = [];
        for (const [b, c] of drumDefaultOptionsGrouped) {
            for (let i = 0; i < c; i++) {
                allOptions.push(`${b}:${i}`);
            }
        }
        for (const [a, b, c] of drumOptionsGrouped) {
            for (let i = 0; i < c; i++) {
                allOptions.push(`${a}_${b}:${i}`);
            }
        }

        // TODO: min and max defined by user in UI
        const chosenOptionsCount = 2 + Math.floor(Math.random() * 4); // 2-5
        const minimalDistinctOptions = 2;
        const allowRepetition = true;

        const innerWrapper = new VaryInCycle();
        const outerWrapper = new VaryAcrossCycles();

        super(allOptions, chosenOptionsCount, minimalDistinctOptions, allowRepetition, innerWrapper, outerWrapper);
    }
}
