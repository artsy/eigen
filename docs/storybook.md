### Storybook

## Add to storybook

1. Add your NewComponent.tsx to palette inside NewComponent folder
2. Create NewComponent.stories.tsx and add the NewComponent stories
3. Inside your NewComponent folder create index.tsx and `export * from './NewComponent'`
4. In src/storybook/storyLoader.js

```
function loadStories() {
...
+ require("../palette/elements/NewComponent/NewComponent.stories")
...
}

const stories = [
...
+ /palette/elements/NewComponent/NewComponent.stories
...

]
```

We use [Storybook](https://storybook.js.org/tutorials/intro-to-storybook/react-native/en/get-started/) to build and display our UI components in isolation.

**Run Storybook server**

Opens a web server and browser UI that runs alongside the simulator.

```
yarn storybook-server
```

**Run Storybook as standalone app**

Opens Storybook without loading the entire app (instead of `yarn start`).

```
yarn start-storybook
```

The screen can also be opened from the admin menu.

**Run Storybook**

Opens storybook as a screen in the app.

```
yarn storybook-ios
yarn storybook-android
```

**Adding new storybook stories**

Make a file next to the file you want to make stories for, for example, if you want to make stories for `Checkbox.tsx`, make a file called `Checkbox.stories.tsx` next to it.

You can look for other stories files for reference, but the main structure is:

```tsx
storiesOf("Checkbox", module)
  .add("A Story Name", () => <Checkbox someProp="wow" />)
  .add("Another Story Name", () => <Checkbox otherProps="NICE" />)
```
