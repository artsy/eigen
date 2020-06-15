import { createStore, EasyPeasyConfig } from "easy-peasy"
import { createLogger } from "redux-logger"
import { ArtworkState, artworkState as artwork } from "./artworkState"
import { NavigationState, navigationState as navigation } from "./navigationState"

export interface StoreState {
  artwork: ArtworkState
  navigation: NavigationState
}

export const store = createStore<StoreState, EasyPeasyConfig<any, StoreState>>(
  {
    artwork,
    navigation,
  },
  {
    middleware: [
      createLogger({
        collapsed: true,
      }),
    ],
  }
)
