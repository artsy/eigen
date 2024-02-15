# :world_map: Our Best Practices

**Last update: March 2022**

This is a living document, expected to be updated regularly, with a broad overview of the history and how we prefer to do things on eigen.
Here you can find links to the tools we use, examples, pull requests with interesting discussions & blog posts.

_Please note: Links should point to specific commits, and not a branch (in case the branch or file is deleted, these links should always work). But it's possible that a file is outdated, that our understanding has moved on since it was linked to; in that case, please update this document._

## Contents

- [:world_map: Our Best Practices](#world_map-our-best-practices)
  - [Contents](#contents)
    - [Examples \& Hacks](#examples--hacks)
    - [History](#history)
    - [File Structure Organization](#file-structure-organization)
      - [index.ts files](#indexts-files)
      - [When committing code](#when-committing-code)
    - [Frontend](#frontend)
      - [Styling](#styling)
    - [TypeScript](#typescript)
    - [Fetching data](#fetching-data)
    - [Testing](#testing)
    - [Navigation](#navigation)
      - [iOS Navigation](#ios-navigation)
    - [Analytics and tracking](#analytics-and-tracking)
    - [Formik](#formik)
    - [Miscellaneous](#miscellaneous)
      - [Parts of the app that are still being handled in native code (Objective-C and Swift) instead of react-native on iOS](#parts-of-the-app-that-are-still-being-handled-in-native-code-objective-c-and-swift-instead-of-react-native-on-ios)

### Examples & Hacks

Check out our lists of [examples](/EXAMPLES.md) and [hacks](/HACKS.md).

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

The React Native parts of the app live in `src/` and most of our components on `app/`.
Within this folder things can be a bit messy 👀 but we are working on improving that!

Files that export a JSX component end in `.tsx` and files that don't end in `.ts` by default.

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

##### index.ts files

We try to avoid the use of `index.ts` files to prevent noise in the file structure and circular dependencies and make it easier to navigate between files.

#### When committing code

- Use the [semantic commit message](https://seesparkbox.com/foundry/semantic_commit_messages) format in the title of your PR (eg. feat, fix, style, test, refactor, docs)
- When merging a PR, choose "Squash and merge" (unless you have good reason not to)
- Do not use "Squash and merge" on a new version deployment PR

### Frontend

#### Styling

[@artsy/palette-mobile](https://github.com/artsy/palette-mobile) is our reusable component toolkit, which uses [styled-system](https://styled-system.com/getting-started/) under the hood.
[Here](palette.artsy.net) you can see palette in action.
Some of our most used elements are `Flex`, `Box`, `Text`. `Separator` and `Spacer`.

We want to move towards an [atomic design](https://bradfrost.com/blog/post/atomic-web-design/) and have all our UI elements in palette.

### TypeScript

We use TypeScript to maximize runtime code safety & prevent runtime bugs.

In April 2020, we adopted [TypeScript's `strict` mode](https://github.com/artsy/eigen/pull/3210).

This disables "implicit any" and requires strict null checks.

The change left comments like this throughout the codebase that we aim to gradually remove.

```ts
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
```

### Fetching data

We use [Relay](https://relay.dev) for network requests.

Artsy's **GraphQL** server is [Metaphysics](https://github.com/artsy/metaphysics).

We prefer using **Relay hooks** over relay containers (Higher Order Components).

Refactoring components using HoCs in favour of hooks is encouraged.

➡️ Read more about how to fetch data [here](https://github.com/artsy/eigen/blob/main/docs/fetching_data.md)

- [Why Artsy uses Relay](http://artsy.github.io/blog/2017/02/05/Front-end-JavaScript-at-Artsy-2017/#Relay)
- [Artsy's Relay Workshop](https://github.com/artsy/relay-workshop)
- [Relay Container approach](https://github.com/artsy/eigen/blob/21fbf9e24eaa281f3e16609da5d38a9fb62a5449/src/app/Scenes/MyAccount/MyAccount.tsx#L70)

### Testing

Please read more about testing [here](testing.md).

### Navigation

We use `react-navigation` for navigating between screens.

For adding a screen that corresponds to a page on artsy.net add a new route and use the `navigate(<route-name>)` function. Navigation will then be handled for you. And that's how it's done: (add links to code here).

See our documentation on adding a route for more details: [Adding a new route](https://github.com/artsy/eigen/blob/main/docs/adding_a_new_route.md) and to [create a new screen](https://github.com/artsy/eigen/blob/main/docs/adding_a_new_screen.md).

#### iOS Navigation

- For native iOS code we use the **ARScreenPresenterModule**. Once the new app shell is finished (expected March 2022), we will be using `react-navigation`.

For the most part you don't have to worry about this.

### Analytics and tracking

In React-native, we use react-tracking as a wrapper for the tracking events we send to Segment. You can read more about the implementation [here](./analytics_and_tracking.md).

### Formik

We use Formik for handling forms. You can see an example that's also using form validation [here](https://github.com/artsy/eigen/blob/9faccb0ffd987da74f76e98e55432992f07231cf/src/app/Scenes/Consignments/Screens/SubmitArtworkOverview/ContactInformation/ContactInformation.tsx)

### Miscellaneous

#### Parts of the app that are still being handled in native code (Objective-C and Swift) instead of react-native on iOS

The following parts of the iOS app are handled in native code:

- Live Auctions Integration (LAI) view controller and networking.
- Initializing the React Native runtime.
- Analytics for Native UI.
- View In Room (Augmented Reality)
- City Guide Drawer Handling

The following parts of the iOS app are handled in native code, but will be managed by React Native once the new app shell is finished (expected March 2022):

- ARScreenPresenterModule to navigate between view controllers.
- The top-level tab bar, and each tab's navigation controller.
- Deep-link and notification handling.
