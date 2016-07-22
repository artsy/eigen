# Using Visual Studios Code with Emission

### Getting Set Up

1. [Install VS Code](https://code.visualstudio.com).
1. Install the [React Native Extension](https://github.com/Microsoft/vscode-react-native)
1. Next install these extensions: ESLint, View Node Package, Flow Language, Spelling and Grammar Checker.
1. Install the command line tools via the command: "Install 'code' command in PATH"/

Note, if you are using [nvm](https://github.com/creationix/nvm), I strongly recommend always opening VS code from the terminal to ensure all the environment variables are correct.

### Commands / Extensions / Tasks

A command is a one off thing the editor can do, press  `cmd + shift + p` to bring up a list, then type the one you want.

An extension is a way to add specific features to the editor, you can run the command "Install Extensions" to start installing new ones.

A task is a customizable command that is set up per-project.

### Starting React-Native Services

_note:_ this is not 100% where I want this, but it's at a "works well" stage. I'd like to turn these into one command eventually.

You need to run two services. These get tied to your VS Code window, so when you close the window, the processes will be closed too.

With all React-Native apps, you need to run the packager. The packager's job is to transpile code, and to track changes for hot-reloading. To run the packager, use the command - "React: Start Packager".

You should be writing stories for your components, to ensure the storybook server is running you need to run the storybook task. To run this use the command "Run Task" press enter, then "Start Storyboard Server".

To show/hide these logs, press `cmd + j`.

Summary, ensure:

* Packager is running - "React: Start Packager"
* Storybooks is running - "Run Task" - "Start Storyboard Server"

### Debugging

You should now have a fully working version of the development environment. You can press `f5` (or set `cmd + r` to do it (see below)) to launch Emission into an Xcode simulator. You have access to all of the [VSCode debugging tools](https://code.visualstudio.com/Docs/editor/debugging). Notably a useful console, and breakpoints.

_Note:_ You can still launch Chrome as a JS debugger from inside the app if you need to use that for something. This should obviate a lot of the need for it though.

### Recommended Changes for Keyboard Shortcuts

To get an Xcode-like feel for running Emission, it's recommended that you add these key commands to your `keybindings.json`.  To edit your keybindings, use `cmd + shift + p` and type `key` - choose "Open Keyboard Shortcuts."

``` json
    { "key": "cmd+r",  "command": "workbench.action.debug.start" },
```

This means you use `cmd+r` to start up emission in a iOS simulator. It's the same pattern from Xcode. Pressing it again will re-compile, and restart the app.

### Useful bits of VS Code

* To jump between splits, use `cmd + 1` and `cmd + 2`.
* To navigate left/right through all tabs, use `cmd + alt + left` and `cmd + alt + right`. I remap these to be the same as most macOS apps: `ctrl + shit + [` and `ctrl + shit + ]`.
  ```json
    { "key": "cmd+shift+[",       "command": "workbench.action.previousEditor" },
    { "key": "cmd+shift+]",       "command": "workbench.action.nextEditor" },

  ```
* To jump between open tabs in tab group (each side of a split for example) a use `ctrl + tab`.
* `cmd + shift + y` is also the "Show Debug Console" as it is in Xcode.
