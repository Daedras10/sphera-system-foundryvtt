export default class SpheraActor extends Actor 
{
    prepareData() 
    {
        super.prepareData();
    }

    prepareDerivedData()
    {
        super.prepareDerivedData();
    }

    _preparePlayerCharacterData(actorData)
    {
        this.setCharacterValues(actorData);
    }

    async _setCharacterValues(actorData)
    {

    }

    setNote(note)
    {
        this.update({ "system.note": note });
    }

    addLogEntry(entry)
    {
        let log = this.system.log || [];
        log.push(entry);
        this.update({ "system.log": log });
    }
}