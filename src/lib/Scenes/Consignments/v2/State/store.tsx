import { createStore, EasyPeasyConfig } from "easy-peasy"
import { createLogger } from "redux-logger"
import { ArtworkModel, artworkModel as artwork } from "./artworkModel"
import { NavigationModel, navigationModel as navigation } from "./navigationModel"

export interface StoreModel {
  artwork: ArtworkModel
  navigation: NavigationModel
}

export const store = createStore<StoreModel, EasyPeasyConfig<any, StoreModel>>(
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
