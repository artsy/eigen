# Using Visual Studios Code with Emission

### Getting Set Up

1. [Install VS Code](https://code.visualstudio.com).
2. Install the React Native CLI, globally: `npm install -g react-native-cli`
1. Install the [React Native Tools](https://github.com/Microsoft/vscode-react-native) extension.
1. Next install these extensions: ESLint, View Node Package, Flow Language Support, npm Intellisense, Spelling and Grammar Checker.
1. In order to launch VSCode from your terminal, in VS Code install the command line tools via the command: "Install 'code' command in PATH"/

Note, if you are using [nvm](https://github.com/creationix/nvm), I strongly recommend always opening VS code from the terminal to ensure all the environment variables are correct.

### Terminology - Commands / Extensions / Tasks

A command is a one off thing the editor can do, press  `cmd + shift + p` to bring up a list, then type the one you want.

An extension is a way to add specific features to the editor, you can run the command "Install Extensions" to start installing new ones.

A task is a customizable command that is set up per-project.

### Theming interlude

The default theme for VS Code is pretty intense, if you're a light theme kind of person. I would recommend switching to "Light (Visual Studio)", via the "Change Theme" command.

![https://github.com/artsy/emission/blob/master/docs/choose-theme.png?raw=true](https://github.com/artsy/emission/blob/master/docs/choose-theme.png?raw=true)

This screenshot also includes a code font with JS ligatures, called [Fira Code](https://github.com/tonsky/FiraCode).

### Starting React-Native Services

You need to run two services. These get tied to your VS Code window, so when you close the window, the processes will be closed too.

* With all React-Native apps, you need to run the packager. The packager's job is to transpile code, and to track changes for hot-reloading.
* To be able to use Storybook, you need to run the Storybook server.

Both these services will get launched with `Tasks: Run Build Task`, or `cmd + shift + b`. To show/hide these logs, press `cmd + j`.

### Debugging

You should now have a fully working version of the development environment. You can press `f5` (or set `cmd + r` to do it (see below)) to launch Emission into an Xcode simulator. You have access to all of the [VSCode debugging tools](https://code.visualstudio.com/Docs/editor/debugging). Notably a useful console, and breakpoints.

_Note:_ You can still launch Chrome as a JS debugger from inside the app if you need to use that for something. This should obviate a lot of the need for it though.

### Linting

We use [ESLint](http://eslint.org), a tool that let's us define what our JavaScript should look like. Assuming you installed the extension you will see underlines in your code in VS Code.

To make changes with the keyboard, press `cmd + .` to have it ESLint make changes automatically for that one issue.

To fix all fixable issues on the current file, use the command "ESLint: Fix All Fixable Issues."

### Flow

In order to get all of the auto-complete magic, you will need to have Flow installed. Flow let's you take a function like:

```js
function foo(one, two, three) {}
```
And write it as:

```js
function foo(one: any, two: number, three?): string {}
```

This can improve VS Code's autocompletion and ability to jump between objects quickly. As well as offer useful insight about accidental type coercion and nullability through static analysis. Most of the time the types can be inferred completely automatically, however sometimes you may need to [do it yourself](https://github.com/artsy/emission/commit/e5135618b0c8d10d23e64ea0a6ce5d35c0e4af95#diff-2f5aa3c37ef9f2653a0096c9f8344357R45).

One of the interesting things about types in Flow, are that like Objective-C there are literal and reference types. Think `NSInteger` vs `NSNumber`. So you should be writing `string` not `String`, as the lowercase variant is the value and `String` is a specific type of class. For details there, [see the guide on built-in types](https://flowtype.org/docs/builtins.html).

The most notable thing you will spot using Flow is that you have to declare what your `state` looks like, [see an example](https://github.com/artsy/emission/commit/e5135618b0c8d10d23e64ea0a6ce5d35c0e4af95#diff-84358beb6307a90d292cb841ec4ad693R30).  Flow also enforces string enums, so if an API says that it only supports a few string values, you will see errors there. This is covered well in the [React section of the Flow guides](https://flowtype.org/docs/react.html).

_Note:_ React Native decides what part of what languages are exposed to us. This list you can find the [raw values here](https://github.com/facebook/react-native/blob/master/babel-preset/configs/main.js#L13). A human-readable version [is here](http://facebook.github.io/react-native/docs/javascript-environment.html). If you want the TLDR, you should use types as much as possible from Flow. React-Native [strips](http://babeljs.io/docs/plugins/transform-flow-strip-types/) those during transpliation.

### Jump to Symbols

VS Code uses Typescript under the hood to figure out all of the symbols.

```sh
npm install typings --global
typings install
```

This currently will give you type data for react, react-native, lodash and jest. You can see an up-to-date list in [../typings.json](../typings.json).

### Recommended Changes for Keyboard Shortcuts

To get an Xcode-like feel for running Emission, it's recommended that you add these key commands to your `keybindings.json`.  To edit your keybindings, use `cmd + shift + p` and type `key` - choose "Open Keyboard Shortcuts."

``` json
    { "key": "cmd+r",  "command": "workbench.action.debug.start" },
```

This means you use `cmd+r` to start up emission in a iOS simulator. It's the same pattern from Xcode. Pressing it again will re-compile, and restart the app.

### Useful bits of VS Code

* To jump between splits, use `cmd + 1` and `cmd + 2`.
* To navigate left/right through all tabs, use `cmd + alt + left` and `cmd + alt + right`. I remap these to be the same as most macOS apps: `ctrl + shift + [` and `ctrl + shift + ]`.
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

