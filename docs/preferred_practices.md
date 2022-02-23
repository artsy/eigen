# :world_map: Preferred Practices

This is a living document, expected to be updated regularly, with a broad overview of the history and how we prefere to do things on eigen.
Here you can find links to the tools we use, examples, pull requests with interesting discussions & blog posts.

Last update: February 2022

## Contents

- [Examples and Hacks](#examples-and-hacks)
- [History](#history)
- [File Structure Organization](#file-structure-organization)
- [Styling](#styling)
- [TypeScript](#TypeScript)
- [Relay](#relay)
- [Testing](#testing)
- [Navigation](#Navigation)
- [Analytics and tracking](#analytics-and-tracking)

### Examples & Hacks

Check out our lists of [examples](#../../../EXAMPLES.md) and [hacks](#../../../HACKS.md).

### History

The Artsy app was initially written in Objective-C and Swift and React Native was added in 2016. Some parts of the app are also written with Kotlin.

- **React Native** is our preferred option for developing new features.
- **Objective-C** and **Java** can be used for bridging code to react native (this is referring to native modules that need to talk to javascript, more info in the react native docs here: https://reactnative.dev/docs/native-modules-ios)
- **Swift** and **Kotlin** are used for native functionality that can't be done in React Native (such as: an iOS Widget or a Push Notification Extension).

- [Why Artsy uses React Native](http://artsy.github.io/blog/2016/08/15/React-Native-at-Artsy/)
- [All React Native posts on Artsy's Engineering Blog](http://artsy.github.io/blog/categories/reactnative/)
- Some great React Native components:
  - [Partner](https://github.com/artsy/eigen/blob/main/src/app/Scenes/Partner/Partner.tsx) is a simple top-level component.
  - [PartnerShows](https://github.com/artsy/eigen/blob/main/src/app/Scenes/Partner/Components/PartnerShows.tsx) is a fragment container that uses FlatList to paginate through Relay data.
  - [Search](https://github.com/artsy/eigen/blob/main/src/app/Scenes/Search/Search.tsx) is a functional component that loads data in response to user input.

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

We use [palette](src/palette) as our reusable component toolkit, which uses `styled-system` under the hood. [Here](palette.artsy.net) you can see palette in action.

For styling we use custom inline elements like `Flex`, `Box`, `Text`. `Separator` and `Spacer` are also useful elements.

### TypeScript

We use TypeScript to maximize runtime code safety & prevent runtime bugs.

In April 2020, we adopted [TypeScript's `strict` mode](https://github.com/artsy/eigen/pull/3210).

This disables "implicit any" and requires strict null checks.

The change left comments like this throughout the codebase that we aim to gradually remove.

```ts
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
```

### Relay

Artsy's GraphQL server is [Metaphysics](https://github.com/artsy/metaphysics). Requests to Metaphysics are made through [Relay](https://relay.dev).

We prefer using Relay hooks over relay containers (Higher Order Components). Refactoring old containers in favour of using hooks is encouraged.

- [Why Artsy uses Relay](http://artsy.github.io/blog/2017/02/05/Front-end-JavaScript-at-Artsy-2017/#Relay)
- [Artsy's Relay Workshop](https://github.com/artsy/relay-workshop)
- [Relay Container approach](https://github.com/artsy/eigen/blob/21fbf9e24eaa281f3e16609da5d38a9fb62a5449/src/app/Scenes/MyAccount/MyAccount.tsx#L70)

### Testing

We currently use [`@testing-library/react-native`](https://testing-library.com/docs/react-native-testing-library/intro/#:~:text=The%20React%20Native%20Testing%20Library,that%20encourages%20better%20testing%20practices.) as our preferred way of testing.
But we also use `test-renderer` and `enzyme` (in order of preference), that we'd ultimately like to remove.

- For setting up a test environment and mocking requests:

  - [`relay-test-utils`](https://relay.dev/docs/guides/testing-relay-components/) is the preferred way
  - [`MockRelayRenderer`](https://github.com/artsy/eigen/blob/39644610eb2a5609d992f434a7b37b46e0953ff4/src/lib/tests/MockRelayRenderer.tsx) and
  - [`renderRelayTree`](https://github.com/artsy/eigen/blob/164a2aaace3f018cdc472fdf19950163ff2b198d/src/lib/tests/renderRelayTree.tsx) are also being used but should gradually be removed.

- We write native unit tests when we work with native code
- We don’t use snapshot tests; they produce too much churn for too little value. It’s okay to test that a component doesn’t throw when rendered, but use [`extractText`](https://github.com/artsy/eigen/blob/4c7c9be69ab1c2095f4d2fed11a040b1bde6eba8/src/lib/tests/extractText.ts) (or similar) to test the actual component tree.

### Navigation

We use `react-navigation` for navigating between screens, navigate function and new routes.

See our documentation on adding a route for more details: [Adding a new route](https://github.com/artsy/eigen/blob/main/docs/adding_a_new_route.md).

### Analytics and tracking

Implementing analytics and tracking [here](./analytics_and_tracking.md).
