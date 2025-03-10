import { ShipConsole } from './ship-console.js';

Hooks.once("init", () => {
  console.log("MoSh-ShipConsole | Initializing Mothership Ship Console");
});

Hooks.once("ready", () => {
  console.log("MoSh-ShipConsole | Ready Hook - Creating Ship Console instance");
  game.moshShipConsole = new ShipConsole();
  
  // Add a button to the UI if user is GM
  if (game.user.isGM) {
    const button = $(`<div class="mosh-button-container"><button id="mosh-terminal-toggle"><i class="fas fa-terminal"></i> Ship Console</button></div>`);
    button.on("click", "#mosh-terminal-toggle", () => {
      console.log("MoSh-ShipConsole | Terminal button clicked");
      game.moshShipConsole.toggle();
    });
    
    // Add to UI controls section
    $("#ui-left").append(button);
  }
});

// Alternative control approach - add to scene controls
Hooks.on("getSceneControlButtons", (controls) => {
  const notes = controls.find(c => c.name === "notes");
  
  if (notes) {
    console.log("MoSh-ShipConsole | Adding Ship Console button to Notes controls");
    notes.tools.push({
      name: "shipconsole",
      title: game.i18n.localize("MOSH-SHIPCONSOLE.button-title"),
      icon: "fas fa-terminal",
      button: true,
      onClick: () => {
        console.log("MoSh-ShipConsole | Terminal button clicked");
        game.moshShipConsole.toggle();
      }
    });
  }
});
