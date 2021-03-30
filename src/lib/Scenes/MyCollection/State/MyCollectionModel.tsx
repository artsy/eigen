import { MyCollectionArtworkModel } from "./MyCollectionArtworkModel"

export interface MyCollectionModel {
  artwork: MyCollectionArtworkModel
}

export const getMyCollectionModel = (): MyCollectionModel => ({
  artwork: MyCollectionArtworkModel,
})
