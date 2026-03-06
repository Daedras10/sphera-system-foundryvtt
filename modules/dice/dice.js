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
    let skills = getSkills(actorInfo);
    let skillBonus = 0;
    let skill = null;
    
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
        skills: skills,
    };
    
    if (info.useDialog)
    {
        let checkOptions = await GetAttributeCheckOptions(info.attribute, currentRollInfo);
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
        
        if (checkOptions.skillUsed !== "") {
            skill = skills.find(s => s.baseName === checkOptions.skillUsed);
            if (skill) {
                let skillLevel = skill.level + skill.levelModifiers;
                let skillModifiers = skill.modifiers;
                if (skill.parent)
                {
                    let skillParent = skills.find(s => s.baseName === skill.parent);
                    if (skillParent) {
                        skillLevel += skillParent.level + skillParent.levelModifiers;
                        skillModifiers += skillParent.modifiers;
                    }
                }

                skillBonus = 2 * skillLevel + skillModifiers;

                rollFormula += ` + ${skillBonus}`;
            }
        }
    }
    
    const messageTemplate = "systems/sphera/templates/chat/attribute-check-chat.hbs";
    let rollData = {}

    let roll = await new Roll(rollFormula, rollData).roll();
    let rollInfo = {
        formula: rollFormula,
        attribute: game.i18n.localize("sphera.characteristics.attributes." + info.attribute),
        skill: skill ? skill.displayName : game.i18n.localize("sphera.dialog.skillCheck.noSkillUsed"),
        inferiority: inferiority,
        superiority: superiority,
        otherBonuses: otherBonuses > 0 ? "+" + otherBonuses : otherBonuses,
    }
    console.log(rollInfo);
    roll.tooltip = await roll.getTooltip();
    roll.rollInfo = rollInfo;
    console.log("Roll object before rendering template:", roll);
    
    let renderedRoll = await renderTemplate(messageTemplate, roll);
    let messageData = {
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({actor: this.actor}),
    }
    
    messageData.content = renderedRoll;
    await roll.toMessage(messageData);
}

export async function SkillCheck(info, actorInfo) {

    let superiority = 0;
    let inferiority = 0;

    let attributeBonus = 0;
    let attributeDices = 3;
    let attributeLevelBonus = 0;
    let attributeInfo = getAttributeFromName(actorInfo, info.attribute);

    let otherBonuses = 0;
    let reserveMalus = 0;
    let isPhysical = ["strength", "endurance", "speed", "agility"].includes(info.attribute);
    let skills = getSkills(actorInfo);
    let attributes = getAttributes(actorInfo);
    let skillBonus = 0;
    
    let totalDices = 0;
    let dicesToRoll = 0;
    let keepType = "kl3";
    let rollFormula = ``;

    console.log("SkillCheck, Info:", info);
    console.log("SkillCheck, actorInfo:", actorInfo);
    
    let skillInfo = null;
    if (info.skill) skillInfo = skills.find(s => s.baseName === info.skill);

    let currentRollInfo = {
        formula: rollFormula,
        attribute: info.attribute ? game.i18n.localize("sphera.characteristics.attributes." + info.attribute) : null,
        skill: info.skill ? skillInfo : null,
        dicesToRoll: dicesToRoll,
        keepType: keepType,
        attributeDices: attributeDices,
        attributeLevelBonus: attributeLevelBonus,
        attributeBonus: attributeBonus,
        reserveMalus: reserveMalus,
        superiority: superiority,
        inferiority: inferiority,
        skills: skills,
        attributes: attributes,
    };
    
    if (info.useDialog)
    {
        let checkOptions = await GetSkillCheckOptions(info.skill, currentRollInfo);
        console.log(checkOptions);

        if (checkOptions.cancelled) {
            console.log("Skill check cancelled");
            return;
        }
        
        if (checkOptions.attributeUsed === "") {
            console.warn("No attribute selected for skill check");
            return;
        }

        superiority = checkOptions.superiority;
        inferiority = checkOptions.inferiority;
        otherBonuses = checkOptions.skillBonus;
        //otherBonuses = checkOptions.useReserve ? checkOptions.reserveToUse : 0;

        // skillBonus: parseInt(form.skillBonus.value),
        //         superiority: parseInt(form.superiority.value),
        //         inferiority: parseInt(form.inferiority.value),
        //         difficulty: parseInt(form.difficulty.value),
        //         useReserve: form.useReserve.checked,
        //         reserveToUse: parseInt(form.reserveToUse.value),
        //         attributeUsed: form.attributeUsed.value,

        attributeInfo = getAttributeFromName(actorInfo, checkOptions.attributeUsed);
        if (!attributeInfo) {
            console.warn("Selected attribute not found in actorInfo:", checkOptions.attributeUsed);
            return;
        }

        attributeDices = attributeInfo.dices;
        attributeLevelBonus = attributeInfo.levelModifiers;
        attributeBonus = attributeInfo.modifiers;
        isPhysical = ["strength", "endurance", "speed", "agility"].includes(checkOptions.attributeUsed);
        

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

        let reserveMax = getMaxReserves(actorInfo, isPhysical);
        let currentReserve = isPhysical ? actorInfo.reserve.physical.current : actorInfo.reserve.mental.current;
        reserveMalus = currentReserve - (reserveMax * 0.5);
        if (reserveMalus > 0) reserveMalus = 0;
        reserveMalus = Math.floor(reserveMalus);
        console.log("Reserve malus calculated:", reserveMalus, "Current reserve:", currentReserve, "Reserve max:", reserveMax);

        rollFormula = `${dicesToRoll}d10${keepType} + ${attributeLevelBonus} + ${attributeBonus} + ${otherBonuses} + ${reserveMalus}`;
        
        if (skillInfo) {
            let skillLevel = skillInfo.level + skillInfo.levelModifiers;
            let skillModifiers = skillInfo.modifiers;
            if (skillInfo.parent)
            {
                let skillParent = skills.find(s => s.baseName === skillInfo.parent);
                if (skillParent) {
                    skillLevel += skillParent.level + skillParent.levelModifiers;
                    skillModifiers += skillParent.modifiers;
                }
            }

            skillBonus = 2 * skillLevel + skillModifiers;

            rollFormula += ` + ${skillBonus}`;
        }
    }

    const messageTemplate = "systems/sphera/templates/chat/attribute-check-chat.hbs";
    let rollData = {}

    let roll = await new Roll(rollFormula, rollData).roll();
    let rollInfo = {
        formula: rollFormula,
        attribute: game.i18n.localize("sphera.characteristics.attributes." + attributeInfo.baseName),
        skill: skillInfo ? skillInfo.displayName : game.i18n.localize("sphera.dialog.skillCheck.noSkillUsed"),
        inferiority: inferiority,
        superiority: superiority,
        otherBonuses: otherBonuses > 0 ? "+" + otherBonuses : otherBonuses,
    }
    console.log(rollInfo);
    roll.tooltip = await roll.getTooltip();
    roll.rollInfo = rollInfo;
    console.log("Roll object before rendering template:", roll);

    let renderedRoll = await renderTemplate(messageTemplate, roll);
    let messageData = {
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({actor: this.actor}),
    }

    messageData.content = renderedRoll;
    await roll.toMessage(messageData);
}
export async function GetAttributeCheckOptions(attributeType, currentRollInfo) {
    const template = "systems/sphera/templates/dialog/attribute-check-dialog.hbs";
    const html = await renderTemplate(template, {currentRollInfo});
    
    return new Promise(resolve => {
        const data = {
            title: game.i18n.localize("sphera.dialog.attributeCheck.title"),
            content: html,
            buttons: {
                roll: {
                    label: game.i18n.localize("sphera.dialog.generic.roll"),
                    callback: (html) => {resolve(_processAttributeCheckOptions(html[0].querySelector("form")));}
                },
                cancel: {
                    label: game.i18n.localize("sphera.dialog.generic.cancel"),
                    callback: () => resolve({cancelled: true})
                }
            },
            default: "normal",
            close: () => resolve({cancelled: true})
            
        };
        new Dialog(data, null).render(true);
    });
}

