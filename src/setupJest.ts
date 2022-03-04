// @ts-ignore
import mockRNCNetInfo from "@react-native-community/netinfo/jest/netinfo-mock.js"
import "@testing-library/jest-native/extend-expect"
import "jest-extended"

import chalk from "chalk"
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import Enzyme from "enzyme"
// @ts-ignore
import Adapter from "enzyme-adapter-react-16"
import expect from "expect"
import { format } from "util"

import "app/tests/renderUntil"
Enzyme.configure({ adapter: new Adapter() })

// Waiting on https://github.com/thymikee/snapshot-diff/pull/17
import diff from "snapshot-diff"
expect.extend({ toMatchDiffSnapshot: (diff as any).toMatchDiffSnapshot })

jest.mock("react-native-screens/native-stack", () => {
  return {
    createNativeStackNavigator: require("@react-navigation/stack").createStackNavigator,
  }
})

// tslint:disable-next-line:no-var-requires
require("jest-fetch-mock").enableMocks()

import { mockPostEventToProviders, mockTrackEvent } from "app/tests/globallyMockedStuff"

jest.mock("react-tracking")
import track, { useTracking } from "react-tracking"
;(track as jest.Mock).mockImplementation(() => (x: any) => x)
;(useTracking as jest.Mock).mockImplementation(() => ({ trackEvent: mockTrackEvent }))

jest.mock("app/utils/track/providers", () => ({
  ...jest.requireActual("app/utils/track/providers"),
  postEventToProviders: jest.fn(),
}))

jest.mock("app/relay/createEnvironment", () => ({
  defaultEnvironment: require("relay-test-utils").createMockEnvironment(),
  reset(this: { defaultEnvironment: any }) {
    this.defaultEnvironment = require("relay-test-utils").createMockEnvironment()
  },
}))

jest.mock("tipsi-stripe", () => ({
  setOptions: jest.fn(),
  paymentRequestWithCardForm: jest.fn(),
  createTokenWithCard: jest.fn(),
}))

// Mock this separately so react-tracking can be unmocked in tests but not result in the `window` global being accessed.
jest.mock("react-tracking/build/dispatchTrackingEvent")

jest.mock("@react-native-community/netinfo", () => mockRNCNetInfo)

jest.mock("./app/NativeModules/NotificationsManager.tsx", () => ({
  NotificationsManager: new (require("events").EventEmitter)(),
}))

jest.mock("./app/utils/userHadMeaningfulInteraction.tsx", () => ({
  userHadMeaningfulInteraction: jest.fn(),
}))

jest.mock("react-native-share", () => ({
  open: jest.fn(),
}))

jest.mock("react-native-device-info", () => ({
  getBuildNumber: jest.fn(),
  getVersion: jest.fn(),
  getModel: () => "testDevice",
  getUserAgentSync: jest.fn(),
  getDeviceType: jest.fn(),
  hasNotch: jest.fn(),
}))

jest.mock("rn-fetch-blob", () => ({
  fs: {
    dirs: {
      DocumentDir: "",
    },
  },
}))

jest.mock("danger", () => ({
  danger: {},
  markdown: (message: string) => message,
  warn: jest.fn(),
}))

jest.mock("@react-native-cookies/cookies", () => ({ clearAll: jest.fn() }))

beforeEach(() => {
  require("@react-native-cookies/cookies").clearAll.mockReset()
})

jest.mock("react-native-fbsdk-next", () => ({
  LoginManager: {
    logOut: jest.fn(),
    logInWithPermissions: jest.fn(),
  },
  AccessToken: {
    getCurrentAccessToken: jest.fn(),
  },
  GraphRequest: jest.fn(),
  GraphRequestManager: jest.fn(() => ({
    addRequest: jest.fn(() => ({
      start: jest.fn(),
    })),
  })),
}))

jest.mock("@react-native-google-signin/google-signin", () => ({
  GoogleSignin: {
    configure: jest.fn(),
    getTokens: jest.fn(),
    hasPlayServices: jest.fn(),
    revokeAccess: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
  },
}))

jest.mock("@invertase/react-native-apple-authentication", () => ({
  appleAuth: {
    performRequest: jest.fn(),
    Operation: {
      LOGIN: 1,
    },
    Scope: {
      EMAIL: 0,
      FULL_NAME: 1,
    },
  },
}))

