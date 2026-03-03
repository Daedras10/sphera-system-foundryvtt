import * as Dice from '../dice/dice.js';
import {AttributeSkillCheck} from "../dice/dice.js";

export default class SpheraCharacterSheet extends ActorSheet
{
    static get defaultOptions()
    {
        return foundry.utils.mergeObject(super.defaultOptions, {
            templates: "systems/sphera/templates/sheets/actors/playerCharacter-sheet.hbs",
            classes: ["sphera", "sheet", "actor", "playerCharacter"],
        });
    }

    get template()
    {
        return `systems/sphera/templates/sheets/actors/playerCharacter-sheet.hbs`;
    }
    
    itemContextMenu = [
        {
            name: game.i18n.localize("sphera.sheet.actorFunctions.edit"),
            icon: '<i class="fas fa-edit"></i>',
            callback: (element) => {
                const item = this.actor.items.get(element.data("item-id"));
                if (item) {
                    item.sheet.render(true);
                }
            }
        },
        {
            name: game.i18n.localize("sphera.sheet.actorFunctions.delete"),
            icon: '<i class="fas fa-trash"></i>',
            callback: (element) => {
                let itemId = element.data("item-id");
                this.actor.deleteEmbeddedDocuments("Item", [itemId]);
            }
        }
    ]

    getData(options = {}) {
        const data = super.getData(options);

        console.log("SPHERA | Item Character Data (initial info)", data);
        
        let sheetData = {
            owner: this.actor.isOwner,
            editable: this.isEditable,
            system: data.actor.system,
            actor: data.actor,
            config: CONFIG.sphera,
            weapons: data.items.filter(function(item) { return item.type === "weapon" }),
            items: data.items,
            title: data.title
        };
        this.setAttributeBonusAsTexts(sheetData);
        console.log("SPHERA | Item Character Data", sheetData);
        return sheetData;
    }

    setAttributeBonusAsTexts(sheetData = {})
    {
        let bonus = sheetData.system.attributes.strength.levelModifiers + sheetData.system.attributes.strength.modifiers;
        sheetData.system.attributes.strength.text = (bonus >= 0 ? "+" : "") + bonus;
        if (bonus === 0) sheetData.system.attributes.strength.text = "";
        
        bonus = sheetData.system.attributes.endurance.levelModifiers + sheetData.system.attributes.endurance.modifiers;
        sheetData.system.attributes.endurance.text = (bonus >= 0 ? "+" : "") + bonus;
        if (bonus === 0) sheetData.system.attributes.endurance.text = "";
        
        bonus = sheetData.system.attributes.speed.levelModifiers + sheetData.system.attributes.speed.modifiers;
        sheetData.system.attributes.speed.text = (bonus >= 0 ? "+" : "") + bonus;
        if (bonus === 0) sheetData.system.attributes.speed.text = "";
        
        bonus = sheetData.system.attributes.agility.levelModifiers + sheetData.system.attributes.agility.modifiers;
        sheetData.system.attributes.agility.text = (bonus >= 0 ? "+" : "") + bonus;
        if (bonus === 0) sheetData.system.attributes.agility.text = "";
        
        bonus = sheetData.system.attributes.address.levelModifiers + sheetData.system.attributes.address.modifiers;
        sheetData.system.attributes.address.text = (bonus >= 0 ? "+" : "") + bonus;
        if (bonus === 0) sheetData.system.attributes.address.text = "";

        bonus = sheetData.system.attributes.charisma.levelModifiers + sheetData.system.attributes.charisma.modifiers;
        sheetData.system.attributes.charisma.text = (bonus >= 0 ? "+" : "") + bonus;
        if (bonus === 0) sheetData.system.attributes.charisma.text = "";

        bonus = sheetData.system.attributes.perception.levelModifiers + sheetData.system.attributes.perception.modifiers;
        sheetData.system.attributes.perception.text = (bonus >= 0 ? "+" : "") + bonus;
        if (bonus === 0) sheetData.system.attributes.perception.text = "";

        bonus = sheetData.system.attributes.intellect.levelModifiers + sheetData.system.attributes.intellect.modifiers;
        sheetData.system.attributes.intellect.text = (bonus >= 0 ? "+" : "") + bonus;
        if (bonus === 0) sheetData.system.attributes.intellect.text = "";
        
        bonus = sheetData.system.attributes.willpower.levelModifiers + sheetData.system.attributes.willpower.modifiers;
        sheetData.system.attributes.willpower.text = (bonus >= 0 ? "+" : "") + bonus;
        if (bonus === 0) sheetData.system.attributes.willpower.text = "";
        
        bonus = sheetData.system.attributes.magic.levelModifiers + sheetData.system.attributes.magic.modifiers;
        sheetData.system.attributes.magic.text = (bonus >= 0 ? "+" : "") + bonus;
        if (bonus === 0) sheetData.system.attributes.magic.text = "";
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find(".item-create").click((event) => {this._onItemCreate(event);});
        html.find(".item-edit").click((event) => {this._onItemEdit(event);});
        html.find(".item-delete").click((event) => {this._onItemDelete(event);});
        html.find(".reserve-physical-cur").on("click contextmenu", this._onReservePhysicalCur.bind(this));
        html.find(".reserve-physical-max").on("click contextmenu", this._onReservePhysicalMax.bind(this));
        html.find(".reserve-mental-cur").on("click contextmenu", this._onReserveMentalCur.bind(this));
        html.find(".reserve-mental-max").on("click contextmenu", this._onReserveMentalMax.bind(this));
        
        if (this.actor.isOwner) {
            html.find(".test-roll").click((event) => {this._onTestRoll(event);});
            html.find(".roll-attribute").click((event) => {this._onRollAttribute(event);});
        }
        
        //html.find(".inline-edit").change((event) => {this._onInlineEdit(event);}); //item.update({[event.currentTarget.name]: event.currentTarget.value});
        
        new ContextMenu(html, ".actor-item", this.itemContextMenu);
        
        return super.activateListeners(html);
    }
    
    
    /* Events binded functions */
    _onItemCreate(event) {
        event.preventDefault();
        let element = event.currentTarget;

        console.log("SPHERA | SpheraCharacterSheet::_onItemCreate called", element);
        
        let itemData = {
            name: game.i18n.localize("sphera.sheet.newWeapon"),
            type: element.dataset.type
        };
        console.log("SPHERA | SpheraCharacterSheet::_onItemCreate itemData: ", itemData);

        return this.actor.createEmbeddedDocuments("Item", [itemData]);
    }
    
