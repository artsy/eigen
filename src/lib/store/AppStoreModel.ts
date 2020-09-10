import { Action, action, createStore, State } from "easy-peasy"
import { BottomTabsModel } from "lib/Scenes/BottomTabs/BottomTabsModel"
import { MyCollectionModel } from "lib/Scenes/MyCollection/State/MyCollectionModel"
import { SearchModel } from "lib/Scenes/Search/SearchModel"
import { CURRENT_APP_VERSION } from "./migration"
import { NativeModel } from "./NativeModel"
import { assignDeep } from "./persistence"

interface AppStoreStateModel {
  version: number
  sessionState: {
    isHydrated: boolean
  }

  native: NativeModel

  bottomTabs: BottomTabsModel
  search: SearchModel
  myCollection: MyCollectionModel
}
export interface AppStoreModel extends AppStoreStateModel {
  rehydrate: Action<AppStoreModel, DeepPartial<State<AppStoreStateModel>>>
  reset: Action<AppStoreModel>
}

export const appStoreModel: AppStoreModel = {
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
    const result = createStore(appStoreModel).getState()
    result.sessionState.isHydrated = true
    return result
  }),
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
}

export type AppStoreState = State<AppStoreModel>
