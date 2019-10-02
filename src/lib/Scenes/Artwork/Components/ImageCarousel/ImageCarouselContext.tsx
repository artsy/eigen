import { ImageCarousel_images } from "__generated__/ImageCarousel_images.graphql"
import { Schema } from "lib/utils/track"
import React, { useMemo, useRef } from "react"
import { FlatList, View } from "react-native"
import { useTracking } from "react-tracking"
import { GlobalState, useGlobalState } from "./useGlobalState"

export type ImageDescriptor = Pick<ImageCarousel_images[number], "deepZoom" | "height" | "width" | "url">

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
      type: "FULL_SCREEN_FINISHED_EXITING"
    }
  | {
      type: "FULL_SCREEN_FINISHED_ENTERING"
    }
  | {
      type: "FULL_SCREEN_INITIAL_RENDER_COMPLETED"
    }
  | {
      type: "ZOOM_SCALE_CHANGED"
      nextZoomScale: number
    }

export type FullScreenState = "none" | "doing first render" | "animating entry transition" | "entered" | "exiting"

export interface ImageCarouselContext {
  imageIndex: GlobalState<number>
  lastImageIndex: GlobalState<number>
  fullScreenState: GlobalState<FullScreenState>
  isZoomedCompletelyOut: GlobalState<boolean>
  images: ImageDescriptor[]
  embeddedImageRefs: View[]
  embeddedFlatListRef: React.RefObject<FlatList<any>>
  dispatch(action: ImageCarouselAction): void
}

export function useNewImageCarouselContext({ images }: { images: ImageDescriptor[] }): ImageCarouselContext {
  const embeddedImageRefs = useMemo(() => [], [])
  const embeddedFlatListRef = useRef<FlatList<any>>()
  const [imageIndex, setImageIndex] = useGlobalState(0)
  const [lastImageIndex, setLastImageIndex] = useGlobalState(0)
  const [fullScreenState, setFullScreenState] = useGlobalState("none" as FullScreenState)
  const [isZoomedCompletelyOut, setIsZoomedCompletelyOut] = useGlobalState(true)
  const tracking = useTracking()

  return useMemo(
    () => ({
      imageIndex,
      lastImageIndex,
      fullScreenState,
      isZoomedCompletelyOut,
      images,
      embeddedImageRefs,
      embeddedFlatListRef,
      dispatch: (action: ImageCarouselAction) => {
        switch (action.type) {
          case "IMAGE_INDEX_CHANGED":
            if (imageIndex.current !== action.nextImageIndex) {
              tracking.trackEvent({
                action_name: Schema.ActionNames.ArtworkImageSwipe,
                action_type: Schema.ActionTypes.Swipe,
                context_module: Schema.ContextModules.ArtworkImage,
              })
              setLastImageIndex(imageIndex.current)
              setImageIndex(action.nextImageIndex)
              setIsZoomedCompletelyOut(true)
              if (fullScreenState.current !== "none") {
                embeddedFlatListRef.current.scrollToIndex({ index: action.nextImageIndex, animated: false })
              }
            }
            break
          case "FULL_SCREEN_DISMISSED":
            setFullScreenState("exiting")
            break
          case "FULL_SCREEN_FINISHED_EXITING":
            setFullScreenState("none")
            break
          case "TAPPED_TO_GO_FULL_SCREEN":
            setFullScreenState("doing first render")
            break
          case "FULL_SCREEN_INITIAL_RENDER_COMPLETED":
            setFullScreenState("animating entry transition")
            break
          case "FULL_SCREEN_FINISHED_ENTERING":
            setFullScreenState("entered")
            break
          case "ZOOM_SCALE_CHANGED":
            setIsZoomedCompletelyOut(action.nextZoomScale <= 1)
            break
        }
      },
    }),
    []
  )
}

export const ImageCarouselContext = React.createContext<ImageCarouselContext>(null)