    _onItemEdit(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".actor-item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        if (item) {
            item.sheet.render(true);
        }
    }
    
    _onItemDelete(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".actor-item").dataset.itemId;
        return this.actor.deleteEmbeddedDocuments("Item", [itemId]);
    }
    
    _onInlineEdit(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        if (item) {
            return item.update({[event.currentTarget.name]: event.currentTarget.value});
        }
     }
     
    _onReservePhysicalCur(event) {
        event.preventDefault();
        console.log("SPHERA | ReservePhysicalCur", this.actor.system);
        let currentValue = this.actor.system.reserve.physical.current;
        let newValue;
        if (event.type === "click")
            newValue = Math.max(0, currentValue - 1);
        else 
            newValue = currentValue + 1;
        
        return this.actor.update({"system.reserve.physical.current": newValue});
    }
    _onReservePhysicalMax(event) {}
    
    _onReserveMentalCur(event) {
        event.preventDefault();
        console.log("SPHERA | ReserveMentalCur", this.actor.system);
        let currentValue = this.actor.system.reserve.mental.current;
        let newValue;
        if (event.type === "click")
            newValue = Math.max(0, currentValue - 1);
        else 
            newValue = currentValue + 1;
        
        return this.actor.update({"system.reserve.mental.current": newValue});
    }
    
    _onReserveMentalMax(event) {}

    async _onTestRoll(event) {
        event.preventDefault();
        let element = event.currentTarget;
        console.log("SPHERA | Test roll clicked");
        
        /*
        let chatData = {
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        }

        //chatData.content = await renderTemplate(this.chatTemplate[this.type], cardData);
        chatData.roll = true;
        
        let roll = new Roll("1d20");
        roll.roll({async: false});
        roll.toMessage(chatData);
        
        return ChatMessage.create(chatData);
        */
        
        let rollFormula = "5d10kh3 + @bonus";
        let rollData = {
            bonus: 2
        }
        let messageData = {
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({actor: this.actor})
        }
        
        let checkOptions = await Dice.GetSkillCheckOptions("strength");
        
        let roll = await new Roll(rollFormula, rollData).roll();
        roll.toMessage(messageData);
    }
    
    async _onRollAttribute(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let attribute = element.dataset.attribute;
        console.log("SPHERA | Roll attribute clicked", attribute);
        
        let info = {
            attribute: attribute,
            useDialog: true
        }
        
        return await Dice.AttributeSkillCheck(info, this.actor.system);
    }
    
}