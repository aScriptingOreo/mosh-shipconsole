# Mothership Ship Console

A Foundry VTT module that adds a terminal-style interface for accessing journal entries in a Mothership RPG campaign.

## Features
- ASCII terminal interface with retro CRT styling
- Navigate through journal entries via terminal commands
- GM can add journal entries as terminal entries

## Installation
### Method 1: Foundry Install
1. In the Foundry VTT setup screen, go to "Add-on Modules"
2. Click "Install Module"
3. Enter the following URL in the "Manifest URL" field:
   ```
   https://github.com/yourusername/MoSh-ShipConsole/releases/latest/download/module.json
   ```
4. Click "Install"

### Method 2: Manual Install
1. Download the [latest release](https://github.com/yourusername/MoSh-ShipConsole/releases/latest/download/module.zip)
2. Extract the zip file to your Foundry VTT data modules folder: `Data/modules/MoSh-ShipConsole`
3. Restart Foundry VTT

## Usage
1. Activate the module in your game world
2. As GM, you'll see a terminal button in the scene controls
3. Configure journal entries to appear in the terminal:
   - Right-click a journal entry and select "Configure"
   - In the "Flags" section, add:
     - `MoSh-ShipConsole.isTerminalEntry` (boolean) set to `true`
     - `MoSh-ShipConsole.terminalIndex` (number) set to a unique number
   - Players can access entries by typing these numbers in the terminal

## Terminal Commands
- `help`: Shows available commands
- `menu` or `main`: Shows main menu of available entries
- `clear`: Clears the terminal
- `[number]`: Access the entry with that index number

## License
MIT License
