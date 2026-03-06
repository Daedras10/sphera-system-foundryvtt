import { sphera } from "./modules/config.js";
import * as Chat from "./modules/chat.js";
import SpheraItemSheet from "./modules/sheets/SpheraItemSheet.js";
import SpheraCharacterSheet from "./modules/sheets/SpheraCharacterSheet.js";
import SpheraActor from "./modules/objects/SpheraActor.js";
import SpheraCombat from "./modules/combat/SpheraCombat.js";
import SpheraCombatant from "./modules/combat/SpheraCombatant.js";

Hooks.once("init", async () => {

    console.log("SPHERA | Initalizing Sphera Core System");
    
    CONFIG.sphera = sphera;
    //CONFIG.Item.documentClass = SpheraItemSheet;
    CONFIG.Actor.documentClass = SpheraActor;
    CONFIG.Combat.documentClass = SpheraCombat;
    CONFIG.Combatant.documentClass = SpheraCombatant;
    
    registerItemSheets();
    registerActorSheets();

    preloadHandlebarsTemplates();
    registerHandelbarsHelpers();
});

Hooks.on("renderChatLog", async (app, html, data) => {Chat.addChatListeners(html)});
Hooks.on("getChatLogEntryContext", async (html, options) => {Chat.addChatMessageContextOptions(html, options)});
Hooks.on("renderChatMessage", async (app, html, data) => {Chat.handleRenderChatMessage(app, html, data)});

function registerItemSheets() {

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("sphera", SpheraItemSheet, { makeDefault: true });
}

function registerActorSheets() {

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("sphera", SpheraCharacterSheet, { makeDefault: true });
}

async function preloadHandlebarsTemplates() {
    const templatePaths = [
        "templates/dice/roll.html",
        "templates/dice/tooltip.html",
    ];
    return loadTemplates(templatePaths);
}


function registerHandelbarsHelpers() {
    Handlebars.registerHelper("equals", function(v1, v2) { return (v1 === v2)});
    Handlebars.registerHelper("notEquals", function(v1, v2) { return (v1 !== v2)});
    Handlebars.registerHelper("contains", function(element, search) { return (element.includes(search))});
    Handlebars.registerHelper("concat", function(s1, s2, s3 = "") { return s1 + s2 + s3;});
    Handlebars.registerHelper("isGreater", function(p1, p2) { return (p1 > p2)});
    Handlebars.registerHelper("isEqualORGreater", function(p1, p2) { return (p1 >= p2)});
    Handlebars.registerHelper("isLess", function(p1, p2) { return (p1 < p2)});
    Handlebars.registerHelper("isEqualORLess", function(p1, p2) { return (p1 <= p2)});
    Handlebars.registerHelper("ifOR", function(conditional1, conditional2) { return (conditional1 || conditional2)});
    Handlebars.registerHelper("doLog", function(value) { console.log(value)});
    Handlebars.registerHelper("toBoolean", function(string) { return (string === "true")});

    Handlebars.registerHelper('for', function(from, to, incr, content) {
        let result = "";

        for(let i = from; i < to; i += incr)
            result += content.fn(i);

        return result;
    });

    Handlebars.registerHelper("times", function(n, content) {
        let result = "";

        for(let i = 0; i < n; ++i)
            result += content.fn(i);

        return result;
    });

    Handlebars.registerHelper("notEmpty", function(value) {
        if (value == 0 || value == "0") return true;
        if (value == null|| value  == "") return false;
        return true;
    });

    Handlebars.registerHelper('notNull', function(value) {
        return value != null;
    });
}






// import { SPHERA } from "./modules/config.js";


// Hooks.once("init", async () => {
//
//     console.log("SPHERA | Initalizing Sphera Core System");
//    
//     registerItemSheets();
//
//     // Setting up the Global Configuration Object
//     CONFIG.SPHERA = SPHERA;
//     CONFIG.INIT = true;
//
//     // Register custom Sheets and unregister the start Sheets
//     // Items.unregisterSheet("core", ItemSheet);
//     // Actors.unregisterSheet("core", ActorSheet);
//
//     // Load all Partial-Handlebar Files
//     preloadHandlebarsTemplates();
//
//     // Register Additional Handelbar Helpers
//     registerHandelbarsHelpers();  
// });
//
// Hooks.once("ready", async () => {
//
//     // Finished Initalization Phase and release lock
//     CONFIG.INIT = false;
//
//     // Only execute when run as Gamemaster
//     if(!game.user.isGM) return;   
// });
//
// function preloadHandlebarsTemplates() {
//
//     const templatePaths = [
//         // "systems/sphera/templates/partials/template.hbs",
//     ];
//    
//     return loadTemplates(templatePaths);
// };
//
//
//
// /* -------------------------------------------- */
// /*  General Functions                           */
// /* -------------------------------------------- */
//