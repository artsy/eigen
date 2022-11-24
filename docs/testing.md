# Testing

So you want to write tests!

- We use `@testing-library/react-native` and our helper `renderWithWrappers`. In the past we used ReactTestRenderer which we try to now move away from.
- We refer to this guide 👉 [How should I query?](https://callstack.github.io/react-native-testing-library/docs/how-should-i-query/) from `@testing-library/react-native` for querying components

## Test helpers and wrappers, when to use them, and good examples

- `extractTest` takes a component and returns any string that exists there, whether it's on a title, View or button. You can also check `extractTest.tests.tsx`.

- `renderWithWrappers` Can be used on all components. Our default method for using a component. wraps the component with a number of wrappers such as TrackingProvider, GlobalStoreProvider, SafeAreaProvider, etc. Using `testing library`. See the list of wrappers [here](https://github.com/artsy/eigen/blob/main/src/app/tests/renderWithWrappers.tsx#L19-L25).

- `renderWithWrappersLEGACY`depracated - avoid this ❗️ uses ReactTestRenderer

- `setupTestWrapperTL` For components that use relay requests. Uses react-native testing library. Renders a test component and resolves the most recent operation. An abstraction that sometimes is convenient. Example [PartnerLocationSection.tests.tsx](https://github.com/artsy/eigen/blob/7703aa01103a06b69b650af11bc9903ab37b1c4b/src/app/Scenes/Partner/Components/PartnerLocationSection.tests.tsx#L21). This function can be used instead of TestRendered and renderWithWrappers. Returns the function `renderWithRelay` which is similar to `renderWithWrappers` and gives you access to a number of properties such as `findWithTestID` etc. It won't work if there is already a component using a query renderer.
  Better to explicitly use a QueryRenderer to make obvious what is there and minimize complexity.

- `setupTestWrapper` depracated - avoid this ❗️uses ReactTestRenderer . Renders a test component and resolves the most recent operation. An abstraction that sometimes is convenient.

// TODO: rename setupTestWrapperTL to setupTestWrapper and setupTestWrapper to setupTestWrapperLegacy
// Decide if we want to use this pattern or not.

- `resolveMostRecentRelayOperation` resolves the query request. We always put it after rendering a component that has relay requests. Your rendered component makes a request and we use this function in tests to resolve it. Example file: [Inbox.tests.tsx](https://github.com/artsy/eigen/blob/c96dd0807555d69ca2e8655dc68085276d249080/src/app/Containers/Inbox.tests.tsx)

- `rejectMostRecentRelayOperation` for example if network is off / bad / you have a server error. Example: [FollowArtistLink.tests.tsx](**add link here**)

- `flushPromiseQueue` This is a hack - try to avoid it if possible.

flushPromiseQueue will cancel all promise operations.

This is usually called when promises have been used in a bad way, eg you return the promise instead of resolving it.

Try to make a test run normally and if you are absolutely sure everything else is correct but the test still fails after a promise has been called (eg `resolveMostRecentRelayOperation` or `rejectMostRecentRelayOperation`) try adding this.

// TODO: remove flushPromiseQueue from everywhere [WIP]

- `fetchMockResponseOnce` - do we really need this? What is it used for? 😇

- `mockTrackEvent` - mock data for tracking. We don't actually send this data to our data tracking provider for called analytics function `trackEvent`.

- `mockPostEventToProviders` expects a user behavior (eg button click) and mocks analytics for called analytics function `postEventToProviders`

- `mockFetchNotificationPermissions` mocking for the function `fetchNotificationPermissions`

- `mockTimezone` mocking for time/date eg with moment or luxon. Used for testing the date format.

- `mockNavigate` we test if navigation was called and with which parameters.

- `waitUntil` Waits until something happens. RN Testing library has a similar component [waitFor](https://testing-library.com/docs/dom-testing-library/api-async/), that we could potentially replace this with.

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
