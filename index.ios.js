global.__TEST__ = false
global.__STORYBOOK__ = false

// for more info about metaflags, look [here](/docs/metaflags.md)
let metaflags = {
  startStorybook: false,
}
if (__DEV__) {
  try {
    const fileContents = require("./metaflags.json")
    metaflags = { ...metaflags, ...fileContents }
  } catch {}
}

require("./src/app/errorReporting/sentrySetup").setupSentry({ environment: "bootstrap" })

if (metaflags.startStorybook) {
  global.__STORYBOOK__ = true
  require("./src/storybook")
} else {
  if (global.HermesInternal) {
    // Polyfills required to use Intl with Hermes engine
    require("@formatjs/intl-getcanonicallocales/polyfill")
    require("@formatjs/intl-locale/polyfill")
    require("@formatjs/intl-pluralrules/polyfill")
    require("@formatjs/intl-pluralrules/locale-data/en")
    require("@formatjs/intl-numberformat/polyfill")
    require("@formatjs/intl-numberformat/locale-data/en")
    require("@formatjs/intl-datetimeformat/polyfill")
    require("@formatjs/intl-datetimeformat/locale-data/en")
    require("@formatjs/intl-datetimeformat/add-golden-tz")
  }

  require("react-native-gesture-handler")
  require("react-native-screens").enableScreens()
  require("./src/app/AppRegistry")
}

// add a comment
