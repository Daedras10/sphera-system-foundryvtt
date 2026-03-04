export async function _onTestRoll({actionValue = null} = {}) {
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

    let roll = await new Roll(rollFormula, rollData).roll();
    roll.toMessage(messageData);
}

export async function AttributeSkillCheck(info, actorInfo) {
    
    let superiority = 0;
    let inferiority = 0;
    
    let attributeBonus = 0;
    let attributeDices = 3;
    let attributeLevelBonus = 0;
    
    let otherBonuses = 0;
    let reserveMalus = 0;
    let isPhysical = ["strength", "endurance", "speed", "agility"].includes(info.attribute);
    
    console.log("Attribute skillCheck, Info:", info);
    console.log("Attribute skillCheck, actorInfo:", actorInfo);
    
    switch (info.attribute) {
        case "strength":
            attributeDices = actorInfo.attributes.strength.dices;
            attributeLevelBonus = actorInfo.attributes.strength.levelModifiers;
            attributeBonus = actorInfo.attributes.strength.modifiers;
            break;
        case "endurance":
            attributeDices = actorInfo.attributes.endurance.dices;
            attributeLevelBonus = actorInfo.attributes.endurance.levelModifiers;
            attributeBonus = actorInfo.attributes.endurance.modifiers;
            break;
        case "speed":
            attributeDices = actorInfo.attributes.speed.dices;
            attributeLevelBonus = actorInfo.attributes.speed.levelModifiers;
            attributeBonus = actorInfo.attributes.speed.modifiers;
            break;
        case "agility":
            attributeDices = actorInfo.attributes.agility.dices;
            attributeLevelBonus = actorInfo.attributes.agility.levelModifiers;
            attributeBonus = actorInfo.attributes.agility.modifiers;
            break;
        case "address":
            attributeDices = actorInfo.attributes.address.dices;
            attributeLevelBonus = actorInfo.attributes.address.levelModifiers;
            attributeBonus = actorInfo.attributes.address.modifiers;
            break;
        case "charisma":
            attributeDices = actorInfo.attributes.charisma.dices;
            attributeLevelBonus = actorInfo.attributes.charisma.levelModifiers;
            attributeBonus = actorInfo.attributes.charisma.modifiers;
            break;
        case "perception":
            attributeDices = actorInfo.attributes.perception.dices;
            attributeLevelBonus = actorInfo.attributes.perception.levelModifiers;
            attributeBonus = actorInfo.attributes.perception.modifiers;
            break;
        case "intellect":
            attributeDices = actorInfo.attributes.intellect.dices;
            attributeLevelBonus = actorInfo.attributes.intellect.levelModifiers;
            attributeBonus = actorInfo.attributes.intellect.modifiers;
            break;
        case "willpower":
            attributeDices = actorInfo.attributes.willpower.dices;
            attributeLevelBonus = actorInfo.attributes.willpower.levelModifiers;
            attributeBonus = actorInfo.attributes.willpower.modifiers;
            break;
        case "magic":
            attributeDices = actorInfo.attributes.magic.dices;
            attributeLevelBonus = actorInfo.attributes.magic.levelModifiers;
            attributeBonus = actorInfo.attributes.magic.modifiers;
            break;
        default:
            console.warn("Unknown attribute for skill check:", info.attribute);
            return;
    }
    
    let reserveMax = getMaxReserves(actorInfo, isPhysical);
    let currentReserve = isPhysical ? actorInfo.reserve.physical.current : actorInfo.reserve.mental.current;
    reserveMalus = currentReserve - (reserveMax * 0.5);
    if (reserveMalus > 0) reserveMalus = 0;
    reserveMalus = Math.floor(reserveMalus);
    console.log("Reserve malus calculated:", reserveMalus, "Current reserve:", currentReserve, "Reserve max:", reserveMax);
    
    
    let totalDices = (attributeDices + superiority - inferiority) - 3;
    let dicesToRoll = 3;
    let keepType = "kh3";
    if (totalDices >= 0) {
        dicesToRoll = totalDices + 3;
        keepType = "kh3";
    } else {
        dicesToRoll = (totalDices * -1) + 3;
        keepType = "kl3";
    }
    
    let rollFormula = `${dicesToRoll}d10${keepType} + ${attributeLevelBonus} + ${attributeBonus} + ${reserveMalus}`;

    let currentRollInfo = {
        formula: rollFormula,
        attribute: game.i18n.localize("sphera.characteristics.attributes." + info.attribute),
        dicesToRoll: dicesToRoll,
        keepType: keepType,
        attributeDices: attributeDices,
        attributeLevelBonus: attributeLevelBonus,
        attributeBonus: attributeBonus,
        reserveMalus: reserveMalus,
        superiority: superiority,
        inferiority: inferiority,
    };

    if (info.useDialog)
    {
        let checkOptions = await GetSkillCheckOptions(info.attribute, currentRollInfo);
        console.log(checkOptions);

        if (checkOptions.cancelled) {
            console.log("Skill check cancelled");
            return;
        }

        superiority = checkOptions.superiority;
        inferiority = checkOptions.inferiority;
        otherBonuses = checkOptions.skillBonus;
        //otherBonuses = checkOptions.useReserve ? checkOptions.reserveToUse : 0;

        totalDices = (attributeDices + superiority - inferiority) - 3;
        dicesToRoll = 3;
        keepType = "kh3";
        if (totalDices >= 0) {
            dicesToRoll = totalDices + 3;
            keepType = "kh3";
        } else {
            dicesToRoll = (totalDices * -1) + 3;
            keepType = "kl3";
        }
        
        rollFormula = `${dicesToRoll}d10${keepType} + ${attributeLevelBonus} + ${attributeBonus} + ${otherBonuses} + ${reserveMalus}`;
    }
    
    let rollData = {}
    let messageData = {
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({actor: this.actor})
    }

    let roll = await new Roll(rollFormula, rollData).roll();
    await roll.toMessage(messageData);
}

