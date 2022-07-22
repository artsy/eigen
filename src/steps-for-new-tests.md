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
- [ ] replace all code blocks like:
```
act(() => {
  env.mock.resolveMostRecentOperation({
    errors: [],
    data: {
      ...ArtistSeriesFullArtistSeriesListFixture,
    },
  })
})
```
with
```
resolveMostRecentRelayOperationPayload({
  errors: [],
  data: {
    ...ArtistSeriesFullArtistSeriesListFixture,
  },
})
```
without the `act`.


## Manual
- if possible, change the tests to the new suggested way in [EXAMPLES.md](/EXAMPLES.md), using async, render, resolve, await wait, expects.
- some of the above rules couldn't be applied in all files. If you see a thing like that, it will be marked red by the editor anyway, because of missing definitions or bad types, please fix that too.

- if you have issues with making the tests run, check the current main branch, in case some of the above actions failed
