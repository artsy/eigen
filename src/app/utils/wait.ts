/**
  This function is used to simulate a delay in the app.
  It needs to be used with await to work and waitFor to test it.
   * @param {number} milliseconds - The number of milliseconds to wait.

*/
export const wait = (milliseconds: number): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, milliseconds)
  })
}
