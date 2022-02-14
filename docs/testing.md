# Testing with Relay [WIP]

We have 3 ways of testing relay components:

1. Components using RelayQueryRenderer

1. Components using relay hooks

1. Components using both RelayQueryRenderer & relay hooks !

## Case 1: Testing components using RelayQueryRenderer

renderWithWrappersTL : renderWithWrappers(TestingLibrary)
All our wrappeprs

setupTestWrapper : abstract some of the boiler of Relay
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
So in this case we'd use renderWithWrappersTL and create our own environments.

Example of using multiple environments: ContactInformation.tests.tsx

setupJest:
We have initialisations of mocks such as

```
 jest.mock("lib/relay/createEnvironment", () => {
   return {
     defaultEnvironment: require("relay-test-utils").createMockEnvironment(),
   }
 })
```
