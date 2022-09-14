/**
 * Extends basic actor sheet
 * @extends {ActorSheet}
 */
export class SRPGActorSheet extends ActorSheet {

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			// CSS classes
			classes: ["srpg", "sheet", "actor"],
			template: "systems/srpg/templates/actor/actor-shinobi-sheet.hbs",
			// Default window dimensions
			width: 600,
			height: 600,
			tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "skills" }]
		});
	}

	/** @override */
	get template() {
		return `systems/srpg/templates/actor/actor-${this.actor.type}-sheet.hbs`;
	}

	/**
	 * Called when opeining actor sheet
	 *  @override */
	getData() {
		console.log("running getData()");

		// get actor data
		const context = super.getData();
		const actorData = context.data;
		context.flags = actorData.flags;
		console.log(actorData.system);

		// prepare shinobi data and items
		if (actorData.type == 'shinobi') {
			this._prepareCharacterData(context);
		}

		// prepare mook data and items

		// add roll data

		// prepare active effects?

		console.log("done with getData()");

		return context;
	}

	/**
	 * Prepare shinobi info for sheet
	 * @param {Object} actorData the actor to prepare
	 * @return {undefined}
	 */
	_prepareCharacterData(context) {
		console.log("preparing shinobi data");
	}

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		html.find('.item-edit').click(ev => {
			const li = $(ev.currentTarget).parents(".item");
			const item = this.actor.items.get(li.data("itemId"));
			item.sheet.render(true);
		});

		// ---------------------------------------------------------
		// everything below here is only needed if sheet is editable
		if (!this.isEditable) return;

		// Active Effect management
		html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));

		// Rollable abilities.
		//html.find('.rollable').click(this._onRoll.bind(this));
	}

	/**
	 * TODO: generalize this from just hp to all values
	 * updates values of info upon submitting data
	 * should move to helper function so that it works for items as well.
	 *  @inheritdoc */
	_getSubmitData(updateData) {
		let formData = super._getSubmitData(updateData);
		console.log(formData);
		console.log(this.actor.system.hp.value);
		const formAttrs = foundry.utils.expandObject(formData);
		console.log(formAttrs);
		//let hpval = temp["actor.system.hp.value"];
		this.actor.system.hp.value = formAttrs.actor.system.hp.value;
		//formData = EntitySheetHelper.updateAttributes(formData, this.object);
		//formData = EntitySheetHelper.updateGroups(formData, this.object);
		return formData;
	}
	
}