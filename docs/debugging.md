# Debugging

React Native relies on the debugger that’s part of the Chrome Developer Tools. To enable it:

1. Run the app in the simulator.
2. Simulate a ‘shake’ event (<kbd>^⌘Z</kbd>), which will bring up the dev menu.
3. Choose the ‘Debug JS Remotely’ option, which should open Chrome.
4. In the new Chrome window, open the Developer Tools (<kbd>⌘⌥J</kbd>).

## Breakpoints

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

1. Install [RN debugger](https://github.com/jhen0409/react-native-debugger): `$ brew update && brew cask install react-native-debugger`.
2. There is no step 2. Now when you run `$ yarn start` it will automatically use the standalone app.

![screen shot 2017-01-23 at 1 00 01 pm](https://cloud.githubusercontent.com/assets/296775/22220775/09bb10ec-e17e-11e6-8801-3b0ccbdbaa84.png)
