# Testing

So you want to write tests!

- We use `@testing-library/react-native` and our helper `renderWithWrappers`. In the past we used ReactTestRenderer which we try to now move away from.

- Get started https://callstack.github.io/react-native-testing-library/docs/getting-started/
- API Queries https://callstack.github.io/react-native-testing-library/docs/api-queries/

- We refer to this guide 👉 [How should I query?](https://callstack.github.io/react-native-testing-library/docs/how-should-i-query/) from `@testing-library/react-native` for querying components

In our code base there is some "Old fashioned" testing used for Class components for example since they can only be used using the old way in combination with QueryRenderer etc

The "new fashion" testing uses > relay v13 and we now prefer to use hooks whenever possible. We would for example use `useLazyLoadQuery` instead of a `QueryRenderer`.

Our preferred methods to use are marked with a ⭐️, while the ones we'd like to avoid are marked as ❗️ depracated.

## Test helpers and wrappers, when to use them, and good examples

- `TestRendered` is a component we create, using the component we want to test. We use a TestRendered when for example we want to create a mock query. We don't always need to use a test renderer.

New fashion: You can use useLazyLoadQuery inside a TestRendered which is the new relay hooks way for querying data and the way we generally want to swift towards.

New fashion Example: [ArtworkConsignments.tests.tsx](https://github.com/artsy/eigen/blob/6360ddb5304e6c5bb1dc207db13d5bf0a5d7d9b6/src/app/Scenes/Artwork/Components/ArtworkConsignments.tests.tsx#L28-L38)

Old fashioned: You can use a TestRendered to wrap your component with a QueryRenderer and pass it the test query data.
Old fashion Example: [Inbox.tests.tsx](https://github.com/artsy/eigen/blob/c96dd0807555d69ca2e8655dc68085276d249080/src/app/Containers/Inbox.tests.tsx)

- ⭐️ `renderWithWrappers` Our default method for using a component. Can be used on all components. wraps the component with a number of wrappers such as TrackingProvider, GlobalStoreProvider, SafeAreaProvider, etc. Using `testing library`. See the list of wrappers [here](https://github.com/artsy/eigen/blob/main/src/app/tests/renderWithWrappers.tsx#L19-L25).

- ⭐️ `renderWithHookWrappersTL` Wraps the component with a relay hook environment, and a Suspense fallback. Example: [Activity.tests.tsx](https://github.com/artsy/eigen/blob/1a611488042f6eccfc62862fddf7d06a17087f0e/src/app/Scenes/Activity/Activity.tests.tsx)

- ⭐️ `setupTestWrapperTL` ❗️ This function does not work with hooks ❗️ Uses react-native testing library.

For components that use relay requests.

Very similar to `renderWithWrappers`. The difference is that it will also resolve the first api request **only**.

If your component has more than one requests you should use `renderWithWrappers` instead, in combination with one of the functions that resolve api requests such as `resolveMostRecentRelayOperation` or `rejectMostRecentRelayOperation` Example: **\_**

This is an abstraction that is sometimes convenient.

Example of a component with one request [PartnerLocationSection.tests.tsx](https://github.com/artsy/eigen/blob/7703aa01103a06b69b650af11bc9903ab37b1c4b/src/app/Scenes/Partner/Components/PartnerLocationSection.tests.tsx#L21).

`setupTestWrapperTL` can be used to replace the combination of **TestRendered** and **renderWithWrappers**.

It returns the function `renderWithRelay` which is similar to `renderWithWrappers`. Both `renderWithRelay` and `renderWithWrappers` use [render](https://testing-library.com/docs/angular-testing-library/api/#render) under the hood. I

t gives you access to all the [queries](https://callstack.github.io/react-native-testing-library/docs/api-queries) such as getBy, getAllBy, queryBy, queryAllBy, findBy, findAllBy, etc.

❗️ It won't work if there is already a component using a query renderer. [eg?]

// TODO: rename setupTestWrapperTL to setupTestWrapper and setupTestWrapper to setupTestWrapperLegacy
// Decide if we want to use this pattern or not.

Suggestion: Would it make sense to either remove this abstraction alltogether, or suggest it as the main course of action?

- `resolveMostRecentRelayOperation` resolves the query request. We use it after rendering a component that has relay requests. Your rendered component makes a request and we use this function in tests to resolve it. Example file: [Inbox.tests.tsx](https://github.com/artsy/eigen/blob/c96dd0807555d69ca2e8655dc68085276d249080/src/app/Containers/Inbox.tests.tsx)

- `rejectMostRecentRelayOperation` for example if network is off / bad / you have a server error. Example: [FollowArtistLink.tests.tsx](https://github.com/artsy/eigen/blob/cfcdd1429732ea04dc26134e1bf4a4d4cb96f16e/src/app/Scenes/Artwork/Components/FollowArtistLink.tests.tsx)

- `flushPromiseQueue` This is a hack - try to avoid it if possible.

flushPromiseQueue will resolve all promise operations.

This is usually called when promises have been used in a bad way, eg you return the promise instead of resolving it.

Try to make a test run normally and if you are absolutely sure everything else is correct but the test still fails after a promise has been called (eg `resolveMostRecentRelayOperation` or `rejectMostRecentRelayOperation`) try adding this.

💡 There might be some cases that you would want to use `flushPromiseQueue` after `resolveMostRecentRelayOperation`, in order to wait for the request to be resolved.
Use it only if, after resolving, the request returns the suspense fallback component, and not the component. [Add example here]

// TODO: remove flushPromiseQueue from everywhere [WIP]

- `fetchMockResponseOnce` - do we really need this? What is it used for? 😇 More info [here](https://github.com/jefflau/jest-fetch-mock#jest-fetch-mock)

- `mockTrackEvent` - mock data for tracking. We don't actually send this data to our data tracking provider for called analytics function `trackEvent`.

- `mockPostEventToProviders` expects a user behavior (eg button click) and mocks analytics for called analytics function `postEventToProviders`

- `mockFetchNotificationPermissions` mocking for the function `fetchNotificationPermissions`

- `mockTimezone` mocking for time/date eg with moment or luxon. Used for testing the date format.

- `mockNavigate` we test if navigation was called and with which parameters.

#### ❗️ depracated - avoid these ❗️

We ideally want to remove the functions below at some point.

- `extractText` ❗️depracated❗️ was used along with enzyme in order to extract the text from elements (a title, View or button). You can also check `extractTest.tests.tsx`. Now that we use @testing-library/react-native there is no need for that anymore since the library itself has the ability to query for text with [byText](https://callstack.github.io/react-native-testing-library/docs/api-queries/#bytext).

- `renderWithWrappersLEGACY` ❗️depracated❗️ uses ReactTestRenderer. We want to remove this. Use renderWithWrappers instead.

- `setupTestWrapper` ❗️depracated❗️ uses ReactTestRenderer . Renders a test component and resolves the most recent operation. An abstraction that sometimes is convenient.

- `waitUntil` ❗️depracated❗️ Waits until something happens. RN Testing library has a similar component [waitFor](https://testing-library.com/docs/dom-testing-library/api-async/), that we could potentially replace this with.

Hopefully one day we will update also the relay testing infra and we will update some of the above with fresher examples.

### Example Links

#### Components not using relay

- [CustomSizeInputs.tests.tsx](src/app/Components/ArtworkFilter/Filters/CustomSizeInputs.tests.tsx)
- [SizesOptionsScreen.tests.tsx](src/app/Components/ArtworkFilter/Filters/SizesOptionsScreen.tests.tsx)

#### Components using relay

- [Search.tests.tsx](src/app/Scenes/Search/Search.tests.tsx)
- [ArtistSavedSearch.tests.tsx](src/app/Scenes/Artist/ArtistSavedSearch.tests.tsx)

## with Relay [WIP]

We have 3 ways of testing relay components:

1. Components using Higher Order Components (eg. RelayQueryRenderer)

1. Components using relay hooks

1. Components using both HoC & relay hooks !

Further documentation on testing

https://github.com/artsy/relay-workshop/tree/main/src/exercises/03-Testing-Queries

## Case 1: Testing components using Higher Order Components (eg RelayQueryRenderer, RelayFragmentContainer etc.)

renderWithWrappers : renderWithWrappersLEGACY(TestingLibrary)
All our wrappeprs

setupTestWrapper : abstract some of the boilerplate of Relay
Component,
Query
Variables

_example file: ItemArtwork.tests.tsx_

Creates query Renderer

- Pass a component
- Pass a test query
- Pass input variables

has an act that resolves the first request that's being made.

! When we have consecutive requests setupTestWrapperTL doesnot work because it creates the environment inside.

We need to create our own environment in this case:
So in this case we'd use renderWithWrappers and create our own environments.

Example of using multiple environments: ContactInformation.tests.tsx

setupJest:
We have initialisations of mocks such as

```
 jest.mock("app/relay/createEnvironment", () => {
   return {
     defaultEnvironment: require("relay-test-utils").createMockEnvironment(),
   }
 })
```
