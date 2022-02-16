# :world_map: Preferred Practices

This is a living document, expected to be updated regularly, a broad overview of the history and how we prefere to do things on eigen. Here you can find links to

- Tools we use
- Examples
- Pull requests with interesting discussions
- Blog posts

## Contents

- [Examples and Hacks](#examples-and-hacks)
- [History](#history)
- [TypeScript](#TypeScript)
- [File Structure Organization](#file-structure-organization)
- [Relay](#relay)
- [Prefer Relay containers (Higher Order Components) over Hooks](#prefer-relay-containers--higher-order-components--over-hooks)
- [styled-system / styled-components](#styled-system---styled-components)
- [Write unit tests for new components](#write-unit-tests-for-new-components)
- [Use the Native Switchboard for Navigation (for now...)](#use-the-native-switchboard-for-navigation--for-now-)
- [Analytics](#analytics)
  - [Follow the tracking docs and examples](#follow-the-tracking-docs-and-examples)
- [Miscellaneous](#miscellaneous)

### Examples & Hacks

Check out our list of [examples](#../../../EXAMPLES.md) and [hacks](#../../../HACKS.md)

### History

The app was initially written in Objective-C and Swift and React Native was added in 2016. Some parts of the app are also written with Kotlin.

New features should be built in React Native. Swift and Kotlin should only be used for "glue" code, or native functionality that is impossible to implement with React Native. Objective-C should be avoided.

- [Why Artsy uses React Native](http://artsy.github.io/blog/2016/08/15/React-Native-at-Artsy/)
- [All React Native posts on Artsy's Engineering Blog](http://artsy.github.io/blog/categories/reactnative/)
- Some great React Native components:
  // (should we update those? suggestions are welcome!)
  - [Partner](https://github.com/artsy/eigen/blob/main/src/lib/Scenes/Partner/Partner.tsx) is a simple top-level component.
  - [PartnerShows](https://github.com/artsy/eigen/blob/main/src/lib/Scenes/Partner/Components/PartnerShows.tsx) is a fragment container that uses FlatList to paginate through Relay data.
  - [Search](https://github.com/artsy/eigen/blob/main/src/lib/Scenes/Search/Search.tsx) is a functional component that loads data in response to user input.

We used to have many different `renderX` functions throughout our components, but today we prefer to have a single `render()` function in a component. [See this PR](https://github.com/artsy/eigen/pull/3220) for our rationale and a comparison of approaches.

### TypeScript

We use TypeScript to maximize runtime code safety & prevent runtime bugs. In April 2020, we adopted [TypeScript's `strict` mode](https://github.com/artsy/eigen/pull/3210).

This disables "implicit any" and require strict null checks. The change left a lot of comments like this throughout the codebase:

```ts
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
```

Our goal is to reduce the number of `STRICTNESS_MIGRATION` migrations checks to zero over time. We use CI tooling to require PRs never to increase the number. You can opt in to helping out by requiring _all_ the files you change to fix all the migration comments by running the following command:

```sh
touch .i-am-helping-out-with-the-strictness-migration
```

### File Structure Organization

The React Nativa parts of the app live in `src/` and most of our components on `lib/`.
Within this folder things can be a bit of a mess and we are working on improving that.

Files that export a component end in `.tsx`, files that don't export a component end in `.ts` by default.

We use **PascalCase** for **Components and Component Folders**, but keep everything else within the Component folder(eg. mutations, state, utils) **camelCase**.
Test files follow the same pattern.

For example `mutations`, `routes`, `state` would be **camelCase** folders, while `MyComponent.tsx` would be a **PascalCase** file.

```
├── MyComponentFolder
│   ├── MyComponent.tsx
│   ├── MyComponent.tests.tsx
│   ├── mutations
│   |  ├── mutationFunction.ts
│   ├── state
│   |  ├── stateFunction.ts
│   ├── utils
│   |  ├── utilFunction.ts
│   |  ├── utilFunction.tests.ts
├── …
```

Another example is:

If we have a `buttons` folder which exports many button components, we keep it **lowercase**.

```
├── buttons
│   ├── RedButton.tsx
│   ├── GreenButton.tsx
│   ├── YellowButton.tsx
│   ├── buttons.tests.tsx
│   ├── buttons.stories.tsx
├── …
```

However, if we have a `Button` folder which exports only one button component, we write that with in **PascalCase**.

```
├── Button
│   ├── Button.tsx
│   ├── Button.tests.tsx
│   ├── Button.stories.tsx
```

`Note:` Updating capitalisation on folders can cause issues in git and locally so please refrain from renaming existing folders until we come up with a strategy about this. (TODO)

### Relay

[Metaphysics](https://github.com/artsy/metaphysics) is Artsy's GraphQL server. Requests to Metaphysics are made through [Relay](https://relay.dev).

- [Why Artsy uses Relay](http://artsy.github.io/blog/2017/02/05/Front-end-JavaScript-at-Artsy-2017/#Relay)
- [Artsy's Relay Workshop](https://github.com/artsy/relay-workshop)
- Collections
  // should we update these links?
  - [A top-level Relay component](https://github.com/artsy/eigen/blob/39644610eb2a5609d992f434a7b37b46e0953ff4/src/lib/Scenes/Collection/Collection.tsx)
  - [A fragment container](https://github.com/artsy/eigen/blob/39644610eb2a5609d992f434a7b37b46e0953ff4/src/lib/Scenes/Collection/Components/FeaturedArtists.tsx)
    We recently also started using relay-hooks and will soon link documents to that.

#### Prefer Relay hooks over relay containers (Higher Order Components)

Refactoring old containers to use hooks is encouraged.

// Add or link to examples with of files using relay hooks here

### styled-system / styled-components

// !! is this still valid?

- Our use of [styled-components](https://www.styled-components.com) was supplemented by [styled-system](https://github.com/jxnblk/styled-system) in [#1016](https://github.com/artsy/emission/pull/1016).
- [Example pull request migrating a component from styled-components to styled-system](https://github.com/artsy/emission/pull/1031)

### Unit tests

- We prefer `react-test-render` over `enzyme`, and would ultimately like to remove `enzyme`.
- We prefer `relay-test-utils` over our existing [`MockRelayRenderer`](https://github.com/artsy/eigen/blob/39644610eb2a5609d992f434a7b37b46e0953ff4/src/lib/tests/MockRelayRenderer.tsx) and [`renderRelayTree`](https://github.com/artsy/eigen/blob/164a2aaace3f018cdc472fdf19950163ff2b198d/src/lib/tests/renderRelayTree.tsx).
- We have native unit tests too. See [`getting_started.md`](./getting_started.md)
- We don't like snapshot tests; they produce too much churn for too little value. It's okay to test that a component doesn't throw when rendered, but use [`extractText`](https://github.com/artsy/eigen/blob/4c7c9be69ab1c2095f4d2fed11a040b1bde6eba8/src/lib/tests/extractText.ts) (or similar) to test the actual component tree.

Here are some great examples of what tests and test coverage should look like.

- [Tests for Gene component](https://github.com/artsy/emission/blob/751d24306a2d6ace58b21491e25b37f345c7a206/src/lib/Containers/__tests__/Gene-tests.tsx)
- [Tests for Consignments submission flow](https://github.com/artsy/emission/blob/751d24306a2d6ace58b21491e25b37f345c7a206/src/lib/Components/Consignments/Screens/__tests__/Confirmation-tests.tsx)
- [Tests for Consignments photo-selection component interactions](https://github.com/artsy/emission/blob/751d24306a2d6ace58b21491e25b37f345c7a206/src/lib/Components/Consignments/Screens/__tests__/SelectFromPhotoLibrary-tests.tsx).
- Consignments Overview is a really complex component, so tests are broken into four test files:
  - [General component tests](https://github.com/artsy/emission/blob/751d24306a2d6ace58b21491e25b37f345c7a206/src/lib/Components/Consignments/Screens/__tests__/Overview-tests.tsx)
  - [Analytics tests](https://github.com/artsy/emission/blob/751d24306a2d6ace58b21491e25b37f345c7a206/src/lib/Components/Consignments/Screens/__tests__/Overview-analytics-tests.tsx)
  - [Local storage tests](https://github.com/artsy/emission/blob/751d24306a2d6ace58b21491e25b37f345c7a206/src/lib/Components/Consignments/Screens/__tests__/Overview-local-storage-tests.tsx)
  - [Image uploading tests](https://github.com/artsy/emission/blob/751d24306a2d6ace58b21491e25b37f345c7a206/src/lib/Components/Consignments/Screens/__tests__/Overview-uploading-tests.tsx)
  - [`CollectionsRail` tests](https://github.com/artsy/eigen/blob/39644610eb2a5609d992f434a7b37b46e0953ff4/src/lib/Scenes/Home/Components/__tests__/CollectionsRail-tests.tsx) demonstrate `relay-test-utils`.

### Use the Native Switchboard for Navigation (for now...)

Our React Native code ("Emission") is used by our Native code ("Eigen"). They used to be two repositories but were [combined in February 2020](https://github.com/artsy/eigen/pull/3030). Traces of the separation remain. The structure we originally took is [described in this blog post](http://artsy.github.io/blog/2016/08/24/On-Emission/). Interop between JavaScript and Native can be tricky.

_Most_ interactions are made through a "SwitchBoard" to open links. Other interactions are handled by the `APIModules`, for example when Eigen needs to invoke some kind of callback.

- [Switchboard routes defined in Eigen](https://github.com/artsy/eigen/blob/e0567ffc3c9619c66890998ae3cadfc026a290ae/Artsy/App/ARSwitchBoard.m#L131-L255)
- [Emission switchboard to call out to Eigen](https://github.com/artsy/emission/blob/751d24306a2d6ace58b21491e25b37f345c7a206/Pod/Classes/Core/ARSwitchBoardModule.m)
- [Callbacks between JS and native code are set up here](https://github.com/artsy/emission/blob/24c0fdaf91aa79654a33fd6e476405047819be5b/Pod/Classes/TemporaryAPI/ARTemporaryAPIModule.m).

### Analytics

#### Follow the tracking docs and examples

See our docs on implementing analytics [here](./analytics_and_tracking.md)

### Miscellaneous

- [Making network requests outside of Relay](https://github.com/artsy/emission/blob/019a106517b31cebfb1c5293891215cc7ebf7a4d/src/lib/Components/Consignments/Screens/Overview.tsx#L135-L150)
