// re: https://github.com/facebook/react-native/issues/19955
// and https://github.com/facebook/metro/pull/198
//
// import applyDecoratedDescriptor from "@babel/runtime/helpers/applyDecoratedDescriptor"
// import initializerDefineProperty from "@babel/runtime/helpers/initializerDefineProperty"
// declare var babelHelpers: any
// Object.assign(babelHelpers, { applyDecoratedDescriptor, initializerDefineProperty })
// import "@babel/runtime"

import chalk from "chalk"
// @ts-ignore
import Enzyme from "enzyme"
// @ts-ignore
import Adapter from "enzyme-adapter-react-16"
import expect from "expect"
import { format } from "util"

import "lib/tests/renderUntil"
Enzyme.configure({ adapter: new Adapter() })

// Waiting on https://github.com/thymikee/snapshot-diff/pull/17
import diff from "snapshot-diff"
expect.extend({ toMatchDiffSnapshot: (diff as any).toMatchDiffSnapshot })

jest.mock("react-tracking")
import track, { useTracking } from "react-tracking"
const trackEvent = jest.fn()
;(track as jest.Mock).mockImplementation(() => (x: any) => x)
;(useTracking as jest.Mock).mockImplementation(() => {
  return {
    trackEvent,
  }
})

// Mock this separately so react-tracking can be unmocked in tests but not result in the `window` global being accessed.
jest.mock("react-tracking/build/dispatchTrackingEvent")

jest.mock("@react-native-community/netinfo", () => {
  return {
    fetch: jest.fn(() =>
      Promise.resolve({
        type: "cellular",
        details: {
          cellularGeneration: "5g",
        },
      })
    ),
  }
})

jest.mock("./lib/NativeModules/NotificationsManager.tsx", () => ({
  NotificationsManager: new (require("events").EventEmitter)(),
}))

jest.mock("./lib/NativeModules/Events.tsx", () => ({
  postEvent: jest.fn(),
  userHadMeaningfulInteraction: jest.fn(),
}))

// tslint:disable-next-line:no-empty
jest.mock("@sentry/react-native", () => ({ captureMessage() {} }))

// Needing to mock react-native-scrollable-tab-view due to Flow issue
jest.mock("react-native-scrollable-tab-view", () => jest.fn())

jest.mock("@mapbox/react-native-mapbox-gl", () => ({
  MapView: () => null,
  StyleURL: {
    Light: null,
  },
  setAccessToken: () => jest.fn(),
  StyleSheet: {
    create: () => jest.fn(),
  },
  ShapeSource: () => null,
  SymbolLayer: () => null,
}))

function mockedModule(path: string, mockModuleName: string) {
  jest.mock(path, () => mockModuleName)
}

const originalConsoleError = console.error

// TODO: Remove once we're no longer using JSDOM for enzyme static rendering.
console.error = (message?: any) => {
  if (
    typeof message === "string" &&
    (message.includes("is using uppercase HTML. Always use lowercase HTML tags in React.") ||
      /Warning: React does not recognize the `\w+` prop on a DOM element\./.test(message) ||
      /Warning: The tag <\w+> is unrecognized in this browser\./.test(message) ||
      /Warning: Unknown event handler property `\w+`\./.test(message) ||
      /Warning: Received `\w+` for a non-boolean attribute `\w+`\./.test(message) ||
      /Warning: [\w\s]+ has been extracted from react-native core/.test(message))
  ) {
    // NOOP
  } else {
    originalConsoleError(message)
  }
}

mockedModule("./lib/Components/Spinner.tsx", "ARSpinner")
mockedModule("./lib/Components/OpaqueImageView/OpaqueImageView.tsx", "AROpaqueImageView")
// mockedModule("./lib/Components/ArtworkGrids/InfiniteScrollGrid.tsx", "ArtworksGrid")

// Artist tests
mockedModule("./lib/Components/Artist/ArtistShows/ArtistShows.tsx", "ArtistShows")
mockedModule("./lib/Components/Artist/ArtistArtworks/ArtistArtworks.tsx", "ArtistArtworks")
mockedModule("./lib/Components/Artist/ArtistHeader.tsx", "ArtistHeader")
mockedModule("./lib/Components/Artist/ArtistAbout.tsx", "ArtistAbout")

// Gene tests
mockedModule("./lib/Components/Gene/Header.tsx", "Header")

// Native modules
import { ScreenDimensionsWithSafeAreas } from "lib/utils/useScreenDimensions"
import { NativeModules } from "react-native"

