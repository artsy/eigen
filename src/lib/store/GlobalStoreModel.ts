import { Action, action, createStore, State, thunkOn, ThunkOn } from "easy-peasy"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { BottomTabsModel } from "lib/Scenes/BottomTabs/BottomTabsModel"
import { MyCollectionModel } from "lib/Scenes/MyCollection/State/MyCollectionModel"
import { SearchModel } from "lib/Scenes/Search/SearchModel"
import { AuthModel } from "./AuthModel"
import { ConfigModel } from "./ConfigModel"
import { CURRENT_APP_VERSION } from "./migration"
import { NativeModel } from "./NativeModel"
import { assignDeep } from "./persistence"

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
}
export interface GlobalStoreModel extends GlobalStoreStateModel {
  rehydrate: Action<GlobalStoreModel, DeepPartial<State<GlobalStoreStateModel>>>
  reset: Action<GlobalStoreModel>
  signOut: Action<GlobalStoreModel>
  didRehydrate: ThunkOn<GlobalStoreModel>
}

export const GlobalStoreModel: GlobalStoreModel = {
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
  reset: action(() => {
    const result = createStore(GlobalStoreModel).getState()
    result.sessionState.isHydrated = true
    return result
  }),
  signOut: action((state) => {
    const clean = createStore(GlobalStoreModel).getState()
    // keep existing config state
    const config = state.config
    clean.config = config
    return clean
  }),
  didRehydrate: thunkOn(
    (actions) => actions.rehydrate,
    () => {
      LegacyNativeModules.ARNotificationsManager.didFinishBootstrapping()
    }
  ),
  sessionState: {
    // we don't perform hydration at test time so let's set it to always true for tests
    isHydrated: __TEST__,
  },

  // NATIVE MIGRATION STATE
  native: NativeModel,

  // APP MODULE STATE
  bottomTabs: BottomTabsModel,
  search: SearchModel,
  myCollection: MyCollectionModel,
  config: ConfigModel,
  auth: AuthModel,
}

export type GlobalStoreState = State<GlobalStoreModel>
