import { TinyD6System } from "../tinyd6.js";

export default class TinyD6ItemSheet extends ItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: [ TinyD6System.SYSTEM, "sheet", "item", game.settings.get(TinyD6System.SYSTEM, "theme") ]
        });
    }

    get template() {
        const path = "systems/tinyd6/templates/sheets";
        return `${path}/${this.item.type}-sheet.hbs`;
    }

    getData() {
        const data = super.getData();

        data.data.system.traits = {};
        data.config = CONFIG.tinyd6;
        data.tinyItemDescription = TextEditor.enrichHTML(this.object.system.description.value, {async: false});
        if (this.object.system.trait) {
            data.tinyItemTrait = TextEditor.enrichHTML(this.object.system.trait.value, {async: false});
        }
        return data;
    }
}