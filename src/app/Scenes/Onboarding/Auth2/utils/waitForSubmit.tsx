/**
 * Slight delay to smooth out keyboard transitions between submission steps
 */
export const waitForSubmit = async (delay = 1500) => {
  return new Promise((resolve: any) => setTimeout(resolve, delay))
}
