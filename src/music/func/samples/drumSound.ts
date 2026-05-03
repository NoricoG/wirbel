import { VaryAcrossCycles, VaryInCycle } from "../../pattern/wrapper";
import { LimitedOptionsFunc } from "../base/func";

export class DrumSound extends LimitedOptionsFunc {
    name = "s"

    constructor() {
        // ignoring "misc" becasue many banks don't hav it
        const allOptions = ["-", "bd", "cb", "cp", "cr", "hh", "ht", "lt", "mt", "oh", "perc", "rd", "rim", "sd", "sh", "tb"];

        // TODO: min and max defined by user in UI
        const chosenOptionsCount = 2 + Math.floor(Math.random() * 3); // 2-4

        const minimalDistinctOptions = 2;
        const allowRepetition = true;

        const innerWrapper = new VaryInCycle();
        const outerWrapper = new VaryAcrossCycles();

        super(
            allOptions,
            chosenOptionsCount,
            minimalDistinctOptions,
            allowRepetition,
            innerWrapper,
            outerWrapper
        );
    }
} 
