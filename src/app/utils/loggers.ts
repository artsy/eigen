let metaflags = {
  loggerRelay: false,
}
if (__DEV__) {
  try {
    // tslint:disable-next-line:no-var-requires
    const fileContents = require("../../../metaflags.json")
    metaflags = { ...metaflags, ...fileContents }
    // tslint:disable-next-line:no-empty
  } catch {}
}

export const loggerRelay = metaflags.loggerRelay
