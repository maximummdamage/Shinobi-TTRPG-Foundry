// document import
import { SRPGActor } from "./documents/actor.mjs";

// sheet imports
import { SRPGActorSheet } from "./sheets/actor-sheet.mjs";

// other imports
import { createSRPGMacro } from "./macro.js";
import { preloadHandlebarsTemplates } from "./templates.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

/**
 * Init hook.
 */
 Hooks.once("init", async function() {
	console.log(`Initializing Shinobi`);
  
	/**
	 * Set an initiative formula for the system. This will be updated later.
	 * @type {String}
	 */
	CONFIG.Combat.initiative = {
	  formula: "1d20",
	  decimals: 2
	};
  
	game.shinobi= {
	  SRPGActor,
	  createSRPGMacro
	};
  
	// Define custom Document classes
	CONFIG.Actor.documentClass = SRPGActor;
	//CONFIG.Item.documentClass = SRPGItem;
	//CONFIG.Token.documentClass = SRPGTokenDocument;
	//CONFIG.Token.objectClass = SRPGToken;
  
	// Register sheet application classes
	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("srpg", SRPGActorSheet, { makeDefault: true });
	//Items.unregisterSheet("core", ItemSheet);
	//Items.registerSheet("srpg", SRPGItemSheet, { makeDefault: true });
  
	// Register system settings
	game.settings.register("srpg", "macroShorthand", {
	  name: "SETTINGS.SRPGMacroShorthandN",
	  hint: "SETTINGS.SRPGMacroShorthandL",
	  scope: "world",
	  type: Boolean,
	  default: true,
	  config: true
	});
  
	// Register initiative setting.
	game.settings.register("srpg", "initFormula", {
	  name: "SETTINGS.SRPGInitFormulaN",
	  hint: "SETTINGS.SRPGInitFormulaL",
	  scope: "world",
	  type: String,
	  default: "1d20",
	  config: true,
	  onChange: formula => _srpgUpdateInit(formula, true)
	});
  
	// Retrieve and assign the initiative formula setting.
	const initFormula = game.settings.get("srpg", "initFormula");
	_srpgUpdateInit(initFormula);
  
	/**
	 * Update the initiative formula.
	 * @param {string} formula - Dice formula to evaluate.
	 * @param {boolean} notify - Whether or not to post nofications.
	 */
	function _srpgUpdateInit(formula, notify = false) {
	  const isValid = Roll.validate(formula);
	  if ( !isValid ) {
		if ( notify ) ui.notifications.error(`${game.i18n.localize("SRPG.NotifyInitFormulaInvalid")}: ${formula}`);
		return;
	  }
	  CONFIG.Combat.initiative.formula = formula;
	}
  
	/**
	 * Slugify a string.
	 */
	Handlebars.registerHelper('slugify', function(value) {
	  return value.slugify({strict: true});
	});
  
	// Preload template partials
	await preloadHandlebarsTemplates();
  });
  
  /**
   * Macrobar hook.
   */
  Hooks.on("hotbarDrop", (bar, data, slot) => createSRPGMacro(data, slot));
  
  /**
   * Adds the actor template context menu.
   */
  Hooks.on("getActorDirectoryEntryContext", (html, options) => {
  
	// Define an actor as a template.
	options.push({
	  name: game.i18n.localize("SRPG.DefineTemplate"),
	  icon: '<i class="fas fa-stamp"></i>',
	  condition: li => {
		const actor = game.actors.get(li.data("documentId"));
		return !actor.isTemplate;
	  },
	  callback: li => {
		const actor = game.actors.get(li.data("documentId"));
		actor.setFlag("srpg", "isTemplate", true);
	  }
	});
  
	// Undefine an actor as a template.
	options.push({
	  name: game.i18n.localize("SRPG.UnsetTemplate"),
	  icon: '<i class="fas fa-times"></i>',
	  condition: li => {
		const actor = game.actors.get(li.data("documentId"));
		return actor.isTemplate;
	  },
	  callback: li => {
		const actor = game.actors.get(li.data("documentId"));
		actor.setFlag("srpg", "isTemplate", false);
	  }
	});
  });
  
  /**
   * Adds the item template context menu.
   */
  Hooks.on("getItemDirectoryEntryContext", (html, options) => {
  
	// Define an item as a template.
	options.push({
	  name: game.i18n.localize("SRPG.DefineTemplate"),
	  icon: '<i class="fas fa-stamp"></i>',
	  condition: li => {
		const item = game.items.get(li.data("documentId"));
		return !item.isTemplate;
	  },
	  callback: li => {
		const item = game.items.get(li.data("documentId"));
		item.setFlag("srpg", "isTemplate", true);
	  }
	});
  
	// Undefine an item as a template.
	options.push({
	  name: game.i18n.localize("SRPG.UnsetTemplate"),
	  icon: '<i class="fas fa-times"></i>',
	  condition: li => {
		const item = game.items.get(li.data("documentId"));
		return item.isTemplate;
	  },
	  callback: li => {
		const item = game.items.get(li.data("documentId"));
		item.setFlag("srpg", "isTemplate", false);
	  }
	});
  });