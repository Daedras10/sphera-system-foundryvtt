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
        
        bonus = sheetData.system.attributes.endurance.levelModifiers + sheetData.system.attributes.endurance.modifiers;
        sheetData.system.attributes.endurance.text = (bonus >= 0 ? "+" : "") + bonus;
        
        bonus = sheetData.system.attributes.speed.levelModifiers + sheetData.system.attributes.speed.modifiers;
        sheetData.system.attributes.speed.text = (bonus >= 0 ? "+" : "") + bonus;
        
        bonus = sheetData.system.attributes.agility.levelModifiers + sheetData.system.attributes.agility.modifiers;
        sheetData.system.attributes.agility.text = (bonus >= 0 ? "+" : "") + bonus;
        
        bonus = sheetData.system.attributes.address.levelModifiers + sheetData.system.attributes.address.modifiers;
        sheetData.system.attributes.address.text = (bonus >= 0 ? "+" : "") + bonus;

        bonus = sheetData.system.attributes.charisma.levelModifiers + sheetData.system.attributes.charisma.modifiers;
        sheetData.system.attributes.charisma.text = (bonus >= 0 ? "+" : "") + bonus;

        bonus = sheetData.system.attributes.perception.levelModifiers + sheetData.system.attributes.perception.modifiers;
        sheetData.system.attributes.perception.text = (bonus >= 0 ? "+" : "") + bonus;

        bonus = sheetData.system.attributes.intellect.levelModifiers + sheetData.system.attributes.intellect.modifiers;
        sheetData.system.attributes.intellect.text = (bonus >= 0 ? "+" : "") + bonus;
        
        bonus = sheetData.system.attributes.willpower.levelModifiers + sheetData.system.attributes.willpower.modifiers;
        sheetData.system.attributes.willpower.text = (bonus >= 0 ? "+" : "") + bonus;
        
        bonus = sheetData.system.attributes.magic.levelModifiers + sheetData.system.attributes.magic.modifiers;
        sheetData.system.attributes.magic.text = (bonus >= 0 ? "+" : "") + bonus;
        
        // for (let attribute of sheetData.system.attributes) {
        //     attribute.text = "+0";
        // }
    }
}