// prettier-ignore
// tslint:disable-next-line:no-empty
jest.mock("@sentry/react-native", () => ({ captureMessage() {},  init() {},  setUser() {},  addBreadcrumb() {},  withScope() {} }))

// Needing to mock react-native-scrollable-tab-view due to Flow issue
jest.mock("react-native-scrollable-tab-view", () => jest.fn(() => null))

jest.mock("@react-native-mapbox-gl/maps", () => ({
  MapView: () => null,
  StyleURL: {
    Light: null,
  },
  setAccessToken: () => jest.fn(),
  StyleSheet: {},
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
      /Warning: An update to [\w\s]+ inside a test was not wrapped in act/.test(message) ||
      /Warning: Received `\w+` for a non-boolean attribute `\w+`\./.test(message) ||
      /Warning: [\w\s]+ has been extracted from react-native core/.test(message))
  ) {
    // NOOP
  } else {
    originalConsoleError(message)
  }
}

mockedModule("./app/Components/OpaqueImageView/OpaqueImageView.tsx", "AROpaqueImageView")
// mockedModule("./app/Components/ArtworkGrids/InfiniteScrollGrid.tsx", "ArtworksGrid")

// Artist tests
mockedModule("./app/Components/Artist/ArtistArtworks/ArtistArtworks.tsx", "ArtistArtworks")

// Gene tests
mockedModule("./app/Components/Gene/Header.tsx", "Header")

// Native modules
import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { ScreenDimensionsWithSafeAreas } from "app/utils/useScreenDimensions"
import { NativeModules } from "react-native"

type OurNativeModules = typeof LegacyNativeModules & { ArtsyNativeModule: typeof ArtsyNativeModule }

function getNativeModules(): OurNativeModules {
  return {
    ARTakeCameraPhotoModule: {
      errorCodes: {
        cameraNotAvailable: "cameraNotAvailable",
        imageMediaNotAvailable: "imageMediaNotAvailable",
        cameraAccessDenied: "cameraAccessDenied",
        saveFailed: "saveFailed",
      },
      triggerCameraModal: jest.fn(),
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
        authenticationToken: "authenticationToken",
        launchCount: 1,
        deviceId: "testDevice",
        userID: "userID",
        userEmail: "user@example.com",
      },
      postNotificationName: jest.fn(),
      didFinishBootstrapping: jest.fn(),
      reactStateUpdated: jest.fn(),
    },

    ARTemporaryAPIModule: {
      requestPrepromptNotificationPermissions: jest.fn(),
      requestDirectNotificationPermissions: jest.fn(),
      fetchNotificationPermissions: jest.fn(),
      markNotificationsRead: jest.fn(),
      setApplicationIconBadgeNumber: jest.fn(),
      getUserEmail: jest.fn(),
    },
    ARPHPhotoPickerModule: {
      requestPhotos: jest.fn(),
    },
    ARScreenPresenterModule: {
      presentMediaPreviewController: jest.fn(),
      dismissModal: jest.fn(),
      pushView: jest.fn(),
      goBack: jest.fn(),
      updateShouldHideBackButton: jest.fn(),
      presentAugmentedRealityVIR: jest.fn(),
      presentEmailComposerWithBody: jest.fn(),
      presentEmailComposerWithSubject: jest.fn(),
      popStack: jest.fn(),
      popToRootAndScrollToTop: jest.fn(),
      popToRootOrScrollToTop: jest.fn(),
      presentModal: jest.fn(),
    },
    AREventsModule: {
      requestAppStoreRating: jest.fn(),
    },
    ArtsyNativeModule: {
      launchCount: 3,
      setAppStyling: jest.fn(),
      setNavigationBarColor: jest.fn(),
      setAppLightContrast: jest.fn(),
      navigationBarHeight: 11,
      lockActivityScreenOrientation: jest.fn(),
      gitCommitShortHash: "de4dc0de",
      isBetaOrDev: true,
      updateAuthState: jest.fn(),
      clearUserData: jest.fn(),
    },
  }
}

