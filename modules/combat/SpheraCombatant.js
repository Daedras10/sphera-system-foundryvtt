export default class SpheraCombatant extends Combatant {
    _getInitiativeFormula() {
        let baseFormula = super._getInitiativeFormula();
        let initiativePenalty = this.getFlag("sphera", "initiativePenalty") || 0;
        
        let actorInfo = this.actor.system;
        //console.log(actorInfo);
        
        let speedDices = actorInfo.attributes.speed.dices;
        let speedLvlModifiers = actorInfo.attributes.speed.levelModifiers;
        let speedModifiers = actorInfo.attributes.speed.modifiers;
        
        let physicalReserve = actorInfo.reserve.physical.current;
        let physicalMaxReserve = actorInfo.reserve.physical.max + actorInfo.reserve.physical.malus
        let physicalReserveModifier = physicalReserve - (physicalMaxReserve * 0.5);
        if (physicalReserveModifier > 0) physicalReserveModifier = 0;
        physicalReserveModifier = Math.floor(physicalReserveModifier);
        
        let superiority = 0;
        let inferiority = 0;

        let totalDices = (speedDices + superiority - inferiority) - 3;
        let dicesToRoll = 3;
        let keepType = "kh3";
        if (totalDices >= 0) {
            dicesToRoll = totalDices + 3;
            keepType = "kh3";
        } else {
            dicesToRoll = (totalDices * -1) + 3;
            keepType = "kl3";
        }

        let rollFormula = `${dicesToRoll}d10${keepType} + ${speedLvlModifiers} + ${speedModifiers} + ${physicalReserveModifier}`;
        if (initiativePenalty !== 0) rollFormula += ` - ${initiativePenalty}`;
        
        console.log(`Initiative rollFormula: ${rollFormula}`);
        
        return rollFormula;
    }
    
    _onCreate(data, options, userId) {
        // could also: this.setFlag("sphera", "initiativeFormula", "3d6");
        return super._onCreate(data, options, userId);
    }
}