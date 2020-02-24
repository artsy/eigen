import _ from "lodash"

/**
 * This takes the extra extension metadata that staging and dev metaphysics
 * sends about API requests it makes for you, and logs it out during dev
 * time into your console at the same places as the relay queries.
 */
export function metaphysicsExtensionsLoggerMiddleware() {
  return next => req => {
    return next(req).then(res => {
      if (res.json.extensions && console.groupCollapsed) {
        // See: https://github.com/artsy/metaphysics/blob/master/src/lib/loaders/api/extensionsLogger.ts
        const requests = res.json.extensions.requests

        // Pull out the stitching logs, e.g. what graphql requests
        // did stitching do for you under the hood
        const stitching = requests.stitching
        const stitchCount = stitching && Object.keys(stitching)
        const stitchSummary = stitchCount ? `${stitchCount} stitched` : ""

        // Grab the rest API requests (only ones that use DataLoader)
        // so this is kinda a sub-set but it's more or less everything
        const apis = _.omit(requests, ["stitching"])
        const requestCount = Object.keys(apis)
          .map(k => Object.keys(requests[k].requests).length) // API requests
          .reduce((a, c) => a + c, 0) // Add them all up

        // Not telling anyone off, but over 15 is probably a point
        // where you want that highlighted.
        const colorForRequests = requestCount >= 15 ? "color: #F1AF1B;" : "color: #6E1EFF;"

        // The way the console coloring works is you use %c as an inline span
        // sentinal to correlate style to the next set of characters
        //
        // So we'll need some styles to work with
        const noBold = "font-weight: normal;"
        const noColor = "color: black; font-weight: normal;"
        const requestSummary = requestCount
          ? `%c ${requestCount} %ccalls` // These need consistent amounts of %c
          : "%c%c"

        const title = `%cMetaphysics API -${requestSummary}${stitchSummary}`

        // Make sure we have something to show
        if (requestCount || stitchCount) {
          // The main title for the metaphysics section
          console.groupCollapsed(title, noBold, colorForRequests, noColor)

          // Loop through all of the hosts, make a subsection for those
          // and show the raw request obj in-case we add new things to it
          if (requestCount) {
            Object.keys(apis).forEach(host => {
              console.group(host)
              Object.keys(apis[host].requests).forEach(route => {
                console.log(route, apis[host].requests[route])
              })
              console.groupEnd()
            })
          }

          // Show stitched queries inline. This will probably need work in
          // the future, because I bet it's ugly.
          if (stitchCount) {
            console.group("Stitched")
            // FIXME: This is erroring on staging
            // stitching.requests.forEach(element => {
            //   console.log(element.requests)
            // })
            console.groupEnd()
          }

          // Wrap up the metaphysics section
          console.groupEnd()
        }
      }
      return res
    })
  }
}