function getNativeModules(): typeof NativeModules {
  return {
    ARTakeCameraPhotoModule: {
      errorCodes: {
        cameraNotAvailable: "cameraNotAvailable",
        imageMediaNotAvailable: "imageMediaNotAvailable",
        cameraAccessDenied: "cameraAccessDenied",
        saveFailed: "saveFailed",
      },
    },

    ARCocoaConstantsModule: {
      UIApplicationOpenSettingsURLString: "UIApplicationOpenSettingsURLString",
      AREnabled: true,
      CurrentLocale: "en_US",
      LocalTimeZone: "",
    },

    ARNotificationsManager: {
      nativeState: {
        userAgent: "Jest Unit Tests",
        env: "test",
        authenticationToken: "authenticationToken",
        onboardingState: "complete",
        gravityURL: "gravityURL",
        launchCount: 1,
        metaphysicsURL: "metaphysicsURL",
        deviceId: "testDevice",
        predictionURL: "predictionURL",
        webURL: "webURL",
        sentryDSN: "sentryDSN",
        stripePublishableKey: "stripePublishableKey",
        userID: "userID",
        selectedTab: "home",
        options: {
          AROptionsBidManagement: false,
          AROptionsEnableMyCollection: false,
          AROptionsLotConditionReport: false,
          AROptionsPriceTransparency: false,
          AROptionsViewingRooms: false,
          AROptionsNewSalePage: false,
          AREnableViewingRooms: false,
          AROptionsArtistSeries: false,
          ipad_vir: false,
          iphone_vir: false,
          ARDisableReactNativeBidFlow: false,
          AREnableNewPartnerView: false,
          AROptionsNewFirstInquiry: false,
          AROptionsUseReactNativeWebView: false,
          AROptionsNewShowPage: false,
          AROptionsNewFairPage: false,
        },
        legacyFairSlugs: ["some-fairs-slug", "some-other-fair-slug"],
        legacyFairProfileSlugs: [],
      },
      postNotificationName: jest.fn(),
      didFinishBootstrapping: jest.fn(),
    },

    ARTemporaryAPIModule: {
      validateAuthCredentialsAreCorrect: jest.fn(),
      requestNotificationPermissions: jest.fn(),
      fetchNotificationPermissions: jest.fn(),
      markNotificationsRead: jest.fn(),
      setApplicationIconBadgeNumber: jest.fn(),
      appVersion: "appVersion",
    },

    ARSwitchBoardModule: {
      presentNavigationViewController: jest.fn(),
      presentModalViewController: jest.fn(),
      presentMediaPreviewController: jest.fn(),
      presentArtworksSet: jest.fn(),
      updateShouldHideBackButton: jest.fn(),
    },
    Emission: null as never,
    ARScreenPresenterModule: {
      presentMediaPreviewController: jest.fn(),
      dismissModal: jest.fn(),
      presentReactScreen: jest.fn(),
      goBack: jest.fn(),
      presentNativeScreen: jest.fn(),
      switchTab: jest.fn(),
      updateShouldHideBackButton: jest.fn(),
      presentAugmentedRealityVIR: jest.fn(),
      presentEmailComposer: jest.fn(),
    },
  }
}

jest.mock("lib/navigation/navigate", () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  dismissModal: jest.fn(),
}))
jest.mock("lib/NativeModules/SwitchBoard", () => {
  const fns = {
    presentNavigationViewController: jest.fn(),
    presentMediaPreviewController: jest.fn(),
    presentModalViewController: jest.fn(),
    presentPartnerViewController: jest.fn(),
    dismissModalViewController: jest.fn(),
    dismissNavigationViewController: jest.fn(),
  }
  return {
    EntityType: { partner: "partner", fair: "fair" },
    SlugType: { partner: "partner", fair: "fair" },
    ...fns,
  }
})

Object.assign(NativeModules, getNativeModules())

const _ = jest.requireActual("lodash")
beforeEach(() => {
  function reset(a: any, b: any) {
    Object.keys(a).forEach((k) => {
      if (_.isPlainObject(a[k])) {
        reset(a[k], b[k])
      } else {
        if (a[k]?.mockReset) {
          a[k].mockReset()
        } else {
          a[k] = b?.[k] ?? a[k]
        }
      }
    })
  }
  reset(NativeModules, getNativeModules())
})

declare const process: any

// @ts-ignore
global.__TEST__ = true

