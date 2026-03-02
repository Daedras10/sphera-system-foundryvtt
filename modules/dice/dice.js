export async function _onTestRoll({actionValue = null} = {}) {
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

    let roll = await new Roll(rollFormula, rollData).roll();
    roll.toMessage(messageData);
}