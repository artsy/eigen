/**
 * Slight delay to smooth out keyboard transitions between submission steps
 */
export const waitForSubmit = async (delay = 1500) => {
  await Promise.resolve((resolve: any) => setTimeout(resolve, delay))
}
