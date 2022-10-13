/**
 * Extend the base Actor document for SRPG
 * @extends {Actor}
 */
export class SRPGActor extends Actor {
    /** @inheritdoc */
    prepareDerivedData() {
        super.prepareDerivedData();
        
        // call function based on actor type
        if (this.type == "shinobi") { this._prepareShinobiData(); }
        if (this.type == "mook") { this._prepareMookData(); }
    }

    /* helper functions for prepareDerivedData() */

    /**
     * prepare data for Shinobi
     */
    _prepareShinobiData() {
        this.system = this._prepareSkillBase(this.system);
    }

    /**
     * prepare data for Mook
     */
    _prepareMookData() {
        // do nothing
    }

    /**
     * determines and sets base for skills
     */
    _prepareSkillBase(system) {
        // skills with one stat
	    for (let skill in system.skills) {
	    	let stat = system.skills[skill].stat;
	    	system.skills[skill].base = system.skills[skill].value + system.statistics[stat].value;
	    }
	    // skills with 2 stats
	    for (let skill2 in system.s2skills) {
	    	let stat1 = system.s2skills[skill2].stat1;
	    	let stat2 = system.s2skills[skill2].stat2;
	    	system.s2skills[skill2].base = system.s2skills[skill2].value + Math.max(system.statistics[stat1].value, system.statistics[stat2].value);
	    }
	    return system;
    }
}