if (process.env.ALLOW_CONSOLE_LOGS !== "true") {
  const originalLoggers = {
    error: console.error,
    warn: console.warn,
  }

  function logToError(type: keyof typeof console, args: unknown[], constructorOpt: () => void) {
    const explanation =
      chalk.white(`Test failed due to \`console.${type}(…)\` call.\n`) +
      chalk.gray("(Disable with ALLOW_CONSOLE_LOGS=true env variable.)\n\n")
    if (args[0] instanceof Error) {
      const msg = explanation + chalk.red(args[0].message)
      const err = new Error(msg)
      err.stack = args[0].stack!.replace(`Error: ${args[0].message}`, msg)
      return err
    } else if (
      // Because we use react-dom in tests to render react-native components, a few warnings are being logged that we do
      // not care for, so ignore these.
      typeof args[0] === "string" &&
      !args[0].includes("is using incorrect casing") &&
      !args[0].includes("is unrecognized in this browser") &&
      ![args[0].includes("React does not recognize the `testID` prop on a DOM element.")]
    ) {
      const err = new Error(explanation + chalk.red(format(args[0], ...args.slice(1))))
      ;(Error as any).captureStackTrace(err, constructorOpt)
      return err
    }
    return null
  }

  beforeEach((done) => {
    trackEvent.mockClear()
    const types: Array<"error" | "warn"> = ["error", "warn"]
    types.forEach((type) => {
      // Don't spy on loggers that have been modified by the current test.
      if (console[type] === originalLoggers[type]) {
        const handler = (...args: unknown[]) => {
          const error = logToError(type, args, handler)
          if (error) {
            done.fail(error)
          }
        }
        jest.spyOn(console, type).mockImplementation(handler)
      }
    })
    done() // it is important to call this here or every test will timeout
  })
}

jest.mock("./lib/utils/useScreenDimensions", () => {
  const React = require("react")
  const screenDimensions: ScreenDimensionsWithSafeAreas = {
    width: 380,
    height: 550,
    orientation: "portrait",
    safeAreaInsets: {
      top: 20,
      left: 0,
      right: 0,
      bottom: 0,
    },
  }

  return {
    ScreenDimensionsContext: {
      Consumer: ({ children }: any) => children(screenDimensions),
    },
    ProvideScreenDimensions: ({ children }: React.PropsWithChildren<{}>) => {
      return React.createElement(React.Fragment, null, children)
    },
    useScreenDimensions: () => screenDimensions,
  }
})

jest.mock("@react-native-community/async-storage", () => {
  let state: any = {}
  return {
    __resetState() {
      state = {}
    },
    setItem(key: string, val: any) {
      state[key] = val
      return Promise.resolve()
    },
    getItem(key: string) {
      return Promise.resolve(state[key])
    },
    removeItem(key: string) {
      delete state[key]
      return Promise.resolve()
    },
    clear() {
      state = {}
      return Promise.resolve()
    },
    getAllKeys() {
      return Promise.resolve(Object.keys(state))
    },
    mergeItem() {
      throw new Error("mock version of mergeItem not yet implemented")
    },
    multiGet() {
      throw new Error("mock version of multiGet not yet implemented")
    },
    multiMerge() {
      throw new Error("mock version of multiMerge not yet implemented")
    },
    multiRemove() {
      throw new Error("mock version of multiRemove not yet implemented")
    },
    multiSet() {
      throw new Error("mock version of multiSet not yet implemented")
    },
  }
})

jest.mock("react-native-reanimated", () => require("react-native-reanimated/mock"))

jest.mock("react-native/Libraries/LayoutAnimation/LayoutAnimation", () => ({
  ...require.requireActual("react-native/Libraries/LayoutAnimation/LayoutAnimation"),
  configureNext: jest.fn((_config, callback) => callback?.()),
  create: jest.fn(),
  easeInEaseOut: jest.fn(),
  linear: jest.fn(),
  spring: jest.fn(),
}))

jest.mock("react-native-config", () => ({
  ARTSY_API_CLIENT_SECRET: "-",
  ARTSY_API_CLIENT_KEY: "-",
  ARTSY_FACEBOOK_APP_ID: "-",
  SEGMENT_PRODUCTION_WRITE_KEY: "-",
  SEGMENT_STAGING_WRITE_KEY: "-",
  ARTSY_ECHO_PRODUCTION_TOKEN: "-",
  SEGMENT_PRODUCTION_DSN: "-",
  SEGMENT_STAGING_DSN: "-",
  GOOGLE_MAPS_API_KEY: "-",
  MAPBOX_API_CLIENT_KEY: "-",
  SAILTHRU_KEY: "-",
}))
