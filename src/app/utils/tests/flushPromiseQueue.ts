/**
 * @deprecated consider instead:
 *   - await waitFor(() => { ... })
 *   - waiting an element to appear with `await screen.findBy`
 *   - waiting an element to disappear with `await waitFor(() => expect(screen.queryByTestId("test")).not.toBeOnTheScreen())`
 *     (`render` now flushes first, so `waitForElementToBeRemoved` throws if the element is already gone)
 *   - resolving any pending relay operations with `mockMostRecentOperation`
 *   - spreading any missing component dependent fragment in the test query
 */
export const flushPromiseQueue = () =>
  new Promise((r) => setTimeout(() => requestAnimationFrame(r), 0))
