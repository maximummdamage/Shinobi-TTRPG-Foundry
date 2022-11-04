/**
 * Extend the ActorSheet class for SRPG
 * @extends {ActorSheet}
 */
export class SRPGActorSheet extends ActorSheet {

    /** @inheritdoc */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["srpg", "sheet", "actor"],
            template: "systems/srpg/templates/actor/actor-shinobi-sheet.hbs",
            width: 600,
            height: 600,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "skills" }],
            //scrollY: [".biography", ".items", ".attributes"],
            //dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}]
        });
    }

    /** @override */
    get template() {
        return `systems/srpg/templates/actor/actor-${this.actor.type}-sheet.hbs`;
    }

    /**
     * calculate derived data that isn't used anywhere but on character sheet
     * don't calculate data for rolls here
     * @inheritdoc
     */
    async getData(options) {
        const context = await super.getData(options);
        // shorthand here if necessary
        context.systemData = context.data.system;
        //context.biographyHTML = await TextEditor.enrichHTML(context.systemData.biography, {
        //    secrets: this.document.isOwner,
        //    async: true
        //});
		
        // helper functions
		context.systemData = this._availableLevels(context.systemData);
		context.systemData = this._prepareDataLabels(context.systemData);
		context.systemData = this._prepareDataBools(context.systemData);
        context.items = this._sortItems(context.items);
        //console.log(context);
        return context;
    }

    /* helper functions for getData() */

    /**
     * calculates total skill levels available
     */
    _availableLevels(systemData) {
        // calculate total levels in skills
        var totalSkills = 0;
        for (let skill in systemData.skills) {
            totalSkills += systemData.skills[skill].value;
        }

        // set availableLevels
        systemData.availableLevels = systemData.skilllevel - totalSkills;
        return systemData;
    }

	/**
	 * prepare labels for data
	 */
	_prepareDataLabels(systemData) {
		// set necessary labels
		systemData.bio.appearance.label = "SRPG.physicalappearance";
		systemData.bio.injuries.label = "SRPG.injuriesscars";
		systemData.bio.motivation.label = "SRPG.beliefmotivation";
		systemData.bio.personality.label = "SRPG.personalitytraits";
		systemData.bio.relationships.label = "SRPG.relationships";
		systemData.bio.important.label = "SRPG.importantthings";

        systemData.trainings.shuriken.label = "SRPG.shuriken";
        systemData.trainings.sword.label = "SRPG.sword";
        systemData.trainings.staff.label = "SRPG.staff";
        systemData.trainings.bow.label = "SRPG.bow";
        systemData.trainings.kusarigama.label = "SRPG.kusarigama";
        systemData.trainings.fire.label = "SRPG.fire";
        systemData.trainings.wind.label = "SRPG.wind";
        systemData.trainings.lightning.label = "SRPG.lightning";
        systemData.trainings.earth.label = "SRPG.earth";
        systemData.trainings.water.label = "SRPG.water";

		return systemData;
	}

	_prepareDataBools(systemData) {
		// set necessary bools
		systemData.s2skills.initiative.isInitiative = true;

		return systemData;
	}

    _sortItems(items) {
        // sort items into groups based on their type
        let taijutsu = new Array();
        let bukijutsu = new Array();
        let ninjutsu = new Array();
        let genjutsu = new Array();

        let outfits = new Array();
        let weapons = new Array();
        let equipment = new Array();
        let misc = new Array();

        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            
            if (item.type == "technique") {
                switch(item.system.type) {
                    case 0:
                        taijutsu.push(item);
                        break;
                    case 1:
                        bukijutsu.push(item);
                        break;
                    case 2:
                        ninjutsu.push(item);
                        break;
                    case 3:
                        genjutsu.push(item);
                        break;
                    default:
                        // if default necessary
                }
            }
            else {
                switch(item.type) {
                    case "outfit":
                        outfits.push(item);
                        break;
                    case "weapon":
                        weapons.push(item);
                        break;
                    case "equipment":
                        equipment.push(item);
                        break;
                    case "misc":
                        misc.push(item);
                        break;
                    default: 
                        // default if necessary
                }
            }
        }

        // TODO: im sure there's a simpler way to do this, but I can't figure it out right now
        // setup for new object to be passed back
        var newitems = new Object();
        var physical = new Object();
        var technique = new Object();
        // put arrays into physical obj
        physical.outfits = new Object();
        physical.weapons = new Object();
        physical.equipment = new Object();
        physical.misc = new Object();

        physical.outfits.list = outfits;
        physical.weapons.list = weapons;
        physical.equipment.list = equipment;
        physical.misc.list = misc;

        technique.taijutsu = new Object();
        technique.bukijutsu = new Object();
        technique.ninjutsu = new Object();
        technique.genjutsu = new Object();

        technique.taijutsu.list = taijutsu;
        technique.bukijutsu.list = bukijutsu;
        technique.ninjutsu.list = ninjutsu;
        technique.genjutsu.list = genjutsu;

        // add labels 
        physical.outfits.label = "SRPG.outfits";
        physical.weapons.label = "SRPG.weapons";
        physical.equipment.label = "SRPG.equipment";
        physical.misc.label = "SRPG.misc";

        technique.taijutsu.label = "SRPG.taijutsu";
        technique.bukijutsu.label = "SRPG.bukijutsu";
        technique.ninjutsu.label = "SRPG.ninjutsu";
        technique.genjutsu.label = "SRPG.genjutsu";

        // put physical and technique objects into newitems obj
        newitems.physical = physical;
        newitems.technique = technique;

        return newitems;
    }

	/* end helper functions */

    /** @inheritdoc */
    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if sheet is editable
        if (!this.isEditable) { return; }

        // Item Controls
        html.find(".item-control").click(this._onItemControl.bind(this));
        html.find(".items .rollable").on("click", this._onItemRoll.bind(this));

        // my listeners
        //html.find(".skills .rollable").on("click", this._onSkillRoll.bind(this));
		html.find(".rollable").on("click", this._onRoll.bind(this));

    }

    /**
     * Handle click events for Item control buttons within the Actor Sheet
     * @param event
     * @private
     */
    _onItemControl(event) {
        event.preventDefault();

        // Obtain event data
        const button = event.currentTarget;
        const li = button.closest(".item");
        const item = this.actor.items.get(li?.dataset.itemId);

        // Handle different actions
        switch (button.dataset.action) {
            case "create":
                const cls = getDocumentClass("Item");
                return cls.create({ name: game.i18n.localize("SRPG.ItemNew"), type: "item" }, { parent: this.actor });
            case "edit":
                return item.sheet.render(true);
            case "delete":
                return item.delete();
        }
    }

    /**
     * Listen for roll buttons on items.
     * @param {MouseEvent} event    The originating left click event
     */
    _onItemRoll(event) {
        let button = $(event.currentTarget);
        const li = button.parents(".item");
        const item = this.actor.items.get(li.data("itemId"));
        let r = new Roll(button.data('roll'), this.actor.getRollData());
        return r.toMessage({
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: `<h2>${item.name}</h2><h3>${button.text()}</h3>`
        });
    }

    /**
     * @param {MouseEvent} event 
     */
    _onSkillRoll(event) {
        event.preventDefault();
        let button = $(event.currentTarget);
		// if this is an initiative roll, add the unit to the combat and roll their initiative
		if (button.data('action') == "rollInit") {
			this.actor.rollInitiative({ createCombatants: true });
		} 
		// otherwise roll normally
		else {
        	let r = new Roll(button.data('roll'), this.actor.getRollData());
        	return r.toMessage({
        	    user: game.user.id,
        	    speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        	    flavor: `<h2 class="skillroll">${button.data('label')}</h2>`
        	})
		}
    }

	/**
	 * @param {MouseEvent} event
	 */
	async _onRoll(event) {
		event.preventDefault();
		let button = $(event.currentTarget);
		const content = await renderTemplate('systems/srpg/templates/chat/roll-config.hb', this.getData());
		console.log(content);
		let thing = await new Promise( resolve => 
			{new Dialog({
				title: 'Configure Roll',
				content,
				buttons: {},
				close: () => { resolve(null) }
			}).render(true);
		});
		console.log(thing);
	}
}