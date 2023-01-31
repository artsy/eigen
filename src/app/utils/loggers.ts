let metaflags = {
  logAction: false,
  logDatadog: false,
  logEventTracked: false,
  logNavigation: false,
  logNotification: false,
  logOperation: false,
  logPrefetching: false,
  logQueryPath: false,
  logRelay: false,
  logRelayVerbose: false,
  logRunningRequest: false,
}
if (__DEV__ || __TEST__) {
  try {
    const fileContents = require("../../../metaflags.json")
    metaflags = { ...metaflags, ...fileContents }
  } catch (error) {
    console.log("[loggers] Error loading metaflags.json", error)
  }
}

export const logAction = metaflags.logAction
export const logDatadog = metaflags.logDatadog
export const logEventTracked = metaflags.logEventTracked
export const logNavigation = metaflags.logNavigation
export const logNotification = metaflags.logNotification
export const logOperation = metaflags.logOperation
export const logPrefetching = metaflags.logPrefetching
export const logQueryPath = metaflags.logQueryPath
export const logRelay = metaflags.logRelay
export const logRelayVerbose = metaflags.logRelayVerbose
export const logRunningRequest = metaflags.logRunningRequest
