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
- [styling](#styling)
- [Write unit tests for new components](#write-unit-tests-for-new-components)
- [Navigation](#Navigation)
- [Analytics and tracking](#analytics-and-tracking)
  - [Follow the tracking docs and examples](#follow-the-tracking-docs-and-examples)
- [Miscellaneous](#miscellaneous)

### Examples & Hacks

Check out our list of [examples](#../../../EXAMPLES.md) and [hacks](#../../../HACKS.md)

### History

The app was initially written in Objective-C and Swift and React Native was added in 2016. Some parts of the app are also written with Kotlin.

- **React Native** By default we use React Native for new features.
- **Objective-C**, **Java**, can be used for bridging code to react native (this is referring to native modules that need to talk to javascript, more info in the react native docs here: https://reactnative.dev/docs/native-modules-ios)
- **Swift**, **Kotlin** for native functionality that can't be done in React Native (such as: an iOS Widget or a Push Notification Extension).

- [Why Artsy uses React Native](http://artsy.github.io/blog/2016/08/15/React-Native-at-Artsy/)
- [All React Native posts on Artsy's Engineering Blog](http://artsy.github.io/blog/categories/reactnative/)
- Some great React Native components:
  - [Partner](https://github.com/artsy/eigen/blob/main/src/app/Scenes/Partner/Partner.tsx) is a simple top-level component.
  - [PartnerShows](https://github.com/artsy/eigen/blob/main/src/app/Scenes/Partner/Components/PartnerShows.tsx) is a fragment container that uses FlatList to paginate through Relay data.
  - [Search](https://github.com/artsy/eigen/blob/main/src/app/Scenes/Search/Search.tsx) is a functional component that loads data in response to user input.

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

### Styling

We use [palette](src/palette) which uses `styled-system` under the hood.

For styling we use custom inline elements like `Flex`, `Box`, `Text`.

### Relay [WIP]

[Metaphysics](https://github.com/artsy/metaphysics) is Artsy's GraphQL server. Requests to Metaphysics are made through [Relay](https://relay.dev).

- [Why Artsy uses Relay](http://artsy.github.io/blog/2017/02/05/Front-end-JavaScript-at-Artsy-2017/#Relay)
- [Artsy's Relay Workshop](https://github.com/artsy/relay-workshop)
- Collections
  - [A top-level Relay component](https://github.com/artsy/eigen/blob/39644610eb2a5609d992f434a7b37b46e0953ff4/src/app/Scenes/Collection/Collection.tsx)
  - [A fragment container](https://github.com/artsy/eigen/blob/39644610eb2a5609d992f434a7b37b46e0953ff4/src/app/Scenes/Collection/Components/FeaturedArtists.tsx)

#### Prefer Relay hooks over relay containers (Higher Order Components)

Refactoring old containers to use hooks is encouraged.

- [Relay Container approach](https://github.com/artsy/eigen/blob/21fbf9e24eaa281f3e16609da5d38a9fb62a5449/src/app/Scenes/MyAccount/MyAccount.tsx#L70)

### Unit tests

We currently use several libraries for testing.
[`@testing-library/react-native`](https://testing-library.com/docs/react-native-testing-library/intro/#:~:text=The%20React%20Native%20Testing%20Library,that%20encourages%20better%20testing%20practices.) is our preferred way to go.
But we also use `test-renderer` and `enzyme` (in order of preference), that we'd ultimately like to remove.

- For setting up a test environment and mocking requests:

  - [`relay-test-utils`](https://relay.dev/docs/guides/testing-relay-components/) is the preferred way
  - [`MockRelayRenderer`](https://github.com/artsy/eigen/blob/39644610eb2a5609d992f434a7b37b46e0953ff4/src/lib/tests/MockRelayRenderer.tsx) and
  - [`renderRelayTree`](https://github.com/artsy/eigen/blob/164a2aaace3f018cdc472fdf19950163ff2b198d/src/lib/tests/renderRelayTree.tsx) are also being used but should gradually be removed.

- We write native unit tests when we work with native code
- We don't use snapshot tests; they produce too much churn for too little value.

### Navigation

_Use `react-navigation` for navigating between screens, navigate function and new routes when necessary_

See our documentation on adding a route for more details: [Adding a new route](https://github.com/artsy/eigen/blob/main/docs/adding_a_new_route.md)

#### Analytics and tracking

Implementing analytics and tracking [here](./analytics_and_tracking.md)
