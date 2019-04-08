# Using Visual Studios Code with Emission

### Getting Set Up

1. [Install VS Code](https://code.visualstudio.com).
1. When you open VS Code in emission for the first time, it will offer some extensions to use, install them all.
1. In order to launch VS Code from your terminal, in VS Code install the command line tools via the command: "Install 'code' command in PATH".

### Terminology - Commands / Extensions / Tasks

A command is a one off thing the editor can do, press  `cmd + shift + p` to bring up a list, then type the one you want.

An extension is a way to add specific features to the editor, you can run the command "Install Extensions" to start installing new ones.

A task is a customizable command that is set up per-project.

---

Specifics for people coming from the mobile world:

### Recommended Changes for Keyboard Shortcuts

To get an Xcode-like feel for running Emission, it's recommended that you add these key commands to your `keybindings.json`.  To edit your keybindings, use `cmd + shift + p` and type `key` - choose "Open Keyboard Shortcuts."

``` json
    { "key": "cmd+r",  "command": "workbench.action.debug.start" },
```

This means you use `cmd+r` to start up emission in a iOS simulator. It's the same pattern from Xcode. Pressing it again will re-compile, and restart the app.

### Useful bits of VS Code

* To jump between splits, use `cmd + 1` and `cmd + 2`.
* To navigate left/right through all tabs, use `cmd + alt + left` and `cmd + alt + right`. I remap these to be the same as most macOS apps: `cmd + shift + [` and `cmd + shift + ]`.
  ```json
    { "key": "cmd+shift+[",       "command": "workbench.action.previousEditor" },
    { "key": "cmd+shift+]",       "command": "workbench.action.nextEditor" },

  ```
* To jump between open tabs in tab group (each side of a split for example) a use `ctrl + tab`.
* `cmd + shift + y` is also the "Show Debug Console" as it is in Xcode.
* The Fira Code font improves readability, install the font then add these to your user settings.
  ```json
    "editor.fontFamily": "Fira Code",
    "editor.fontSize": 16,
    "editor.fontLigatures": true,
  ```
* To bring back Xcode's rename all in scope command, use this keybinding:
  ```json
    { "key": "ctrl+cmd+e",       "command" : "editor.action.changeAll" }
  ```

#### All Keybindings ATM

```json
// Place your key bindings in this file to overwrite the defaults
[
    { "key": "ctrl+cmd+left",      "command": "workbench.action.navigateBack" },
    { "key": "ctrl+cmd+right",     "command": "workbench.action.navigateForward" },
    { "key": "cmd+e",              "command": "editor.action.addSelectionToNextFindMatch"},
    { "key": "cmd+t",              "command": "workbench.action.quickOpen" },
    { "key": "cmd+r",              "command": "workbench.action.debug.start", "when": "!inDebugMode" },
    { "key": "cmd+r",              "command": "workbench.action.debug.restart", "when": "inDebugMode" },
    { "key": "cmd+shift+.",        "command": "workbench.action.debug.stop" },
    { "key": "cmd+shift+[",        "command": "workbench.action.previousEditor" },
    { "key": "cmd+shift+]",        "command": "workbench.action.nextEditor" },
    { "key": "ctrl+cmd+e",         "command": "editor.action.changeAll"},
    { "key": "cmd+1",              "command": "workbench.view.explorer" },
    { "key": "cmd+2",              "command": "workbench.view.search" },
    { "key": "cmd+3",              "command": "workbench.view.git" },
    { "key": "cmd+4",              "command": "workbench.view.debug" },
    { "key": "cmd+5",              "command": "workbench.view.extensions" },
    { "key": "cmd+shift+t",        "command": "workbench.action.tasks.runTask" },
    { "key": "cmd+0",                 "command": "workbench.action.toggleSidebarVisibility" },
]
```

