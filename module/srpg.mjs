// document import
import { SRPGActor } from "./documents/actor.mjs";

// sheet imports
import { SRPGActorSheet } from "./sheets/actor-sheet.mjs";

// other imports

// init hook
Hooks.once("init", function() {
	
	// add utility classes to global object
	game.srpg = {
		SRPGActor
	};

	// add constants for config
	//here

	// define custom document classes
	CONFIG.Actor.documentClass = SRPGActor;

	// register sheet application classes
	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("srpg", SRPGActorSheet, { makeDefault: true });

	// preload handlebars template if necessary
})

// ready hook
Hooks.once("ready", async function() {
	//Hooks.on("hotbarDrop", (bar, data, slot) => creatItemMacro(data, slot));
})