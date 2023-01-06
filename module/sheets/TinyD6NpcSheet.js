import TinyD6ActorSheet from "./TinyD6ActorSheet.js";
import { TinyD6System } from "../tinyd6.js";

export default class TinyD6NpcSheet extends TinyD6ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            height: null,
            template: "systems/tinyd6/templates/sheets/npc-sheet.hbs",
            classes: [ TinyD6System.SYSTEM, "sheet", "npc", game.settings.get(TinyD6System.SYSTEM, "theme") ]
        });
    }
    getData() {
        const data = super.getData();

        data.config = CONFIG.tinyd6;
        data.tinyNPCDescription = TextEditor.enrichHTML(this.object.system.description.value, {async: false});
        return data;
    }
}