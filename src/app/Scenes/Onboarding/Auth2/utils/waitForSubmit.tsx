/**
 * Slight delay to smooth out keyboard transitions between submission steps
 */
export const waitForSubmit = async (delay = 1000) => {
  return new Promise((resolve: any) => setTimeout(resolve, delay))
}
