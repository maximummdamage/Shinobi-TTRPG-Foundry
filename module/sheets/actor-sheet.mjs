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
		// sort items first for use in _availableLevels()
		context.items = this._sortItems(context.items);
		context.systemData = this._availableLevels(context);
		context.systemData = this._prepareDataLabels(context.systemData);
		context.systemData = this._prepareDataBools(context.systemData);
        //console.log(context);
        return context;
    }

    /* helper functions for getData() */

    /**
     * calculates total skill levels available
     */
    _availableLevels(context) {
		let systemData = context.systemData;
		let items = context.items;
        // calculate total levels in skills, trainings, and techniques
        var totalSkills = 0;
        for (let skill in systemData.skills) {
            totalSkills += systemData.skills[skill].value;
        }
		for (let s2skill in systemData.s2skills) {
			totalSkills += systemData.s2skills[s2skill].value;
		}
		for (let training in systemData.trainings) {
			totalSkills += systemData.trainings[training].value;
		}
		for (let category in items.technique) {
			for (let i in items.technique[category]) {
				if (items.technique[category][i].rank >= 0) {
					totalSkills += items.technique[category][i].rank;
				}
			}
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
		html.find(".skills .rollable").on("click", this._onSkillRoll.bind(this));

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
		const item = this.actor.items/*.get(button.dataset.id)*/;
		console.log(item);
        //const li = button.closest(".item");
        //const item = this.actor.items.get(li?.dataset.itemId);

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
	async _onSkillRoll(event) {
		event.preventDefault();
		
		// get button handle for gathering data
		let button = $(event.currentTarget);

		// data object setup
		const id = button.data('id');
		const category = button.data('category');
		const context = await this.getData();
		let statval = context.systemData[category][id].base
		let data = {
			name: game.i18n.localize(context.systemData[category][id].label),
			statname: context.systemData[category][id].stat, 
			statval: context.systemData[category][id].base - context.systemData[category][id].value,
			skillval: context.systemData[category][id].value
		};

		// content setup
		const content = game.i18n.format(
		`<form class="skillroll-config">
			<div class="roll-name label">${game.i18n.localize("SRPG.rollingfor")}</div>
			<div class="roll-name data">{name}</div>
			<div class="roll-stat label">{statname}</div>
			<div class="roll-stat data">{statval}</div>
			<div class="roll-ranks label">${game.i18n.localize("SRPG.ranks")}</div>
			<div class="roll-ranks data">{skillval}</div>
			<div class="roll-bonus label">${game.i18n.localize("SRPG.situationalbonus")}</div>
			<div class="roll-bonus data">
				<input name="roll-bonus-value" value="0" type="number"/>
			</div>
		</form>`, data);

		// create and resolve the dialogue
		let thing = await new Promise( resolve => 
			{new Dialog({
				title: 'Configure Roll',
				content,
				buttons: {
					submit: {
						label: game.i18n.localize("SRPG.submit"),
						callback: (html) => this._submitSkillRoll(html, id, category)
					}
				},
				close: () => { resolve(null) }
			}).render(true);
		});
	}


	// recieve data from roll confirmation, create and submit roll object
	_submitSkillRoll(html, id, category) {
		// get bonus from hmtl
		const formElement = html[0].querySelector('form');
		const formData = new FormDataExtended(formElement);
 		const formDataObject = formData.object;
		const bonus = formDataObject['roll-bonus-value'];

		// check if initiative
		if (id == 'initiative') {
			this.actor.rollInitiative({ createCombatants: true });
		}

		// otherwise: roll!
		else {
			console.log('rolling ' + game.i18n.localize(this.actor.getRollData()[category][id].label));
			let r = new Roll(`1d10 + @${category}.${id}.base + ${bonus}`, this.actor.getRollData());
			return r.toMessage({
			    user: game.user.id,
			    speaker: ChatMessage.getSpeaker({ actor: this.actor }),
			    flavor: `<h2 class="skillroll">${game.i18n.localize(this.actor.getRollData()[category][id].label)}</h2>`
			})
		}
	}
}
