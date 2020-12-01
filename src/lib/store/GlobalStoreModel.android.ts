import { Action, action, createStore, State, thunkOn, ThunkOn } from "easy-peasy"
import { AuthModel } from "./AuthModel"
import { ConfigModel } from "./ConfigModel"
import { CURRENT_APP_VERSION } from "./migration"
import { assignDeep } from "./persistence"

console.warn("blah", ConfigModel)

interface GlobalStoreStateModel {
  version: number
  sessionState: {
    isHydrated: boolean
  }

  auth: AuthModel
  config: ConfigModel
}
export interface GlobalStoreModel extends GlobalStoreStateModel {
  rehydrate: Action<GlobalStoreModel, DeepPartial<State<GlobalStoreStateModel>>>
  reset: Action<GlobalStoreModel>
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
  didRehydrate: thunkOn(
    (actions) => actions.rehydrate,
    () => {
      // NativeModules.ARNotificationsManager.didFinishBootstrapping()
    }
  ),
  sessionState: {
    // we don't perform hydration at test time so let's set it to always true for tests
    isHydrated: __TEST__,
  },

  auth: AuthModel,
  config: ConfigModel,
}

export type GlobalStoreState = State<GlobalStoreModel>
