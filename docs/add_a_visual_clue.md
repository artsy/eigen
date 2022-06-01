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

3. Add the visuel clue text to the correct `StickyTabPage` tab.

```diff
<StickyTabPage
  tabs={[
    {
      title: "Tab Title",
      content: <TabContent />,
+     visualClues: [
+       {
+         jsx: <VisualClueText />,
+         visualClueName: "NewVisualClue",
+       },
+     ],
    },

  ]}
/>
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
