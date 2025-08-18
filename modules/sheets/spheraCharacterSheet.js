const api = foundry.applications.api;
const sheets = foundry.applications.sheets;

export default class SpheraCharacterSheet extends api.HandlebarsApplicationMixin(sheets.ActorSheetV2)
{
    sheetContext = {};

    
}