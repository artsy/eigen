import { createStore, EasyPeasyConfig } from "easy-peasy"
import { createLogger } from "redux-logger"
import { NavigationState, navigationState as navigation } from "./navigationState"

export interface StoreState {
  navigation: NavigationState
}

export const store = createStore<StoreState, EasyPeasyConfig<any, StoreState>>(
  {
    navigation,
  },
  {
    middleware: [
      createLogger({
        collapsed: false,
      }),
    ],
  }
)
