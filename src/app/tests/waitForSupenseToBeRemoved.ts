import { screen, waitForElementToBeRemoved } from "@testing-library/react-native"

/**
 * **MUST BE AWAITED**
 *
 * Use it as `await waitForSuspenseToBeRemoved()` if you don't use nested `Suspense`.
 * Use it as `await waitForSuspenseToBeRemoved("nested-sus-id")` if you use a nested `Suspense` like
 * ```
 * <Suspense fallback={<View testID="nested-sus-id"><PlaceholderBox /></View>}>
 *   <OurFancyComponent />
 * </Suspense>
 * ```
 */
export const waitForSuspenseToBeRemoved = (testID?: string) =>
  waitForElementToBeRemoved(() =>
    testID === undefined ? screen.getByText("TEST-SUSPENSE-LOADING") : screen.getByTestId(testID)
  )
