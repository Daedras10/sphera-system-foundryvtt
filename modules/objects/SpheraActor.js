export default class SpheraActor extends Actor 
{
    static async create(data, options) {
        const createData = data;


        console.log("SPHERA | Creating new actor with data nefpre", createData);

        // Only apply defaults for newly created actors
        if (!(typeof data.system === "undefined")) {
            return super.create(createData, options);
        }

        console.log("SPHERA | Creating new actor with data", createData);

        switch (createData.type) {
            case "PlayerCharacter":
                createData.prototypeToken = {
                    actorLink: true,
                    disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
                };
                break;
            case "NPC":
                createData.prototypeToken = {
                    actorLink: false,
                    disposition: CONST.TOKEN_DISPOSITIONS.HOSTILE,
                };
                break;
            case "swarm":
                createData.prototypeToken = {
                    actorLink: false,
                    disposition: CONST.TOKEN_DISPOSITIONS.HOSTILE,
                };
                break;
        }
        return super.create(createData, options);
    }
    
    prepareData() 
    {
        console.log("SPHERA | Preparing data for actor", this);
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