/**
 * Extends ItemSheet for SRPG
 * @extends { ItemSheet }
 */
export class SRPGItemSheet extends ItemSheet {

    /** @inheritdoc */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["srpg", "sheet", "item"],
            template: "systems/srpg/templates/item/item-base-sheet.hbs",
            width: 500,
            height: 400,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}],
        });
    }

    ///** @inheritdoc */
    //get template() {
    //    return `systems/srpg/templates/item/item-${this.item.type}-sheet.hbs`;
    //}

    /** @inheritdoc */
    async getData(options) {
        const context = await super.getData(options);
        console.log(context);
        //helper functions

        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if sheet is editable
        if ( !this.isEditable ) return;

        // Roll and click handlers
    }
}