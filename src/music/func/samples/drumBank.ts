import { Pattern } from "../../pattern/pattern";
import { NoOpWrapper, VaryAcrossCycles, VaryAcrossLoops, VaryInCycle } from "../../pattern/wrapper";
import { LimitedOptionsFunc } from "../base/func";

export class DrumBank extends LimitedOptionsFunc {
    name = "bank"

    constructor() {
        // banks that have at most 4 missing drum sounds
        // excluding default bank because that one can't be combined
        // deduplicated by longest name
        const allOptions = [
            "AkaiLinn",
            "AkaiMPC60", // 1988
            "AkaiXR10",
            "AlesisSR16", // 1990
            "BossDR550", // 1989
            "CircuitsDrumTracks", // 1984
            "CompuRhythm1000", // 1986, CR-1000
            "CompuRhythm8000", // 1981, CR-8000
            "EmuDrumulator", // 1983
            "EmuSP12",
            "KorgM1", // 1988
            "Linn9000", // 1984
            "Linndrum", // 1982
            "LinnLM1", // 1980
            "LinnLM2",
            "OberheimDMX", // 1980
            "RolandD110",
            "RolandD70",
            "RolandJD990",
            "RolandMC303",
            "RolandMT32", // 1987
            "RolandR8", // 1989
            "RolandS50", // 1986
            "RolandTR505", // 1986
            "RolandTR626",
            "RolandTR707", // 1985
            "RolandTR808", // 1980
            "SakataDPM48", // 1984
            "YamahaRM50", // 1992
            "YamahaRY30", // 1991
            "YamahaTG33", // 1990
        ];

        // TODO: min and max defined by user in UI
        const chosenOptionsCount = 1 + Math.floor(Math.random() * 4); // 1-4
        const minimalDistinctOptions = 2;
        const allowRepetition = false;

        // placeholders
        const innerWrapper = new NoOpWrapper();
        const outerWrapper = new NoOpWrapper();

        super(
            allOptions,
            chosenOptionsCount,
            minimalDistinctOptions,
            allowRepetition,
            innerWrapper,
            outerWrapper
        );

        // TODO: make sure this is updated when the loops change
        const varyAcrossCycles = Math.random() < 0.2;
        const varyAcrossLoops = !varyAcrossCycles && Math.random() < 0.5;

        if (varyAcrossCycles) {
            this.cycleDivision = new Array(this.cycleDivision.length).fill(1);
            this.innerWrapper = new VaryInCycle();
            this.outerWrapper = new VaryAcrossCycles();
        } else if (varyAcrossLoops) {
            this.cycleDivision = new Array(this.cycleDivision.length).fill(1);
            this.innerWrapper = new VaryAcrossLoops(this.cycleDivision.length * Math.ceil(Math.random() * 2));
            this.outerWrapper = new VaryAcrossCycles();
        } else {
            this.cycleDivision = new Array(1).fill(1);
            this.innerWrapper = new NoOpWrapper();
            this.outerWrapper = new NoOpWrapper();
        }
    }

    createPattern() {
        const chooseDefaultBank = Math.random() < 0.1;

        // doesn't support combining with other banks
        if (chooseDefaultBank) {
            this.pattern = new Pattern([""]);
        } else {
            super.createPattern();
        }
    }
}
