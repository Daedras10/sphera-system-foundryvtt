export default class SpheraCharacterSheet extends ActorSheet
{
    static get defaultOptions()
    {
        return foundry.utils.mergeObject(super.defaultOptions, {
            templates: "systems/sphera/templates/sheets/actors/playerCharacter-sheet.hbs",
            classes: ["sphera", "sheet", "actor", "playerCharacter"],
        });
    }

    getData(options = {}) {
        const data = super.getData(options);

        console.log("SPHERA | Item Character Data (initial info)", data);
        
        let sheetData = {
            owner: this.actor.isOwner,
            editable: this.isEditable,
            system: data.actor.system,
            config: CONFIG.sphera,
            weapons: data.items.filter(function(item) { return item.type === "weapon" })
        };
        console.log("SPHERA | Item Character Data", sheetData);
        return sheetData;
    }
}