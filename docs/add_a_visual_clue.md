# Deprecation info

Visual clue deviated a little from the simplistic idea of progressive onboarding as we have in Force.
We adopted a simpler form with the Progressive Onboarding store, please check the [doc](./add_progressive_onboarding.md) for more information how to use it.

# Adding a New Visual Clue

To add a visual clue to the app, you will need to do the following:

1. In the file `visualClues.ts` add your new visual clue.

```diff
   // ExampleClueName: {
   //   description: "Lorem ipsum dolor sit amet,  consectetur adipiscing elit",
   // },
+  NewVisualClue: {
+    description: "My New Visual Clue",
+  },
```

2. Add the visual clue dot to the correct bottom tab in `BottomTabs.tsx`.

```diff
-   <BottomTabsButton tab="home" />
+   <BottomTabsButton tab="home" visualClue="NewVisualClue" />

```

3. Add the visuel clue text to the correct `Tabs` tab.

```diff
const { showVisualClue } = useVisualClue()

<Tabs indicators=[{ tabName: "home", Component: () => showVisualClue("NewVisualClue") ? <VisualClueText /> : null  }]>
  <Tabs.Tab name="home" label="Home">...</Tabs.Tab>
</Tabs>
```

Alternatively, you can add the visual clue to a text element and programmatically mark the hint as seen.

```diff
  const { showVisualClue } = useVisualClue()

return(
  <Text>Some Text</Text>
+ {!!showVisualClue("NewVisualClue") && <VisualClueText style={{ top: 14, right: -36 }} />}
)
```

```diff
  // The component that renders the new feature
+ useEffect(() => {
+    setVisualClueAsSeen("NewVisualClue")
+ }, [])
)
```

# Session Clues

Session clues are visual cues that can be shown when an event happened. They are not supposed to be added to `visualClues.ts` and can show up multiple times. To show a session clue you can add them with `addClue("SessionClue")` anywhere in the code and mark them as seen with `setVisualClueAsSeen("SessionClue")`.

```jsx
  const { showVisualClue } = useVisualClue()

  {!!showVisualClue("MyNewVisualClue") && <JSXComponent />}

  // show visual cue
  ...
  addClue("MyNewVisualClue")
  ...

  // mark visual cue as seen
  setVisualClueAsSeen("MyNewVisualClue")

```
