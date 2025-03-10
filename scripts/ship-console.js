export class ShipConsole {
  constructor() {
    console.log("MoSh-ShipConsole | ShipConsole class constructed");
    this.console = null;
    this.currentJournalEntries = [];
    this.history = [];
    this.currentLevel = null;
  }

  async toggle() {
    console.log("MoSh-ShipConsole | Toggle method called");
    
    if (this.console && !this.console.rendered) {
      console.log("MoSh-ShipConsole | Console exists but not rendered - cleaning up");
      this.console = null;
    }
    
    if (this.console) {
      console.log("MoSh-ShipConsole | Closing existing console");
      this.console.close();
      this.console = null;
      return;
    }
    
    this.render();
  }

  async render() {
    console.log("MoSh-ShipConsole | Rendering console");
    
    this.console = new ShipConsoleApplication();
    
    console.log("MoSh-ShipConsole | Console application created, rendering now");
    await this.console.render(true);
  }
}

class ShipConsoleApplication extends Application {
  static get defaultOptions() {
    console.log("MoSh-ShipConsole | Getting application default options");
    return mergeObject(super.defaultOptions, {
      id: "mosh-ship-console",
      template: "modules/MoSh-ShipConsole/templates/console.html",
      width: 600,
      height: 500,
      resizable: true,
      classes: ["mosh-ship-console"],
      popOut: true,
      title: game.i18n.localize("MOSH-SHIPCONSOLE.window-title")
    });
  }

  getData(options) {
    console.log("MoSh-ShipConsole | Getting application data");
    return {
      welcome: game.i18n.localize("MOSH-SHIPCONSOLE.welcome"),
      prompt: game.i18n.localize("MOSH-SHIPCONSOLE.prompt"),
      availableJournals: this._getAvailableJournals()
    };
  }

  _getAvailableJournals() {
    // Return only journals that should be accessible in the terminal
    return game.journal.filter(j => j.getFlag("MoSh-ShipConsole", "isTerminalEntry")).map(j => {
      return {
        id: j.id,
        name: j.name, 
        path: j.getFlag("MoSh-ShipConsole", "terminalPath") || "main",
        index: j.getFlag("MoSh-ShipConsole", "terminalIndex") || 0
      };
    });
  }

  activateListeners(html) {
    console.log("MoSh-ShipConsole | Activating listeners");
    super.activateListeners(html);
    
    // Handle terminal input
    const input = html.find('.terminal-input');
    const terminal = html.find('.terminal-output');
    
    input.on('keydown', (event) => {
      if (event.key === 'Enter') {
        const command = input.val().trim();
        input.val('');
        
        this._processCommand(command, terminal);
        
        // Keep scrolled to bottom
        terminal.scrollTop(terminal[0].scrollHeight);
      }
    });
    
    // Focus input when terminal is clicked
    html.on('click', () => {
      input.focus();
    });
    
    // Initial welcome message
    this._appendToTerminal(terminal, `
███╗   ███╗ ██████╗ ████████╗██╗  ██╗███████╗██████╗ ███████╗██╗  ██╗██╗██████╗ 
████╗ ████║██╔═══██╗╚══██╔══╝██║  ██║██╔════╝██╔══██╗██╔════╝██║  ██║██║██╔══██╗
██╔████╔██║██║   ██║   ██║   ███████║█████╗  ██████╔╝███████╗███████║██║██████╔╝
██║╚██╔╝██║██║   ██║   ██║   ██╔══██║██╔══╝  ██╔══██╗╚════██║██╔══██║██║██╔═══╝ 
██║ ╚═╝ ██║╚██████╔╝   ██║   ██║  ██║███████╗██║  ██║███████║██║  ██║██║██║     
╚═╝     ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝     
`);
    this._appendToTerminal(terminal, "SHIP TERMINAL v1.0.0");
    this._appendToTerminal(terminal, "Type 'help' for available commands.");
    this._appendToTerminal(terminal, "-----------------------------------------");
    this._appendToTerminal(terminal, "");
    this._showMainMenu(terminal);
    
    // Auto focus the input
    input.focus();
  }

  _appendToTerminal(terminal, text) {
    terminal.append(`<div>${text}</div>`);
  }

  _processCommand(command, terminal) {
    this._appendToTerminal(terminal, `> ${command}`);
    
    switch(command.toLowerCase()) {
      case 'help':
        this._showHelp(terminal);
        break;
      case 'menu':
      case 'main':
        this._showMainMenu(terminal);
        break;
      case 'clear':
        terminal.empty();
        break;
      default:
        // Check if it's a number command to access a journal entry
        if (!isNaN(command)) {
          const index = parseInt(command);
          this._accessJournalByIndex(index, terminal);
        } else {
          this._appendToTerminal(terminal, "Unknown command. Type 'help' for available commands.");
        }
    }
    
    this._appendToTerminal(terminal, "");
  }

  _showHelp(terminal) {
    this._appendToTerminal(terminal, "Available commands:");
    this._appendToTerminal(terminal, "  help  - Show this help message");
    this._appendToTerminal(terminal, "  menu  - Show the main menu");
    this._appendToTerminal(terminal, "  main  - Same as menu");
    this._appendToTerminal(terminal, "  clear - Clear the terminal");
    this._appendToTerminal(terminal, "  [number] - Access the entry with that number");
  }

  _showMainMenu(terminal) {
    const journals = this._getAvailableJournals();
    
    this._appendToTerminal(terminal, "MAIN MENU");
    this._appendToTerminal(terminal, "---------");
    
    if (journals.length === 0) {
      this._appendToTerminal(terminal, "No entries available. The GM needs to add terminal entries.");
      return;
    }
    
    journals.forEach((j, i) => {
      this._appendToTerminal(terminal, `${j.index}. ${j.name}`);
    });
  }

  async _accessJournalByIndex(index, terminal) {
    const journals = this._getAvailableJournals();
    const journal = journals.find(j => j.index === index);
    
    if (!journal) {
      this._appendToTerminal(terminal, `No entry found with index ${index}.`);
      return;
    }
    
    const journalEntry = game.journal.get(journal.id);
    if (!journalEntry) {
      this._appendToTerminal(terminal, "Error: Journal entry not found in the system.");
      return;
    }
    
    this._appendToTerminal(terminal, `Loading: ${journal.name}...`);
    this._appendToTerminal(terminal, "-----------------------------------------");
    
    try {
      // Check if journal has pages first
      if (journalEntry.pages && journalEntry.pages.size > 0) {
        // Get the first page
        const firstPage = journalEntry.pages.contents[0];
        if (firstPage && firstPage.text) {
          const journalContent = await TextEditor.enrichHTML(firstPage.text.content || "No content available.", {async: true});
          terminal.append(`<div class="journal-content">${journalContent}</div>`);
        } else {
          this._appendToTerminal(terminal, "This entry has no readable content.");
        }
      } else {
        // Fall back to legacy journal format for compatibility
        const journalContent = await TextEditor.enrichHTML(journalEntry.data.content || "No content available.", {async: true});
        terminal.append(`<div class="journal-content">${journalContent}</div>`);
      }
    } catch (error) {
      console.error("MoSh-ShipConsole | Error rendering journal:", error);
      this._appendToTerminal(terminal, "Error rendering journal content.");
    }
    
    this._appendToTerminal(terminal, "-----------------------------------------");
    this._appendToTerminal(terminal, "Type 'menu' to return to the main menu.");
  }
}
