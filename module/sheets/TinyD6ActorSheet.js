import * as Dice from "../helpers/dice.js";

export default class TinyD6ActorSheet extends ActorSheet {
    getData() {
        const data = super.getData();

        data.config = CONFIG.tinyd6;
        data.config.heritageHeaderPath = `tinyd6.actor.${data.config.theme}.heritage.header`;
        data.config.characterHeaderPath = `tinyd6.actor.${data.config.theme}.character`;
        data.config.heritageTraitPath = `tinyd6.actor.${data.config.theme}.heritage.traits`;
        data.config.heritageDeleteTooltipPath = `tinyd6.actor.${data.config.theme}.heritage.delete`;

        // Determine optional element display based on settings
        data.config.enableCorruption = game.settings.get('tinyd6', 'enableCorruption');
        data.config.enableDamageReduction = game.settings.get('tinyd6', 'enableDamageReduction');
        data.config.advancementMethod = game.settings.get('tinyd6', 'enableAdvancement');
        
        data.data.system.owner = this.actor.isOwner;
        data.data.system.traits = data.data.items.filter(item => { return item.type === "trait" });
        data.data.system.weapons = data.data.items.filter(item => { return item.type === "weapon" && item.system.equipped });
        data.data.system.armor = data.data.items.filter(item => { return item.type === "armor" && item.system.equipped });
        data.data.system.gear = data.data.items.filter(item => { return item.type !== "trait" && item.type !== "heritage" });
        data.tinyBiography = TextEditor.enrichHTML(this.object.system.biography.value, {async: false});
        console.log('data', data)
        return data;
    }

    activateListeners(html)
    {
        console.log("tinyd6 | activating listeners");
        console.log("tinyd6 | html", html.find(".roll-dice"));

        html.find(".item-add").click(this._onItemCreate.bind(this));
        html.find(".item-show").click(this._onItemShow.bind(this));
        html.find(".item-delete").click(this._onItemDelete.bind(this));
        html.find(".item-equip").click(this._onItemEquip.bind(this));
        html.find(".roll-dice").click(this._onDieRoll.bind(this));

        html.find('.editor-content[data-edit]').each((i, div) => this._activateEditor(div));
        html.find(".health-box").on('click change', this._setCurrentDamage.bind(this));

        super.activateListeners(html);
    }

    async _onDieRoll(event)
    {
        console.log("tinyd6 | onDieRoll");
        event.preventDefault();
        const element = event.currentTarget;

        const rollData = {
            numberOfDice: element.dataset.diceX,
            defaultThreshold: element.dataset.threshold,
            focusAction: element.dataset.enableFocus,
            marksmanTrait: element.dataset.enableMarksman
        };

        //TinyD6System.emit('dieRoll', rollData);
        Dice.RollTest(rollData);
    }

    _onItemCreate(event)
    {
        event.preventDefault();
        let element = event.currentTarget;

        let itemData = {
            name: game.i18n.localize("tinyd6.sheet.newItem"),
            img: CONFIG.tinyd6.defaultItemImage,
            type: element.dataset.type
        };

    
        return this.actor.createEmbeddedDocuments('Item', [ itemData ]);
    }

    _onItemDelete(event)
    {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest("[data-item-id]").dataset.itemId;
        return this.actor.items.get(itemId).delete();
    }

    _onItemShow(event)
    {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest("[data-item-id]").dataset.itemId;
        let item = this.actor.items.get(itemId);

        item.sheet.render(true);
    }

    _onItemEquip(event)
    {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest("[data-item-id]").dataset.itemId;
        let item = this.actor.items.get(itemId);

        return item.update(this._toggleEquipped(itemId, item));
    }

    _toggleActionButton(event)
    {
        const element = event.element;
        element.getElementsByClassName('.hidden').toggleClass('hidden');
    }

    _toggleEquipped(id, item) {
        return {
            _id: id,
            data: {
                equipped: !item.system.data.equipped,
            },
        };
    }

    _setCurrentDamage(event)
    {
        event.preventDefault();

        const element = event.currentTarget;
        const currentDamage = parseInt(this.actor.system.wounds.value ?? 0);
        if (element.checked)
        {
            this.actor.update({
                _id: this.actor.system._id,
                data: {
                    wounds: {
                        value: (currentDamage + 1)
                    },
                    advancement: {
                        max: 3
                    }
                }
            });
        }
        else if (currentDamage > 0)
        {
            this.actor.update({
                _id: this.actor.system._id,
                data: {
                    wounds: {
                        value: (currentDamage - 1)
                    }
                }
            });
        }
    }
}
