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
if (__DEV__) {
  try {
    // tslint:disable-next-line:no-var-requires
    const fileContents = require("../../../metaflags.json")
    metaflags = { ...metaflags, ...fileContents }
    // tslint:disable-next-line:no-empty
  } catch {}
}

export const logAction = metaflags.logAction
export const logDatadog = metaflags.logRunningRequest
export const logEventTracked = metaflags.logRunningRequest
export const logNotification = metaflags.logRunningRequest
export const logOperation = metaflags.logRunningRequest
export const logPrefetching = metaflags.logRunningRequest
export const logRelay = metaflags.logRunningRequest
export const logRoute = metaflags.logRunningRequest
export const logRunningRequest = metaflags.logRunningRequest
