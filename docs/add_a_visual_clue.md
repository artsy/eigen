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

2. Add the visual clue dot to the correct bottom tab.

```diff
-   <BottomTabsButton tab="home" />
+   <BottomTabsButton tab="home" visualClue="NewVisualClue" />

```

3. Add the visual clue text to the correct place in the app.

```diff
  const { showVisualClue } = useVisualClue()

return(
  <Text>Some Text</Text>
+ {!!showVisualClue("NewVisualClue") && <VisualClueText style={{ top: 14, right: -36 }} />}
)
```

4. Mark the clue as seen in the correct place in the app (e.g. a component).

```diff
  // The component that renders the new feature
+ useEffect(() => {
+    setVisualClueAsSeen("NewVisualClue")
+ }, [])
)
```
