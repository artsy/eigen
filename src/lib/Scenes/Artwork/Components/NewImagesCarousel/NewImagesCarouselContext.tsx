import { NewImagesCarousel_images } from "__generated__/NewImagesCarousel_images.graphql"
import { action, Action, createContextStore, State } from "easy-peasy"

interface NewImagesCarouselStoreModel {
  imageIndex: number
  images: NewImagesCarousel_images
  setImageIndex: Action<NewImagesCarouselStoreModel, number>
  setImages: Action<NewImagesCarouselStoreModel, NewImagesCarousel_images>
}

const NewImagesCarouselStoreModel: NewImagesCarouselStoreModel = {
  imageIndex: 0,
  images: [],
  setImageIndex: action((state, payload) => {
    state.imageIndex = payload
  }),
  setImages: action((state, payload) => {
    state.images = payload
  }),
}

export const NewImagesCarouselStore = createContextStore<NewImagesCarouselStoreModel>(
  (initialData: State<NewImagesCarouselStoreModel>) => ({ ...NewImagesCarouselStoreModel, ...initialData })
)
