import { ShipConsole } from './ship-console.js';

Hooks.once("init", () => {
  console.log("MoSh-ShipConsole | Initializing Mothership Ship Console");
});

Hooks.once("ready", () => {
  game.moshShipConsole = new ShipConsole();
});

Hooks.on("getSceneControlButtons", (controls) => {
  controls.push({
    name: "shipconsole",
    title: game.i18n.localize("MOSH-SHIPCONSOLE.button-title"),
    icon: "fas fa-terminal",
    visible: game.user.isGM,
    tools: [
      {
        name: "toggle",
        title: game.i18n.localize("MOSH-SHIPCONSOLE.button-title"),
        icon: "fas fa-terminal",
        button: true,
        onClick: () => game.moshShipConsole.toggle()
      }
    ]
  });
});
