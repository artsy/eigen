/**
 * @deprecated consider instead:
 *   - waiting an element to appear with `await screen.findBy`
 *   - waiting an element to disappear with `await waitForElementToBeRemoved(() => screen.getByTestId("test"))`
 *   - resolving any pending relay operations with `mockMostRecentOperation`
 *   - spreading any missing component dependent fragment in the test query
 */
export const flushPromiseQueue = () =>
  new Promise((r) => setTimeout(() => requestAnimationFrame(r), 0))
