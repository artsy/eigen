import { Action, action, createStore, State, thunkOn, ThunkOn } from "easy-peasy"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { BottomTabsModel, getBottomTabsModel } from "lib/Scenes/BottomTabs/BottomTabsModel"
import {
  getSubmissionModel,
  SubmissionModel,
} from "lib/Scenes/Consignments/Screens/SubmitArtworkOverview/State/SubmissionModel"
import {
  getMyCollectionModel,
  MyCollectionModel,
} from "lib/Scenes/MyCollection/State/MyCollectionModel"
import { getSettingsModel, SettingsModel } from "lib/Scenes/MyProfile/SettingsModel"
import { getSearchModel, SearchModel } from "lib/Scenes/Search/SearchModel"
import {
  getUserPreferencesModel,
  UserPreferencesModel,
} from "lib/Scenes/Search/UserPreferencesModel"
import { AuthModel, getAuthModel } from "./AuthModel"
import { ConfigModel, getConfigModel } from "./ConfigModel"
import { unsafe__getEnvironment } from "./GlobalStore"
import { CURRENT_APP_VERSION } from "./migration"
import { getNativeModel, NativeModel } from "./NativeModel"
import {
  getPendingPushNotificationModel,
  PendingPushNotificationModel,
} from "./PendingPushNotificationModel"
import { assignDeep, sanitize } from "./persistence"
import { getToastModel, ToastModel } from "./ToastModel"
import { getVisualClueModel, VisualClueModel } from "./VisualClueModel"

interface GlobalStoreStateModel {
  version: number
  sessionState: {
    isHydrated: boolean
  }

  native: NativeModel
  bottomTabs: BottomTabsModel
  search: SearchModel
  myCollection: MyCollectionModel
  config: ConfigModel
  auth: AuthModel
  toast: ToastModel
  settings: SettingsModel
  pendingPushNotification: PendingPushNotificationModel
  userPreferences: UserPreferencesModel
  visualClue: VisualClueModel
  artworkSubmission: SubmissionModel
}
export interface GlobalStoreModel extends GlobalStoreStateModel {
  rehydrate: Action<this, DeepPartial<State<GlobalStoreStateModel>>>
  reset: Action<this, DeepPartial<State<GlobalStoreStateModel>>>
  resetAfterSignOut: ThunkOn<this>
  didRehydrate: ThunkOn<this>

  // for dev only.
  _setVersion: Action<this, number>

  // for testing only. noop otherwise.
  __inject: Action<this, DeepPartial<State<GlobalStoreStateModel>>>
  __manipulate: Action<this, (store: this) => void>
}

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
        config: existingConfig,
        search,
        auth: { userID },
      } = store.getState()

      // keep existing config state
      const config = sanitize(existingConfig) as typeof existingConfig
      actions.reset({ config, search, auth: { previousSessionUserID: userID } })
    }
  ),
  didRehydrate: thunkOn(
    (actions) => actions.rehydrate,
    () => {
      LegacyNativeModules.ARNotificationsManager.reactStateUpdated(unsafe__getEnvironment())
      LegacyNativeModules.ARNotificationsManager.didFinishBootstrapping()
    }
  ),
  sessionState: {
    // we don't perform hydration at test time so let's set it to always true for tests
    isHydrated: __TEST__,
  },

  // NATIVE MIGRATION STATE
  native: getNativeModel(),

  // APP MODULE STATE
  bottomTabs: getBottomTabsModel(),
  search: getSearchModel(),
  myCollection: getMyCollectionModel(),
  config: getConfigModel(),
  auth: getAuthModel(),
  toast: getToastModel(),
  settings: getSettingsModel(),
  pendingPushNotification: getPendingPushNotificationModel(),
  userPreferences: getUserPreferencesModel(),
  visualClue: getVisualClueModel(),
  artworkSubmission: getSubmissionModel(),

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
