# :world_map: Our Best Practices

**Last update: Feb 2024**

This is a living document, expected to be updated regularly, with a broad overview of the history and how we prefer to do things on eigen.
Here you can find links to the tools we use, examples, pull requests with interesting discussions & blog posts.

_Please note: Links should point to specific commits, and not a branch (in case the branch or file is deleted, these links should always work). But it's possible that a file is outdated, that our understanding has moved on since it was linked to; in that case, please update this document._

# Contents

- [:world_map: Our Best Practices](#world_map-our-best-practices)
- [Contents](#contents)
  - [Examples \& Hacks](#examples--hacks)
  - [History](#history)
    - [File Structure Organization](#file-structure-organization)
    - [Example when creating a new screen](#example-when-creating-a-new-screen)
    - [Example when adding a component(s) to src/app/components](#example-when-adding-a-components-to-srcappcomponents)
      - [AVOID index.ts(x) files](#avoid-indextsx-files)
      - [Do not import components/hooks/functions... directly from a different scene](#do-not-import-componentshooksfunctions-directly-from-a-different-scene)
    - [When committing code](#when-committing-code)
  - [Frontend](#frontend)
    - [Styling](#styling)
  - [TypeScript](#typescript)
  - [Fetching data](#fetching-data)
  - [Testing](#testing)
  - [Navigation](#navigation)
  - [Analytics and tracking](#analytics-and-tracking)
  - [VirtualizedList best practices](#virtualizedlist-best-practices)
    - [Never nest ScrollViews.](#never-nest-scrollviews)
    - [Always default to `FlashList`.](#always-default-to-flashlist)
    - [Use `memo` to the rescue. See: https://reactnative.dev/docs/optimizing-flatlist-configuration#use-memo](#use-memo-to-the-rescue-see-httpsreactnativedevdocsoptimizing-flatlist-configurationuse-memo)
    - [Use `windowSize` with caution](#use-windowsize-with-caution)
    - [Use `LazyFlatlist` in order to define your own lazy loading logic.](#use-lazyflatlist-in-order-to-define-your-own-lazy-loading-logic)
    - [Does your component contain animations?](#does-your-component-contain-animations)
    - [More granular control on when updates happen can do magic sometimes! `requestAnimationFrame`, `queueMicroTask` and `InteractionManager.runAfterInteractions` can come to the rescue here!](#more-granular-control-on-when-updates-happen-can-do-magic-sometimes-requestanimationframe-queuemicrotask-and-interactionmanagerrunafterinteractions-can-come-to-the-rescue-here)
  - [Formik](#formik)
  - [Keyboard Management](#keyboard-management)
    - [Wrappers](#wrappers)
    - [Common Patterns](#common-patterns)
  - [Miscellaneous](#miscellaneous)
    - [Parts of the app that are still being handled in native code (Objective-C and Swift) instead of react-native on iOS](#parts-of-the-app-that-are-still-being-handled-in-native-code-objective-c-and-swift-instead-of-react-native-on-ios)

## Examples & Hacks

Check out our lists of [examples](/EXAMPLES.md) and [hacks](/HACKS.md).

## History

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

In this part of the docs, we go through how we usually like to organise our folders.

> Please keep in mind that some old folders might not be following the practices we describe below, Bonus points if you update them.

The React Native parts of the Eigen live inside `src/app`.

We are using typescript. Files containing a JSX component end in `.tsx` and files that don't end in `.ts`.

We use **PascalCase** for **Components and Component Folders**, but keep everything else within the Component folder(eg. mutations, state, utils) in **camelCase**.

Test files follow the same pattern and end in `.tests.ts(x)`.

For example `mutations`, `hooks` and `utils` would be **camelCase** folders, while `Screen.tsx` would be a **PascalCase** file.

### Example when creating a new screen

```

├── MyScreen

│ ├── __tests__
│ │ ├── MyScreen.tests.tsx

│ ├── MyScreen.tsx
│ ├── MyScreenStoreModel.tsx

│ ├── Components
│ │ ├── __tests__
│ │ | ├── MyScreenComponentA.tests.tsx
│ │ | ├── MyScreenComponentB.tests.tsx
│ │ ├── MyScreenComponentA.tsx
│ │ ├── MyScreenComponentB.tsx

│ ├── hooks
│ │ ├── __tests__
│ │ │ ├── useMyHook.tests.ts
│ │ │ ├── useMyMutation.tests.ts
│ │ ├── useMyHook.ts
│ │ ├── useMyMutation.ts  👈 hook mutations still go here

├── … utils
│ │ ├── __tests__
│ ├─│ ├── utilFunction.tests.ts
│ │ ├── utilFunction.ts
│ │ │

```

### Example when adding a component(s) to src/app/components

Assuming you would like to add **one or more** components to `src/app/Components`. In this case, you need to **create a folder** that exports the component

```

### src/app/Components

├── MyComponent
│ ├── MyComponent.tsx

│ ├── __tests__
│ │ ├── MyComponent.tests.tsx

```

`Note:` Updating capitalisation on folders can cause issues in git and locally so please refrain from renaming existing folders until we come up with a strategy about this. (TODO)

#### AVOID index.ts(x) files

We try to avoid the use of `index.ts(x)` files to prevent noise in the file structure and circular dependencies and make it easier to navigate between files.

#### Do not import components/hooks/functions... directly from a different scene

Assuming you are about to add a `Component` to `SceneA`. You notice later that it's already built in `SceneB`. In that case, you need to extract `Component` to a shared directory: `src/App/Components`

The same thing applies for hooks, utils etc...

### When committing code

- At Artsy, we follow [semantic commit messages](https://sparkbox.com/foundry/semantic_commit_messages) for PR names and commits. More details available in [Best Practices for Naming and Merging PRs RFC](https://github.com/artsy/README/issues/327)
- When merging a PR, choose "Squash and merge" (unless you have good reason not to)

## Frontend

### Styling

[@artsy/palette-mobile](https://github.com/artsy/palette-mobile) is our reusable component toolkit, which uses [styled-system](https://styled-system.com/getting-started/) under the hood.
[Here](palette.artsy.net) you can see palette in action.
Some of our most used elements are `Flex`, `Box`, `Text`. `Separator` and `Spacer`.

We want to move towards an [atomic design](https://bradfrost.com/blog/post/atomic-web-design/) and have all our UI elements in palette.

## TypeScript

We use TypeScript to maximize runtime code safety & prevent runtime bugs.

In April 2020, we adopted [TypeScript's `strict` mode](https://github.com/artsy/eigen/pull/3210).

This disables "implicit any" and requires strict null checks.

The change left comments like this throughout the codebase that we aim to gradually remove.

```ts
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
```

## Fetching data

We use [Relay](https://relay.dev) for network requests.

Artsy's **GraphQL** server is [Metaphysics](https://github.com/artsy/metaphysics).

We prefer using **Relay hooks** over relay containers (Higher Order Components).

Refactoring components using HoCs in favour of hooks is encouraged.

➡️ Read more about how to fetch data [here](https://github.com/artsy/eigen/blob/main/docs/fetching_data.md)

- [Why Artsy uses Relay](http://artsy.github.io/blog/2017/02/05/Front-end-JavaScript-at-Artsy-2017/#Relay)
- [Artsy's Relay Workshop](https://github.com/artsy/relay-workshop)
- [Relay Container approach](https://github.com/artsy/eigen/blob/21fbf9e24eaa281f3e16609da5d38a9fb62a5449/src/app/Scenes/MyAccount/MyAccount.tsx#L70)

## Testing

Please read more about testing [here](testing.md).

## Navigation

We use `react-navigation` for navigating between screens.

For adding a screen that corresponds to a page on artsy.net add a new route and use the `navigate(<route-name>)` function. Navigation will then be handled for you. And that's how it's done: (add links to code here).

See our documentation on adding a route for more details: [Adding a new route](https://github.com/artsy/eigen/blob/main/docs/adding_a_new_route.md) and to [create a new screen](https://github.com/artsy/eigen/blob/main/docs/adding_a_new_screen.md).

[For Artsy Engineers] If you want to learn more about our navigation infra, take a look at this [recording](https://drive.google.com/drive/u/0/folders/1wUAUHt86WLQMy7Fx3MU7k4bj4y1ngaCk)

## Analytics and tracking

In React-native, we use react-tracking as a wrapper for the tracking events we send to Segment. You can read more about the implementation [here](./analytics_and_tracking.md).

## VirtualizedList best practices

Smoothly rendering lists and animations is crucial for a positive user experience. However, performance issues can arise, causing lag, stuttering, and decreased responsiveness. Below are few tips to achieve that in Eigen:

### Never nest ScrollViews.

If you feel like there is no other way, it's probably a better idea to talk to the designer to adjust the approach they're suggested instead. Our `Screen` wrappers from `palette-mobile` expose performant `ScrollView` based components such as `Flatlist` and `Flashlist` that can be used and would save you the nesting.

### Always default to `FlashList`.

Think of `FlashList` as `Flatlist` on steroids. It's fast, performant and easy to use.

<details>
<summary>
Code snippet
</summary>

```typescript
import { FlashList } from "@shopify/flash-list"

const App = () => {
  return (
   <FlashList
    renderItem={renderItem}
    estimatedItemSize={ESTIMATED_ITEM_SIZE}
    keyExtractor={keyExtractor}
  >
  )
}
```

</details>
```
```

> **What if you followed all the above steps and still have performance issues?**

Below are some tips to improve the performance further; don't follow them UNLESS you need to, as premature optimization will haunt you and can lead to issues that are non-trivial to debug (plus it's arguably not the best use of your time).

### Use `memo` to the rescue. See: https://reactnative.dev/docs/optimizing-flatlist-configuration#use-memo

### Use `windowSize` with caution

### Use `LazyFlatlist` in order to define your own lazy loading logic.

<details>
<summary>Code snippet</summary>

Example of a PR implementing it: https://github.com/artsy/eigen/pull/9832

```typescript
import { LazyFlatlist } from "@artsy/palette-mobile"

const App () => {
  return (
    <LazyFlatlist<NotificationT> keyExtractor={keyExtractor}>
      {(props) => {
        return (
          <FlatlistComponent
            ...
            renderItem={({ item }) => {
              return <ActivityItem notification={item} isVisible={props.hasSeenItem(item)} />
            }}
            onViewableItemsChanged={props.onViewableItemsChanged}
            viewabilityConfig={props.viewabilityConfig}
          />
        )
      }}
    </LazyFlatlist>
  )
}
```

</details>

### Does your component contain animations?

<details>
<summary>If yes, consider moving all the animations to the native thread. How?</summary>

Example of a potentially problematic component implementing a fade in animation with Moti.

```typescript
import { MotiView } from "moti"

const Image = () => {
  const [loading, setLoading] = useState(true) // 👈 executes on the JS thread
  return (
   <Flex>
    <FastImage ... onLoadEnd=(() => setLoading(false)) />
    <MotiView animate={{opacity: loading ? 0:1}} />
   <Flex>
  )
}
```

The above code runs the animation on the native thread thanks to Moti, However, it will only happens after loading is set to false , which happens on the js side! This is fine when not much is happening on the js thread, but when the JS thread is busy dealing with items complex logic, scrolling and calculating scroll position etc... it can lead to a bottleneck on the JS side leading and potentially breaking the scroll experience.

The solution here would be to follow [RN threading models](https://reactnative.dev/architecture/threading-model) UI animations best practices and moving everything to the native thread like so.

```typescript
import { MotiView } from "moti"

const Image = () => {
  const loading = useSharedValue(true) // 👈 executes on the JS thread

   const onLoadEnd = () => {
     "worklet"
     loading.set(() => false)
   }

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(loading.get() ? 1 : 0, { duration: 200, easing: Easing.sin }),
    }

  return (
   <Flex>
    <FastImage ... onLoadEnd=(onLoadEnd) />
    <MotiView style={animatedStyles} />
   <Flex>
  )
}
```

</details>

### More granular control on when updates happen can do magic sometimes! `requestAnimationFrame`, `queueMicroTask` and `InteractionManager.runAfterInteractions` can come to the rescue here!

## Formik

We use Formik for handling forms. You can see an example that's also using form validation [here](https://github.com/artsy/eigen/blob/9faccb0ffd987da74f76e98e55432992f07231cf/src/app/Scenes/Consignments/Screens/SubmitArtworkOverview/ContactInformation/ContactInformation.tsx)

## Keyboard Management

We use `react-native-keyboard-controller` for all keyboard interactions. An ESLint rule enforces this pattern by preventing imports of React Native's built-in `Keyboard` API.

### Wrappers

We are using three main wrappers for keyboard management:

**1. KeyboardAvoidingContainer** - Basic `<View>` with keyboard avoidance for simple layouts

```typescript
import { KeyboardAvoidingContainer } from "app/utils/keyboard/KeyboardAvoidingContainer"

const App = () => {
  return (
    <KeyboardAvoidingContainer>
      <Input placeholder="Email" />
    </KeyboardAvoidingContainer>
  )
}
```

**2. KeyboardAwareForm** - Scrollable view that auto-scroll to focused inputs

```typescript
import { KeyboardAwareForm } from "app/utils/keyboard/KeyboardAwareForm"

const App = () => {
  return (
    <KeyboardAwareForm>
      <Input title="Name" />
      <Input title="Email" />
    </KeyboardAwareForm>
  )
}
```

**3. KeyboardStickyView** - A `View` that stay above the keyboard

```typescript
import { KeyboardStickyView } from "react-native-keyboard-controller"

const App = () => {
  return (
    <KeyboardStickyView>
      <Box p={2}>
        <Button onPress={handleSubmit}>Submit</Button>
      </Box>
    </KeyboardStickyView>
  )
}
```

### Common Patterns

**Using `KeyboardStickyView` with `KeyboardAwareForm`**

This is one of the most common patterns we have for keyboard management.

```typescript
import { KeyboardAwareForm } from "app/utils/keyboard/KeyboardAwareForm"
import { KeyboardStickyView } from "react-native-keyboard-controller"

const App = () => {
  const [bottomOffset, setBottomOffset] = useState(0)

  const handleOnLayout = (event) => {
    setBottomOffset(event.nativeEvent.layout.height + bottom)
  }

  return (
    <>
      <KeyboardAwareForm
        // `bottomOffset` is the extra height needed to make the focused input visible above the sticky view
        bottomOffset={bottomOffset}
      >
        <Input title="Name" />
        <Input title="Email" />
      </KeyboardAwareForm>

      <KeyboardStickyView
        // `onLayout` is used to calculate the offset when focusing on an input in the form
        onLayout={handleOnLayout}
        // `offset` is used to align the sticky content with the keyboard, usually it's the safe area bottom inset
        offset={{ opened: bottom }}
      >
        <Box p={2}>
          <Button onPress={handleSubmit}>Submit</Button>
        </Box>
      </KeyboardStickyView>
    </>
  )
}
```

A good example is the [MyCollection main form component](https://github.com/artsy/eigen/blob/33b432f91f6f0e562e59ebe44f0db8b0a8f6e29f/src/app/Scenes/MyCollection/Screens/ArtworkForm/Screens/MyCollectionArtworkFormMain.tsx)

## Miscellaneous

### Parts of the app that are still being handled in native code (Objective-C and Swift) instead of react-native on iOS

The following parts of the iOS app are handled in native code:

- Live Auctions Integration (LAI) view controller and networking.
- Initializing the React Native runtime.
- Analytics for Native UI.
- View In Room (Augmented Reality)
- City Guide Drawer Handling
