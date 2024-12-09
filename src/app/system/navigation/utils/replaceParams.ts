// Helper method that strips of the params in a url
/**
 * This is a helper method that converts a url + params object into a valid url
 * @param url string
 * @param params object
 * @returns string
 * @example replaceParams("/artist/:id", { id: "banksy" })) = "/artist/banksy"
 */
export function replaceParams(url: string, params: any) {
  url = url.replace(/\*$/, params["*"])
  let match = url.match(/:(\w+)/)
  while (match) {
    const key = match[1]
    if (!(key in params)) {
      console.error("[replaceParams]: something is very wrong", key, params)
      return url
    }
    url = url.replace(":" + key, params[key])
    match = url.match(/:(\w+)/)
  }
  return url
}
