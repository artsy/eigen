import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { BottomTabsModel, getBottomTabsModel } from "app/Scenes/BottomTabs/BottomTabsModel"
import {
  getMyCollectionModel,
  MyCollectionModel,
} from "app/Scenes/MyCollection/State/MyCollectionModel"
import { DevicePrefsModel, getDevicePrefsModel } from "app/Scenes/MyProfile/DevicePrefsModel"
import { getSearchModel, SearchModel } from "app/Scenes/Search/SearchModel"
import { getUserPrefsModel, UserPrefsModel } from "app/Scenes/Search/UserPrefsModel"
import { unsafe__getEnvironment } from "app/store/GlobalStore"
import { getInfiniteDiscoveryModel, InfiniteDiscoveryModel } from "app/store/InfiniteDiscoveryModel"
import { getOnboardingModel, OnboardingModel } from "app/store/OnboardingModel"
import {
  getProgressiveOnboardingModel,
  ProgressiveOnboardingModel,
} from "app/store/ProgressiveOnboardingModel"
import { Action, action, createStore, State, thunkOn, ThunkOn } from "easy-peasy"
import { ArtsyPrefsModel, getArtsyPrefsModel } from "./ArtsyPrefsModel"
import { AuthModel, getAuthModel } from "./AuthModel"
import { getNativeModel, NativeModel } from "./NativeModel"
import {
  getPendingPushNotificationModel,
  PendingPushNotificationModel,
} from "./PendingPushNotificationModel"
import { getRecentPriceRangesModel, RecentPriceRangesModel } from "./RecentPriceRangesModel"
import { getToastModel, ToastModel } from "./ToastModel"
import { getVisualClueModel, VisualClueModel } from "./VisualClueModel"
import { CURRENT_APP_VERSION } from "./migration"
import { assignDeep, sanitize } from "./persistence"

type SessionState = {
  isHydrated: boolean
  isNavigationReady: boolean
  isSplashScreenVisible: boolean
}

interface GlobalStoreStateModel {
  version: number
  sessionState: SessionState

  native: NativeModel
  bottomTabs: BottomTabsModel
  search: SearchModel
  myCollection: MyCollectionModel
  auth: AuthModel
  onboarding: OnboardingModel
  toast: ToastModel
  pendingPushNotification: PendingPushNotificationModel
  artsyPrefs: ArtsyPrefsModel
  userPrefs: UserPrefsModel
  devicePrefs: DevicePrefsModel
  visualClue: VisualClueModel
  recentPriceRanges: RecentPriceRangesModel
  progressiveOnboarding: ProgressiveOnboardingModel
  infiniteDiscovery: InfiniteDiscoveryModel
}
export interface GlobalStoreModel extends GlobalStoreStateModel {
  rehydrate: Action<this, DeepPartial<State<GlobalStoreStateModel>>>
  reset: Action<this, DeepPartial<State<GlobalStoreStateModel>>>
  resetAfterSignOut: ThunkOn<this>
  didRehydrate: ThunkOn<this>

  setSessionState: Action<this, Partial<SessionState>>

  // for dev only.
  _setVersion: Action<this, number>

  // for testing only. noop otherwise.
  __inject: Action<this, DeepPartial<State<GlobalStoreStateModel>>>
  __manipulate: Action<this, (store: this) => void>
}

const PERSIST_AFTER_SIGN_OUT_MODELS: (keyof GlobalStoreStateModel)[] = [
  "artsyPrefs",
  "devicePrefs",
  "progressiveOnboarding",
  "search",
  "recentPriceRanges",
]

export const getGlobalStoreModel = (): GlobalStoreModel => ({
  // META STATE
  version: CURRENT_APP_VERSION,
  rehydrate: action((state, unpersistedState) => {
    if (!__TEST__ && state.sessionState.isHydrated) {
      console.error("The store was already hydrated. `rehydrate` should only be called once.")
      return
    }
    assignDeep(state, unpersistedState)
    state.sessionState.isHydrated = true
  }),
  reset: action((_, state) => {
    const result = createStore(getGlobalStoreModel()).getState()
    result.sessionState.isHydrated = true
    assignDeep(result, state)
    return result
  }),
  resetAfterSignOut: thunkOn(
    (a) => a.auth.signOut,
    (actions, _, store) => {
      const {
        auth: { userID },
      } = store.getState()

      const configToPersist = PERSIST_AFTER_SIGN_OUT_MODELS.reduce(
        (acc, key) => {
          acc[key] = sanitize(store.getState()[key])
          return acc
        },
        {} as Record<keyof GlobalStoreStateModel, any>
      )

      actions.reset({ ...configToPersist, auth: { previousSessionUserID: userID } })
    }
  ),
  didRehydrate: thunkOn(
    (actions) => actions.rehydrate,
    () => {
      LegacyNativeModules.ARNotificationsManager.reactStateUpdated(unsafe__getEnvironment())
    }
  ),
  sessionState: {
    // we don't perform hydration at test time so let's set it to always true for tests
    isHydrated: __TEST__,
    isNavigationReady: false,
    isSplashScreenVisible: true,
  },

  // NATIVE MIGRATION STATE
  native: getNativeModel(),

  // APP MODULE STATE
  bottomTabs: getBottomTabsModel(),
  search: getSearchModel(),
  myCollection: getMyCollectionModel(),
  artsyPrefs: getArtsyPrefsModel(),
  auth: getAuthModel(),
  onboarding: getOnboardingModel(),
  toast: getToastModel(),
  devicePrefs: getDevicePrefsModel(),
  pendingPushNotification: getPendingPushNotificationModel(),
  userPrefs: getUserPrefsModel(),
  visualClue: getVisualClueModel(),
  recentPriceRanges: getRecentPriceRangesModel(),
  progressiveOnboarding: getProgressiveOnboardingModel(),
  infiniteDiscovery: getInfiniteDiscoveryModel(),

  setSessionState: action((state, payload) => {
    state.sessionState = { ...state.sessionState, ...payload }
  }),
  // for dev only.
  _setVersion: action((state, newVersion) => {
    state.version = newVersion
  }),

  // for testing only. noop otherwise.
  __inject: __TEST__
    ? action((state, injectedState) => {
        assignDeep(state, injectedState)
      })
    : action(() => {
        console.error("Do not use this function outside of tests!!")
      }),
  __manipulate: __TEST__
    ? action((state, theEdits) => {
        theEdits(state as unknown as GlobalStoreModel)
      })
    : action(() => {
        console.error("Do not use this function outside of tests!!")
      }),
})

export type GlobalStoreState = State<GlobalStoreModel>
