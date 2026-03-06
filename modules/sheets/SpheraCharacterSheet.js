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
    
    attributeContextMenu = [
        {
            name: game.i18n.localize("sphera.sheet.actorFunctions.edit"),
            icon: '<i class="fas fa-edit"></i>',
            callback: (element) => {
                let attribute = element.data("attribute");
                console.log("SPHERA | Edit attribute", attribute);
            }
        }
    ]
                
                

    getData(options = {}) {
        const data = super.getData(options);

        console.log("SPHERA | Item Character Data (initial info)", data);


        this.debugCleanup();
        
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
        this.updateMaxReserveValues(sheetData);
        this.updateSkillsValues(sheetData);
        
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
    
    updateMaxReserveValues(sheetData = {}) {
        if (sheetData.system.reserve.physical.maxOverride === false)
        {
            let totalDicesPhysical = sheetData.system.attributes.strength.dices +
                sheetData.system.attributes.endurance.dices +
                sheetData.system.attributes.speed.dices +
                sheetData.system.attributes.agility.dices +
                sheetData.system.attributes.address.dices;
            
            sheetData.system.reserve.physical.max = totalDicesPhysical;
            this.actor.system.reserve.physical.max = totalDicesPhysical;
        }
        
        if (sheetData.system.reserve.mental.maxOverride === false)
        {
            let totalDicesMental = sheetData.system.attributes.charisma.dices +
                sheetData.system.attributes.perception.dices +
                sheetData.system.attributes.intellect.dices +
                sheetData.system.attributes.willpower.dices +
                sheetData.system.attributes.magic.dices;
            
            sheetData.system.reserve.mental.max = totalDicesMental;
            this.actor.system.reserve.mental.max = totalDicesMental;
        }

        sheetData.system.reserve.physical.maxDisplayed = sheetData.system.reserve.physical.max + sheetData.system.reserve.physical.bonus;
        this.actor.system.reserve.physical.maxDisplayed = sheetData.system.reserve.physical.max + sheetData.system.reserve.physical.bonus;
        
        sheetData.system.reserve.mental.maxDisplayed = sheetData.system.reserve.mental.max + sheetData.system.reserve.mental.bonus;
        this.actor.system.reserve.mental.maxDisplayed = sheetData.system.reserve.mental.max + sheetData.system.reserve.mental.bonus;

        sheetData.system.reserve.physical.halfUp = Math.ceil(sheetData.system.reserve.physical.maxDisplayed * 0.5);
        sheetData.system.reserve.mental.halfUp = Math.ceil(sheetData.system.reserve.mental.maxDisplayed * 0.5);

        let physicalMalus = sheetData.system.reserve.physical.current - (sheetData.system.reserve.physical.maxDisplayed * 0.5);
        if (physicalMalus > 0) physicalMalus = 0;
        physicalMalus = Math.floor(physicalMalus);
        
        let mentalMalus = sheetData.system.reserve.mental.current - (sheetData.system.reserve.mental.maxDisplayed * 0.5);
        if (mentalMalus > 0) mentalMalus = 0;
        mentalMalus = Math.floor(mentalMalus);

        sheetData.system.reserve.physical.malus = physicalMalus;
        sheetData.system.reserve.mental.malus = mentalMalus;

        this.actor.system.reserve.physical.malus = physicalMalus;
        this.actor.system.reserve.mental.malus = mentalMalus;
    }

    updateSkillsValues(sheetData = {}) {

        console.log("SPHERA | Update skills values", sheetData.system.skills);
        
        if (sheetData.system.sheetActions.isEditMode) this.updateAllSkills(sheetData);
        else this.updateOwnedNotOwnedSkills(sheetData);
        
        console.log("SPHERA | Updated skills values", sheetData.system.skills);
    }

    updateAllSkills(sheetData = {}) {
        sheetData.system.skills.all = {
            "skillAsArray": [],
            "maxCount": 0
        };
        
        let combatSkills = [];
        let craftSkills = [];
        let socialSkills = [];
        let magicSkills = [];

        Object.keys(sheetData.system.skills.combatSkills).forEach(key => {
            let skill = sheetData.system.skills.combatSkills[key];
            skill.displayName = game.i18n.localize("sphera.skills.list." + key);
            skill.baseName = key;
            if (skill.level == null) skill.level = 0;

            combatSkills.push(skill);
        });

        Object.keys(sheetData.system.skills.craftSkills).forEach(key => {
            let skill = sheetData.system.skills.craftSkills[key];
            skill.displayName = game.i18n.localize("sphera.skills.list." + key);
            skill.baseName = key;
            if (skill.level == null) skill.level = 0;
            
            craftSkills.push(skill);
        });

        Object.keys(sheetData.system.skills.socialSkills).forEach(key => {
            let skill = sheetData.system.skills.socialSkills[key];
            skill.displayName = game.i18n.localize("sphera.skills.list." + key);
            skill.baseName = key;
            if (skill.level == null) skill.level = 0;
            
            socialSkills.push(skill);
        });

        Object.keys(sheetData.system.skills.magicSkills).forEach(key => {
            let skill = sheetData.system.skills.magicSkills[key];
            skill.displayName = game.i18n.localize("sphera.skills.list." + key);
            skill.baseName = key;
            if (skill.level == null) skill.level = 0;
            
            magicSkills.push(skill);
        });
        
        let maxCount = Math.max(combatSkills.length, craftSkills.length, socialSkills.length, magicSkills.length);
        sheetData.system.skills.all.maxCount = maxCount;
        
        for (let i = 0; i < maxCount; i++) {
            let arrayElement = {
                combatSkill: combatSkills[i] || null,
                craftSkill: craftSkills[i] || null,
                socialSkill: socialSkills[i] || null,
                magicSkill: magicSkills[i] || null
            };
            sheetData.system.skills.all.skillAsArray.push(arrayElement);
        }
    }
    
    updateOwnedNotOwnedSkills(sheetData = {}) {
        sheetData.system.skills.owned = {
            combatSkills: [],
            craftSkills: [],
            socialSkills: [],
            magicSkills: [],
            secretSkills: [],
            maxCount: 0
        };

        sheetData.system.skills.notOwned = {
            combatSkills: [],
            craftSkills: [],
            socialSkills: [],
            magicSkills: [],
            secretSkills: [],
            maxCount: 0
        };

        Object.keys(sheetData.system.skills.combatSkills).forEach(key => {
            let skill = sheetData.system.skills.combatSkills[key];
            skill.displayName = game.i18n.localize("sphera.skills.list." + key);
            skill.baseName = key;

            if (skill.owned) sheetData.system.skills.owned.combatSkills.push(skill);
            else sheetData.system.skills.notOwned.combatSkills.push(skill);

        });

        Object.keys(sheetData.system.skills.craftSkills).forEach(key => {
            let skill = sheetData.system.skills.craftSkills[key];
            skill.displayName = game.i18n.localize("sphera.skills.list." + key);
            skill.baseName = key;

            if (skill.owned) sheetData.system.skills.owned.craftSkills.push(skill);
            else sheetData.system.skills.notOwned.craftSkills.push(skill);
        });

        Object.keys(sheetData.system.skills.socialSkills).forEach(key => {
            let skill = sheetData.system.skills.socialSkills[key];
            skill.displayName = game.i18n.localize("sphera.skills.list." + key);
            skill.baseName = key;

            if (skill.owned) sheetData.system.skills.owned.socialSkills.push(skill);
            else sheetData.system.skills.notOwned.socialSkills.push(skill);
        });

        Object.keys(sheetData.system.skills.magicSkills).forEach(key => {
            let skill = sheetData.system.skills.magicSkills[key];
            skill.displayName = game.i18n.localize("sphera.skills.list." + key);
            skill.baseName = key;

            if (skill.owned) sheetData.system.skills.owned.magicSkills.push(skill);
            else sheetData.system.skills.notOwned.magicSkills.push(skill);
        });

        sheetData.system.skills.owned.maxCount = Math.max(
            sheetData.system.skills.owned.combatSkills.length,
            sheetData.system.skills.owned.craftSkills.length,
            sheetData.system.skills.owned.socialSkills.length,
            sheetData.system.skills.owned.magicSkills.length,
            sheetData.system.skills.owned.secretSkills.length
        );

        sheetData.system.skills.notOwned.maxCount = Math.max(
            sheetData.system.skills.notOwned.combatSkills.length,
            sheetData.system.skills.notOwned.craftSkills.length,
            sheetData.system.skills.notOwned.socialSkills.length,
            sheetData.system.skills.notOwned.magicSkills.length,
            sheetData.system.skills.notOwned.secretSkills.length
        );
        
        sheetData.system.skills.owned.skillAsArray = [];
        for (let i = 0; i < sheetData.system.skills.owned.maxCount; i++) {
            let arrayElement = {
                combatSkill: sheetData.system.skills.owned.combatSkills[i] || null,
                craftSkill: sheetData.system.skills.owned.craftSkills[i] || null,
                socialSkill: sheetData.system.skills.owned.socialSkills[i] || null,
                magicSkill: sheetData.system.skills.owned.magicSkills[i] || null
            };
            sheetData.system.skills.owned.skillAsArray.push(arrayElement);
        }

        sheetData.system.skills.notOwned.skillAsArray = [];
        for (let i = 0; i < sheetData.system.skills.notOwned.maxCount; i++) {
            let arrayElement = {
                combatSkill: sheetData.system.skills.notOwned.combatSkills[i] || null,
                craftSkill: sheetData.system.skills.notOwned.craftSkills[i] || null,
                socialSkill: sheetData.system.skills.notOwned.socialSkills[i] || null,
                magicSkill: sheetData.system.skills.notOwned.magicSkills[i] || null
            };
            sheetData.system.skills.notOwned.skillAsArray.push(arrayElement);
        }
    };

    debugCleanup() {
        delete this.actor.system.combatSkills;
        delete this.actor.system.craftSkills;
        delete this.actor.system.socialSkills;
        delete this.actor.system.magicSkills;

        Object.keys(this.actor.system.skills.combatSkills).forEach(key => {
            let skill = this.actor.system.skills.combatSkills[key];
            if (key === "") delete this.actor.system.skills.combatSkills[key];
        });
        Object.keys(this.actor.system.skills.craftSkills).forEach(key => {
            let skill = this.actor.system.skills.craftSkills[key];
            if (key === "") delete this.actor.system.skills.craftSkills[key];
        });
        Object.keys(this.actor.system.skills.socialSkills).forEach(key => {
            let skill = this.actor.system.skills.socialSkills[key];
            if (key === "") delete this.actor.system.skills.socialSkills[key];
        });
        Object.keys(this.actor.system.skills.magicSkills).forEach(key => {
            let skill = this.actor.system.skills.magicSkills[key];
            if (key === "") delete this.actor.system.skills.magicSkills[key];
        });
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
            html.find(".roll-skill").click((event) => {this._onRollSkill(event);});
            html.find(".item-title-click").click((event) => {this._onItemTitleClick(event);});
        }
        
        //html.find(".inline-edit").change((event) => {this._onInlineEdit(event);}); //item.update({[event.currentTarget.name]: event.currentTarget.value});
        
        new ContextMenu(html, ".actor-item", this.itemContextMenu);
        new ContextMenu(html, ".attribute-info", this.attributeContextMenu);
        
        return super.activateListeners(html);
    }
    
    
    /* Events binded functions */
    _onItemCreate(event) {
        event.preventDefault();
        let element = event.currentTarget;
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

    _onItemTitleClick(event) {
        event.preventDefault();
        const itemID = event.currentTarget.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemID);
        if (!item) {
            console.warn("SPHERA | Item not found for title click", itemID);
            return;
        }
        item.roll();
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
        if (this.actor.system.sheetActions.isEditMode) return;
        event.preventDefault();
        
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
        if (this.actor.system.sheetActions.isEditMode) return;
        event.preventDefault();
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
    } //TODO: remove this, only for testing purposes
    
    async _onRollAttribute(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let attribute = element.dataset.attribute;
        
        let info = {
            attribute: attribute,
            useDialog: true
        }
        
        return await Dice.AttributeSkillCheck(info, this.actor.system);
    }
    
        async _onRollSkill(event) {
            event.preventDefault();
            let element = event.currentTarget;
            let skill = element.dataset.skill;
            let skillType = element.dataset.skillType;
            
            let info = {
                skill: skill,
                skillType: skillType,
                useDialog: true
            }
            
            return await Dice.SkillCheck(info, this.actor.system);
        }
    
}