export async function SkillCheck(info, actorInfo) {
    // Similar to AttributeSkillCheck but with more customizable options, like choosing the attribute dices to use, or adding flat bonuses.
    // The info object should contain all the necessary information to build the roll formula, and the dialog should allow the player to modify it before rolling.
    // TODO
}
export async function GetSkillCheckOptions(skillType, currentRollInfo) {
    const template = "systems/sphera/templates/dialog/skill-check-dialog.hbs";
    const html = await renderTemplate(template, {currentRollInfo});
    
    return new Promise(resolve => {
        const data = {
            title: game.i18n.localize("sphera.dialog.skillCheck.title"),
            content: html,
            buttons: {
                roll: {
                    label: game.i18n.localize("sphera.dialog.skillCheck.roll"),
                    callback: (html) => {resolve(_processSkillCheckOptions(html[0].querySelector("form")));}
                },
                cancel: {
                    label: game.i18n.localize("sphera.dialog.skillCheck.cancel"),
                    callback: () => resolve({cancelled: true})
                }
            },
            default: "normal",
            close: () => resolve({cancelled: true})
            
        };
        new Dialog(data, null).render(true);
    });
}

function _processSkillCheckOptions(form) {
    return {
        skillBonus: parseInt(form.skillBonus.value),
        superiority: parseInt(form.superiority.value),
        inferiority: parseInt(form.inferiority.value),
        difficulty: parseInt(form.difficulty.value),
        useReserve: form.useReserve.checked,
        reserveToUse: parseInt(form.reserveToUse.value),
    }
}

function getMaxReserves(actorInfo, isPhysical) 
{
    let Max = 0;
    if (isPhysical)
    {
        Max = actorInfo.reserve.physical.max;
        if (actorInfo.reserve.physical.maxOverride === false)
        {
            Max = actorInfo.attributes.strength.dices +
                actorInfo.attributes.endurance.dices +
                actorInfo.attributes.speed.dices +
                actorInfo.attributes.agility.dices +
                actorInfo.attributes.address.dices;
        }
        
        Max += actorInfo.reserve.physical.bonus;
        return Max;
    }
    
    Max = actorInfo.reserve.mental.max;
    if (actorInfo.reserve.mental.maxOverride === false)
    {
        Max = actorInfo.attributes.charisma.dices +
            actorInfo.attributes.perception.dices +
            actorInfo.attributes.intellect.dices +
            actorInfo.attributes.willpower.dices +
            actorInfo.attributes.magic.dices;
    }
    
    Max += actorInfo.reserve.mental.bonus;
    return Max;
}