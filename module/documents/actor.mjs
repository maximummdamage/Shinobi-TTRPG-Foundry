/**
 * Extends base Actor 
 * @extends {Actor}
 */
export class SRPGActor extends Actor {

    /**
     * Prepare Data for the actor. calling super does the following: data reset,
     * prepareBaseData(), prepareEmbeddedDocuments(), prepareDerivedData()
     * @override
     */
    prepareData() {
        super.prepareData();
    }

    /** @override */
    prepareBaseData() {
        // Data modifications before processing derived data
    }

    /**
     * handle most calculated/derived data in this step,
     * should not exist in template.json (maxhp, maxchk),
     * and is availible both in and out of character sheet
     * @override
     */
    prepareDerivedData() {
        console.log("preparing derived data");
        if (this.type == "shinobi") {
            this._prepareShinobiData();
        } else if (this.type == "mook") {
            this._prepareNpcData();
        }
    }

    _prepareShinobiData() {
        console.log("SHINOBI");
    }

    _prepareNpcData() {
        console.log("MOOK");
    }
}