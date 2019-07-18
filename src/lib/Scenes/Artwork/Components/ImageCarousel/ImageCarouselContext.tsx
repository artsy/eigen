import React from "react"
import { FlatList, View } from "react-native"

export interface ImageDescriptor {
  url: string
  width: number
  height: number
}

export type ImageCarouselAction =
  | {
      type: "IMAGE_INDEX_CHANGED"
      nextImageIndex: number
    }
  | {
      type: "TAPPED_TO_GO_FULL_SCREEN"
    }
  | {
      type: "FULL_SCREEN_DISMISSED"
    }
  | {
      type: "FULL_SCREEN_FINISHED_ENTERING"
    }
  | {
      type: "FULL_SCREEN_INITIAL_RENDER_COMPLETED"
    }

export type FullScreenState = "none" | "doing first render" | "animating entry transition" | "entered"

export interface ImageCarouselContext {
  currentImageIndex: number
  images: ImageDescriptor[]
  baseImageRefs: View[]
  baseFlatListRef: React.RefObject<FlatList<any>>
  fullScreenState: FullScreenState
  dispatch(action: ImageCarouselAction): void
}

export const ImageCarouselContext = React.createContext<ImageCarouselContext>(null)
