/**
 * Check if the url is an Artsy marketing url
 * @param url - The url to check
 * @returns boolean
 */
export const isMarketingURL = (url: string) => {
  return url.includes("click.artsy.net") || url.includes("email-link.artsy.net")
}
