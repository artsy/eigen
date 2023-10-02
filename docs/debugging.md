# Debugging

There are multiple tools available to help you debug your app. This document will cover our preferred tools and how to use them.

Our debugging tool of choice for mostly everything is [Flipper](https://fbflipper.com/) but we also use the following:

- [Flipper](https://fbflipper.com/)
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [VSCode](https://blog.logrocket.com/debugging-react-native-vs-code/)

If you want to debug with breakpoints or open the inspector find out how to open the dev menu and what it does [here](./dev_menu.md).

## Flipper

Flipper is a platform for debugging iOS, Android and React Native apps. Visualize, inspect, and control your apps from a simple desktop interface. Use Flipper as is or extend it using the plugin API.

[This article](https://blog.logrocket.com/debugging-react-native-apps-flipper/) is also a great resource for learning how to debug with Flipper.

### Installation

1. Install [Flipper](https://fbflipper.com/): `$ brew update && brew install --cask flipper`.
2. Now when you spawn an emulator/simulator it will automatically connect to it.

### Plugins that we use

- [Advanced Async Storage](https://github.com/lbaldy/flipper-plugin-async-storage-advanced) - Inspect and modify AsyncStorage values.
- [Relay Dev Tools](https://github.com/th3rdwave/flipper-plugin-relay-devtools) - Visualize Relay data store.
- [Redux Debugger](https://github.com/jk-gan/redux-flipper) - Inspect Redux state.
- [Performance Monitoring](https://github.com/bamlab/react-native-flipper-performance-monitor) - Performance Monitoring (read this [great article](https://www.bam.tech/article/measuring-and-improving-performance-on-a-react-native-app) on how to use)

You can find more about how to install them on the next section.

### Installing Flipper Plugins

Flipper has a number of community-built plugins that you can use to enhance your debugging experience. To install a Flipper plugin, follow these steps:

Open Flipper and click on the `Plugin Manager` button on the left toolbar.

In the `Plugin Manager` window, you'll see a list of all the available Flipper plugins. Search and find the plugin you want to install and click the Install button next to it.

Flipper will download and install the plugin for you. Once the installation is complete, you'll be prompted to restart Flipper to activate the plugin.

You may also need to enable the plugin, open the disabled tab, find the plugin you installed and while hovering over it you're going to see a `+` button, click it to enable the plugin.

After restarting Flipper, you should be able to see the plugin in the Plugins menu.

Some plugins may require additional configuration or setup steps. Please consult the documentation or contact `#practice-mobile` with any questions.

### Debugging on device for iOS

In order to debug using flipper on device for iOS you will need a tool called idb.
Instructions for installing are here: https://github.com/facebook/idb#idb-client
You will want both the `idb-companion` and the `idb-client`.

Once that is installed find the path to idb:
`$ which idb`

In flipper settings make sure the debug on device toggles are set for iOS and paste the path into the
`IDB Binary location` field:
![idb-settings](https://github.com/artsy/eigen/assets/49686530/3bd26f39-bc1d-4d16-8825-477b2807126e)

Apply the settings and build and run the app on device and you should be able to debug using Flipper!

## Breakpoints

To enable breakpoints, you need to **Start Remote JS Debugging** from the **In-App Developer menu**

You can either use VSCode debugging, Chrome debugging or RN Debugger for this.

### Dynamic

To set breakpoints from the Chrome Developer Tools, open the ‘Go to source’ menu (<kbd>⌘P</kbd>), search for the
file you’d like to set a breakpoint in, and set the breakpoint by clicking the gutter bar at the desired line.

### From code

In some situations that require very specific conditions, it’s easier to break by inserting an instruction in your code.
For this you can use the `debugger` keyword, e.g.

```ts
if (someCondition && anotherCondition) {
  debugger
}
```

### All exceptions

It’s possible to break on any thrown exception by selecting ‘Pause On Caught Exceptions’ from the ‘Sources’ tab.

## GraphQL queries

Relay will log debugging info for each query it performs in the ‘Console’ tab:

![screen shot 2017-05-03 at 09 10 30](https://cloud.githubusercontent.com/assets/2320/25651038/1f313b84-2fe1-11e7-98ca-71c431946a53.png)

However, like any other networking, the raw request/response information can be made available from the ‘Network’ tab by
[enabling the Network Inspector](https://github.com/jhen0409/react-native-debugger/blob/master/docs/network-inspect-of-chrome-devtools.md)
from the React Native Debugger app’s contextual menu:

![screen shot 2017-05-03 at 09 15 11](https://cloud.githubusercontent.com/assets/2320/25651045/293100c4-2fe1-11e7-83a6-728d2d3c14f9.png)

If you need to debug the query, copy the `query` and `variables` into GraphiQL (sometimes it’s easier to copy these
values by clicking ‘view source’ next to the ‘Request Payload section):

![screen shot 2017-05-03 at 09 20 11](https://cloud.githubusercontent.com/assets/2320/25651143/ba80c79e-2fe1-11e7-9954-ab17d7da6310.png)

## Standalone debugger app

You can use React Native debugger which is a standalone app to inspect views as well as the standard Chrome Dev Tools.
It is highly recommended over the normal Chrome Dev Tools.

1. Install [RN debugger](https://github.com/jhen0409/react-native-debugger): `$ brew update && brew install --cask react-native-debugger`.
2. There is no step 2. Now when you run `$ yarn start` it will automatically use the standalone app.

![screen shot 2017-01-23 at 1 00 01 pm](https://cloud.githubusercontent.com/assets/296775/22220775/09bb10ec-e17e-11e6-8801-3b0ccbdbaa84.png)