jest.mock("app/navigation/navigate", () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  dismissModal: jest.fn(),
  popToRoot: jest.fn(),
  navigateToEntity: jest.fn(),
  navigateToPartner: jest.fn(),
  switchTab: jest.fn(),
  navigationEvents: new (require("events").EventEmitter)(),
  EntityType: { partner: "partner", fair: "fair" },
  SlugType: { partner: "partner", fair: "fair" },
}))

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
  reset(require("app/navigation/navigate"), {})
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
    mockTrackEvent.mockClear()
    mockPostEventToProviders.mockClear()
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

jest.mock("./app/utils/useScreenDimensions", () => {
  const React = require("react")
  const screenDimensions: ScreenDimensionsWithSafeAreas = {
    width: 380,
    height: 550,
    orientation: "portrait",
    size: "small",
    isSmallScreen: true,
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

jest.mock("react-native-safe-area-context", () => {
  return {
    ...jest.requireActual("react-native-safe-area-context"),
    useSafeAreaFrame: () => ({
      width: 380,
      height: 550,
      x: 0,
      y: 0,
    }),
  }
})

jest.mock("@react-native-async-storage/async-storage", () => {
  let state: any = {}
  return {
    __resetState() {
      state = {}
    },
    async setItem(key: string, val: any) {
      state[key] = val
    },
    async getItem(key: string) {
      return state[key]
    },
    async removeItem(key: string) {
      delete state[key]
    },
    async clear() {
      state = {}
    },
    async getAllKeys() {
      return Object.keys(state)
    },
    mergeItem() {
      throw new Error("mock version of mergeItem not yet implemented")
    },
    multiGet(
      keys: string[],
      callback?: (
        errors?: string[] | undefined,
        result?: Array<[string, string | null]> | undefined
      ) => void | undefined
    ) {
      return new Promise((resolve) => {
        const res = []
        for (const key of keys) {
          const val = [key, state[key]]
          res.push(val)
        }
        callback?.(undefined, undefined) // TODO: Do a proper callback
        resolve(res)
      })
    },
    multiMerge() {
      throw new Error("mock version of multiMerge not yet implemented")
    },
    async multiRemove(keys: string[]) {
      keys.forEach((k) => {
        delete state[k]
      })
    },
    multiSet(
      keyValuePairs: string[][],
      callback?: ((errors?: string[] | undefined) => void) | undefined
    ) {
      return new Promise((resolve) => {
        for (const keyValue of keyValuePairs) {
          state[keyValue[0]] = keyValue[1]
        }
        callback?.()
        resolve(true)
      })
    },
  }
})

jest.mock("@react-native-async-storage/async-storage", () => {
  let state: any = {}
  return {
    __resetState() {
      state = {}
    },
    async setItem(key: string, val: any) {
      state[key] = val
    },
    async getItem(key: string) {
      return state[key]
    },
    async removeItem(key: string) {
      delete state[key]
    },
    async clear() {
      state = {}
    },
    async getAllKeys() {
      return Object.keys(state)
    },
    mergeItem() {
      throw new Error("mock version of mergeItem not yet implemented")
    },
    multiGet(
      keys: string[],
      callback?: (
        errors?: string[] | undefined,
        result?: Array<[string, string | null]> | undefined
      ) => void | undefined
    ) {
      return new Promise((resolve) => {
        const res = []
        for (const key of keys) {
          const val = [key, state[key]]
          res.push(val)
        }
        callback?.(undefined, undefined) // TODO: Do a proper callback
        resolve(res)
      })
    },
    multiMerge() {
      throw new Error("mock version of multiMerge not yet implemented")
    },
    async multiRemove(keys: string[]) {
      keys.forEach((k) => {
        delete state[k]
      })
    },
    multiSet(
      keyValuePairs: string[][],
      callback?: ((errors?: string[] | undefined) => void) | undefined
    ) {
      return new Promise((resolve) => {
        for (const keyValue of keyValuePairs) {
          state[keyValue[0]] = keyValue[1]
        }
        callback?.()
        resolve(true)
      })
    },
  }
})

jest.mock("react-native-localize", () => ({
  getCountry: jest.fn(() => "US"),
  getLocales() {
    return [
      { countryCode: "US", languageTag: "en-US", languageCode: "en", isRTL: false },
      { countryCode: "FR", languageTag: "fr-FR", languageCode: "fr", isRTL: false },
    ]
  },
  getCurrencies() {
    return ["USD", "EUR"]
  },
  getTimeZone() {
    return "America/New_York"
  },
}))

jest.mock("react-native-reanimated", () => require("react-native-reanimated/mock"))

jest.mock("react-native/Libraries/LayoutAnimation/LayoutAnimation", () => ({
  ...jest.requireActual("react-native/Libraries/LayoutAnimation/LayoutAnimation"),
  configureNext: jest.fn((_config, callback) => callback?.()),
  create: jest.fn(),
  easeInEaseOut: jest.fn(),
  linear: jest.fn(),
  spring: jest.fn(),
}))

jest.mock("react-native-gesture-handler", () => {
  const View = require("react-native/Libraries/Components/View/View")
  const TouchableWithoutFeedback = require("react-native/Libraries/Components/Touchable/TouchableWithoutFeedback")
  const TouchableHighlight = require("react-native/Libraries/Components/Touchable/TouchableHighlight")
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    /* Buttons */
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    /* Other */
    FlatList: View,
    gestureHandlerRootHOC: jest.fn(),
    Directions: {},
    TouchableHighlight,
    TouchableWithoutFeedback,
  }
})

jest.mock("react-native-config", () => {
  const mockConfig = {
    ARTSY_DEV_API_CLIENT_SECRET: "artsy_api_client_secret",
    ARTSY_DEV_API_CLIENT_KEY: "artsy_api_client_key",
    ARTSY_PROD_API_CLIENT_SECRET: "artsy_api_client_secret",
    ARTSY_PROD_API_CLIENT_KEY: "artsy_api_client_key",
    ARTSY_FACEBOOK_APP_ID: "artsy_facebook_app_id",
    SEGMENT_PRODUCTION_WRITE_KEY_IOS: "segment_production_write_key_ios",
    SEGMENT_PRODUCTION_WRITE_KEY_ANDROID: "segment_production_write_key_android",
    SEGMENT_STAGING_WRITE_KEY_IOS: "segment_staging_write_key_ios",
    SEGMENT_STAGING_WRITE_KEY_ANDROID: "segment_staging_write_key_android",
    SENTRY_DSN: "sentry_dsn",
    GOOGLE_MAPS_API_KEY: "google_maps_api_key",
    MAPBOX_API_CLIENT_KEY: "mapbox_api_client_key",
    UNLEASH_PROXY_CLIENT_KEY_PRODUCTION: "unleash_proxy_client_key_production", // pragma: allowlist secret
    UNLEASH_PROXY_CLIENT_KEY_STAGING: "unleash_proxy_client_key_staging", // pragma: allowlist secret
    UNLEASH_PROXY_URL_PRODUCTION: "https://unleash_proxy_url_production", // pragma: allowlist secret
    UNLEASH_PROXY_URL_STAGING: "https://unleash_proxy_url_staging", // pragma: allowlist secret
  }
  // support both default and named export
  return { ...mockConfig, Config: mockConfig }
})

jest.mock("react-native-view-shot", () => ({}))

// MOCKS FOR TRACKING
jest.mock("@segment/analytics-react-native", () => ({
  setup: () => null,
  identify: () => null,
  reset: () => null,
}))

jest.mock("@segment/analytics-react-native-appboy", () => ({}))

jest.mock("app/utils/track/SegmentTrackingProvider", () => ({
  SegmentTrackingProvider: {
    setup: () => null,
    identify: jest.fn(),
    postEvent: () => null,
  },
}))

jest.mock("app/utils/track/providers.tsx", () => ({
  postEventToProviders: jest.fn(),
  _addTrackingProvider: jest.fn(),
}))

jest.mock("react-native-push-notification", () => ({
  configure: jest.fn(),
  onRegister: jest.fn(),
  onNotification: jest.fn(),
  addEventListener: jest.fn(),
  requestPermissions: jest.fn(),
  checkPermissions: jest.fn(),
  createChannel: jest.fn(),
  localNotification: jest.fn(),
}))

jest.mock("react-native-keychain", () => ({
  setInternetCredentials: jest.fn().mockResolvedValue(true),
}))
