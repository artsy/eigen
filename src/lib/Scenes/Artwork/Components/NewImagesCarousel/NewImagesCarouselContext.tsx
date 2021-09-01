import { NewImagesCarousel_images } from "__generated__/NewImagesCarousel_images.graphql"
import { action, Action, createContextStore, State } from "easy-peasy"

type FullScreenState = "entered" | "entering" | "closed" | "closing"

interface NewImagesCarouselStoreModel {
  fullScreenState: FullScreenState
  imageIndex: number
  images: NewImagesCarousel_images
  setFullScreenState: Action<NewImagesCarouselStoreModel, FullScreenState>
  setImageIndex: Action<NewImagesCarouselStoreModel, number>
  setImages: Action<NewImagesCarouselStoreModel, NewImagesCarousel_images>
}

const NewImagesCarouselStoreModel: NewImagesCarouselStoreModel = {
  fullScreenState: "closed",
  imageIndex: 0,
  images: [],
  setFullScreenState: action((state, payload) => {
    state.fullScreenState = payload
  }),
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