function _processAttributeCheckOptions(form) {
    return {
        skillBonus: parseInt(form.skillBonus.value),
        superiority: parseInt(form.superiority.value),
        inferiority: parseInt(form.inferiority.value),
        difficulty: parseInt(form.difficulty.value),
        useReserve: form.useReserve.checked,
        reserveToUse: parseInt(form.reserveToUse.value),
        skillUsed: form.skillUsed.value,
    }
}


export async function GetSkillCheckOptions(attributeType, currentRollInfo) {
    const template = "systems/sphera/templates/dialog/skill-check-dialog.hbs";
    const html = await renderTemplate(template, {currentRollInfo});
    
    console.log(currentRollInfo);

    return new Promise(resolve => {
        const data = {
            title: game.i18n.localize("sphera.dialog.skillCheck.title"),
            content: html,
            buttons: {
                roll: {
                    label: game.i18n.localize("sphera.dialog.generic.roll"),
                    callback: (html) => {resolve(_processSkillCheckOptions(html[0].querySelector("form")));}
                },
                cancel: {
                    label: game.i18n.localize("sphera.dialog.generic.cancel"),
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
        attributeUsed: form.attributeUsed.value,
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

function getSkills(actorInfo) {
    let skills = [];

    Object.keys(actorInfo.skills.combatSkills).forEach(key => {
        let skill = actorInfo.skills.combatSkills[key];
        skills.push(skill);
    });
    Object.keys(actorInfo.skills.craftSkills).forEach(key => {
        let skill = actorInfo.skills.craftSkills[key];
        skills.push(skill);
    });
    Object.keys(actorInfo.skills.socialSkills).forEach(key => {
        let skill = actorInfo.skills.socialSkills[key];
        skills.push(skill);
    });
    Object.keys(actorInfo.skills.magicSkills).forEach(key => {
        let skill = actorInfo.skills.magicSkills[key];
        skills.push(skill);
    });
    
    console.log("Skills extracted from actorInfo:", skills);
    return skills;
}

function getAttributes(actorInfo) {
    let attributes = [];

    Object.keys(actorInfo.attributes).forEach(key => {
        let attribute = actorInfo.attributes[key];
        attribute["baseName"] = key;
        attribute["displayName"] = game.i18n.localize("sphera.characteristics.attributes." + key);
        attributes.push(attribute);
    });
    
    console.log("Attributes extracted from actorInfo:", attributes);
    return attributes;
}

function getAttributeFromName(actorInfo, attributeName) {
    let attribute = null;

    Object.keys(actorInfo.attributes).forEach(key => {
        if (key === attributeName) {
            attribute = actorInfo.attributes[key];
            attribute["baseName"] = key;
            attribute["displayName"] = game.i18n.localize("sphera.characteristics.attributes." + key);
        }
    });
    
    console.log("Attribute extracted from actorInfo:", attribute);
    return attribute;
}