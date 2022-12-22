// document import
import { SRPGActor } from "./documents/actor.mjs";
import { SRPGItem } from "./documents/item.mjs";

// sheet imports
import { SRPGActorSheet } from "./sheets/actor-sheet.mjs";
import { SRPGItemSheet } from "./sheets/item-sheet.mjs";

// other imports
import { preloadHandlebarsTemplates } from "./templates.js";

/* Foundry initialization */

/**
 * Init hook
 */

Hooks.once("init", async function() {
    console.log("Initializing Shinobi");

    CONFIG.Combat.initiative = {
        formula: "1d10 + @s2skills.initiative.base",
        decimals: 2
    };

    game.shinobi = {
        SRPGActor
    };

    // Define custom Document Classes
    CONFIG.Actor.documentClass = SRPGActor;
    CONFIG.Item.documentClass = SRPGItem;
    // token document class
    // token object class

    // register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("srpg", SRPGActorSheet, {makeDefault: true});
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("srpg", SRPGItemSheet, {makeDefault: true});

    // Register system settings if

    await preloadHandlebarsTemplates();
});

//Hooks.once("ready", function() {}); if we need this

//Hooks.on("hotbarDrop", (bar, dat, slot) => createSRPGMacro(data, slot));  if we need this

