## Automated/Find-and-Replace
- [x] remove all `jest.unmock("react-relay")`
- [x] replace every `defaultEnvironment` with `getRelayEnvironment()`
- [ ] replace every `mockEnvironment.mock` with `getMockRelayEnvironment().mock`
- [x] remove all code like `let mockEnvironment: ReturnType<typeof createMockEnvironment>`
- [x] remove all code blocks like:
```
beforeEach(() => {
  mockEnvironment = createMockEnvironment()
})
```
- [x] replace all code blocks like (to remove the env arg):
```
resolveMostRecentRelayOperation(mockEnvironment, {
  FilterArtworksConnection: () => ({
    counts: {
      followedArtists: 0,
      total: 0,
    },
    edges: [],
  }),
})
```
with
```
resolveMostRecentRelayOperation( {
  FilterArtworksConnection: () => ({
    counts: {
      followedArtists: 0,
      total: 0,
    },
    edges: [],
  }),
})
```
- [ ] replace all code blocks like:
```
env.mock.resolveMostRecentOperation((operation) =>
  MockPayloadGenerator.generate(operation, {
    Me: () => ({
      name: "wow",
    }),
  })
)
```
with
```
resolveMostRecentRelayOperation({
  Me: () => ({
    name: "wow",
  }),
})
```
- [x] replace `renderWithHookWrappersTL` with `renderWithRelayWrappers`


## Manual
- if possible, change the tests to the new suggested way in [EXAMPLES.md](/EXAMPLES.md), using async, render, resolve, await wait, expects.

- if you have issues with making the tests run, check the current main branch, in case some of the above actions failed
