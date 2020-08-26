import { MyCollectionArtworkModel } from "./MyCollectionArtworkModel"
import { MyCollectionNavigationModel } from "./MyCollectionNavigationModel"

export interface MyCollectionModel {
  artwork: MyCollectionArtworkModel
  navigation: MyCollectionNavigationModel
}

export const MyCollectionModel: MyCollectionModel = {
  artwork: MyCollectionArtworkModel,
  navigation: MyCollectionNavigationModel,
}
