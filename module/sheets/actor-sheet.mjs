// SRPG Actor Sheet class extends Actor Sheet
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
}