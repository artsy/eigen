import { action, Action, createContextStore } from "easy-peasy"

interface NewImagesCarouselStoreModel {
  imageIndex: number
  setImageIndex: Action<NewImagesCarouselStoreModel, number>
}

const NewImagesCarouselStoreModel: NewImagesCarouselStoreModel = {
  imageIndex: 0,
  setImageIndex: action((state, payload) => {
    state.imageIndex = payload
  }),
}

export const NewImagesCarouselStore = createContextStore(NewImagesCarouselStoreModel)
