// Extends base actor document
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

    }

    /**
     * handle most calculated/derived data in this step,
     * should not exist in template.json (maxhp, maxchk),
     * and is availible both in and out of character sheet
     * @override
     */
    prepareDerivedData() {
        if (this.type == "shinobi") {
            this._prepareShinobiData(this.data);
        } else if (this.type == "mook") {
            this._prepareNpcData(this.data);
        }
    }

    _prepareShinobiData(data) {
        console.log("SHINOBI");
    }

    _prepareNpcData(data) {
        console.log("MOOK");
    }
}