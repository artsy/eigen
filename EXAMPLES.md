<!-- Template

## What I am trying to do.

Short comment on how we do things and any preferences.

Links:
- [link 1](path/to/file1)
- [link 2](path/to/file2)

-->

👀 See comment on top of file for template.

## I want to write a test.

- We use `@testing-library/react-native` and our helper `renderWithWrappers` (or `renderWithRelayWrappers` if it's a relay test, but look further down for more examples of relay tests).
- We refer to this guide 👉 [How should I query?](https://callstack.github.io/react-native-testing-library/docs/how-should-i-query/) from `@testing-library/react-native` for querying components

Links:

- [CustomSizeInputs.tests.tsx](src/app/Components/ArtworkFilter/Filters/CustomSizeInputs.tests.tsx)
- [SizesOptionsScreen.tests.tsx](src/app/Components/ArtworkFilter/Filters/SizesOptionsScreen.tests.tsx)
- [Search.tests.tsx](src/app/Scenes/Search/Search.tests.tsx)

## I want to write a test with relay.

This is an example of a good relay test with hooks.
- Notice we use `async`, in preparation to the await calls later.
- First thing, we use `renderWithRelayWrappers` to render the component.
- Assuming the component (here `SearchScreen`) fires a relay request, we then use `resolveMostRecentRelayOperation` to mock the resolution of the request.
- Right after that, we `await` with `waitForSuspenseToBeRemoved` or `waitForElementToBeRemoved` for the Suspense wrapper to unmount, and our component to render our regular screen with the newly resolved relay data.
Example usages:
```ts
  await waitForSuspenseToBeRemoved("search-placeholder") // this is a `testID` on a placeholder component
// OR
  await waitForSuspenseToBeRemoved() // this will wait for the global test Suspense to go away. Normally it renders a text with `TEST-SUSPENSE-LOADING`, so we can recognize it.
// OR
  await waitForElementToBeRemoved(() => screen.getByText("Loading your data..")) // :warning: Notice the arrow function. Here we wait for any other element we can find using any of the testing-library queries.
```
- Finally, we add our `expect`ations! We can query and verify whatever we like after this point.
```ts
it("does not show city guide entrance when on iPad", async () => { // Here we use `async`.
  renderWithRelayWrappers(<SearchScreen />) // Here we render! A request will fire.

  resolveMostRecentRelayOperation({ // resolving the request.
    Query: () => ({
      system: {
        algolia: {
          appID: "",
          apiKey: "",
          indices: [{ name: "Artist_staging", displayName: "Artists", key: "artist" }],
        },
      },
    }),
  })
  await waitForSuspenseToBeRemoved("search-placeholder") // And now we wait..

  expect(screen.queryByText("City Guide")).toBeFalsy() // Verifing things.
})
```

Look at https://github.com/artsy/relay-workshop for a more tutorials of how we use relay and test with it.

> :warning: Note: Code with relay hooks, needs `renderWithRelayWrappers`, code with old relay components (`QueryRenderer` etc) needs `renderWithWrappers`. All new code should be using relay hooks. When converting old relay code to relay hooks, make sure to swap `renderWithWrappers` for `renderWithRelayWrappers`.

Links:

- [Search.tests.tsx](src/app/Scenes/Search/Search.tests.tsx) (with hooks)
- [ArtistSavedSearch.tests.tsx](src/app/Scenes/Artist/ArtistSavedSearch.tests.tsx) (with relay QueryRenderer)

## I want to add some global state, doesn't need to be persisted.

We use `easy-peasy` for global state, and for non-persisted state we use something called `sessionState`. This can be in any model. If your global state is something small, you could add it in [GlobalStoreModel.ts](src/app/store/GlobalStoreModel.ts) as part of the `sessionState` there, or you could create a new Model like [ToastModel.ts](src/app/store/ToastModel.ts) that only uses non-persisted state, therefore only `sessionState`.

Links:

- [GlobalStoreModel.ts](src/app/store/GlobalStoreModel.ts#L32)
- [ToastModel.ts](src/app/store/ToastModel.ts#L16)

## I want to add some global state, should be persisted.

Similar to above, but if we want to persist, we put our state outside the `sessionState`. If your state fits in one of our existing Models in [lib/store](src/app/store), you can use that. If it's a separate enough thing, then you can add a new Model, the [VisualClueModel.ts](src/app/store/VisualClueModel.ts) is a good example. The state in that model will be persisted.

When changing/adding/removing persisted state, you **must create a migration!** For more info, look for a migration example in this file, and look at the [adding_state_migrations.md](docs/adding_state_migrations.md) docs.

Links:

- [VisualClueModel.ts](src/app/store/VisualClueModel.ts)

## I want to add a migration for changed/added/removed global state.

Global state that is persisted needs migrations when you change/add/remove anything. That's so that the app can do any necessary preparation to the persisted storage then the app is launched, to make sure the app is in a consistent state.

There is documentation in [adding_state_migrations.md](docs/adding_state_migrations.md), but here are the main steps are:

- Add a new version in `Versions` in [migration.ts](src/app/store/migration.ts).
- Change the `CURRENT_APP_VERSION` in [migration.ts](src/app/store/migration.ts).
- Add a migration in `artsyAppMigrations` in [migration.ts](src/app/store/migration.ts).
- Add a test for your migration in [migration.tests.ts](src/app/store/migration.tests.ts) similar to the ones we have in there.

Links:

- [migration.ts](src/app/store/migration.ts).
- [migration.tests.ts](src/app/store/migration.tests.ts)

## I want to add a dev-only tool to the app.

We call these "Dev Toggles", and you can find them in the Dev Menu close to the bottom of the screen.

The code for them is in [features.ts](src/app/store/config/features.ts). Their key starts with `DT` as an homage to the ObjC style of naming things, and the letters specifically stand for "Dev Toggle".

You can easily add a new one, and it will appear in the Dev Menu. Then you can use they in code using `useDevToggle`.

Links:

- [features.ts](src/app/store/config/features.ts)

## I want to make a new screen.

We use `Screen` and friends for that. They come from palette. Some of the building blocks are: `Screen`, `Screen.Body`, `Screen.Header`, `Screen.FloatingHeader`, `Screen.Background`, `Screen.BottomView`, `Screen.BodyXPadding`, `Screen.SafeBottomPadding`.

You can find examples in [Screen.stories.tsx](src/palette/organisms/screenStructure/Screen.stories.tsx). You can also find actual screens using these, like [OnboardingWelcome.tsx](src/app/Scenes/Onboarding/OnboardingWelcome.tsx), [OnboardingSocialPick.tsx](src/app/Scenes/Onboarding/OnboardingSocialPick.tsx), [OnboardingLogin.tsx](src/app/Scenes/Onboarding/OnboardingLogin.tsx).

Links:

- [Screen.stories.tsx](src/palette/organisms/screenStructure/Screen.stories.tsx)
- [OnboardingWelcome.tsx](src/app/Scenes/Onboarding/OnboardingWelcome.tsx)
- [OnboardingSocialPick.tsx](src/app/Scenes/Onboarding/OnboardingSocialPick.tsx)
- [OnboardingLogin.tsx](src/app/Scenes/Onboarding/OnboardingLogin.tsx)

## I want to make a form.

We use formik for forms.

One good example is in [OnboardingLogin.tsx](src/app/Scenes/Onboarding/OnboardingLogin.tsx). You can use `useFormik` with all the props and options, and then use the returned `f` to assign to values and props of your inputs and buttons.

Links:

- [OnboardingLogin.tsx](src/app/Scenes/Onboarding/OnboardingLogin.tsx)
