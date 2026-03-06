import * as Dice from "./dice/dice.js";

export async function addChatListeners(html) 
{
    //html.on("click", 
    html.on('click', 'button.weapon-attack-button', onWeaponAttackButtonClick);
}

export async function addChatMessageContextOptions(html, options) {
    //options.push(
}

export async function handleRenderChatMessage(app, html, data) {

}


function onWeaponAttackButtonClick(event) {
    
}