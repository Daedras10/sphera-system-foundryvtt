export default class SpheraItemSheet extends ItemSheet
{
    get template()
    {
        return `systems/sphera/templates/sheets/${this.item.system.type}-sheet.hbs`;
    }
    
    getData(options = {}) {
        const data = super.getData(options);
        let sheetData = {
            owner: this.item.isOwner,
            editable: this.isEditable,
            item: data.item,
            system: data.item.system,
            config: CONFIG.sphera
        };
        console.log("SPHERA | Item Sheet Data", sheetData);
        return sheetData;
    }
}