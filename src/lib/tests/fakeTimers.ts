// Read docs at for more info on these https://testing-library.com/docs/using-fake-timers

/**
 * Test helper function to set up fakeTimers correctly.
 *
 * When using this, be sure to use `fakeTimersAfterEach` as well!
 *
 * @example
 * describe("our tests", () => {
 *   beforeEach(() => {
 *     fakeTimersBeforeEach()
 *   })
 *
 *   afterEach(() => {
 *     fakeTimersAfterEach()
 *   })
 *
 *   it("works", () => {
 *     expect(true).toBeTruthy()
 *   })
 * })
 */
export const fakeTimersBeforeEach = () => {
  jest.useFakeTimers()
}

/**
 * Test helper function to set up fakeTimers correctly.
 *
 * When using this, be sure to use `fakeTimersBeforeEach` as well!
 */
export const fakeTimersAfterEach = () => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
}
