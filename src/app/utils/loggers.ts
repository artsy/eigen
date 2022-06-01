let metaflags = {
  logAction: false,
  logDatadog: false,
  logEventTracked: false,
  logNotification: false,
  logOperation: false,
  logPrefetching: false,
  logRelay: false,
  logRoute: false,
  logRunningRequest: false,
}
if (__DEV__ || __TEST__) {
  try {
    // tslint:disable-next-line:no-var-requires
    const fileContents = require("../../../metaflags.json")
    metaflags = { ...metaflags, ...fileContents }
    // tslint:disable-next-line:no-empty
  } catch {}
}

export const logAction = metaflags.logAction
export const logDatadog = metaflags.logDatadog
export const logEventTracked = metaflags.logEventTracked
export const logNotification = metaflags.logNotification
export const logOperation = metaflags.logOperation
export const logPrefetching = metaflags.logPrefetching
export const logRelay = metaflags.logRelay
export const logRoute = metaflags.logRoute
export const logRunningRequest = metaflags.logRunningRequest
