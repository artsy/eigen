# Using Visual Studios Code with Emission

### Getting Set Up

1. [Install VS Code](https://code.visualstudio.com).
1. Install the [React Native Extension](https://github.com/Microsoft/vscode-react-native)
1. Next install these extensions: ESLint, View Node Package, Flow Language, npm Intellisense, Spelling and Grammar Checker.
1. Install the command line tools via the command: "Install 'code' command in PATH"/

Note, if you are using [nvm](https://github.com/creationix/nvm), I strongly recommend always opening VS code from the terminal to ensure all the environment variables are correct.

### Terminology - Commands / Extensions / Tasks

A command is a one off thing the editor can do, press  `cmd + shift + p` to bring up a list, then type the one you want.

An extension is a way to add specific features to the editor, you can run the command "Install Extensions" to start installing new ones.

A task is a customizable command that is set up per-project.

### Theming interlude

The default theme for VS Code is pretty intense, if you're a light theme kind of person. I would recommend switching to "Light (Visual Studio)", via the "Change Theme" command.

![https://github.com/artsy/emission/blob/master/docs/choose-theme.png?raw=true](https://github.com/artsy/emission/master/flow/docs/choose-theme.png?raw=true)

This screenshot also includes a code font with JS ligatures, called [Fira Code](https://github.com/tonsky/FiraCode).

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

TODO: Decide re:typings.

```sh
npm install typings --global
```

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