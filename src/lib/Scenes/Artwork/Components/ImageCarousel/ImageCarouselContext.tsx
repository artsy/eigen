import { Schema } from "lib/utils/track"
import { observable } from "mobx"
import React, { useMemo, useRef } from "react"
import { FlatList, View } from "react-native"
import { useTracking } from "react-tracking"

export interface ImageDescriptor {
  url: string
  width: number
  height: number
  deep_zoom: {
    Image: {
      TileSize: number
      Url: string
      Format: string
      Size: {
        Width: number
        Height: number
      }
    }
  }
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
  | {
      type: "ZOOM_SCALE_CHANGED"
      nextZoomScale: number
    }

export type FullScreenState = "none" | "doing first render" | "animating entry transition" | "entered"

export interface ImageCarouselState {
  imageIndex: number
  fullScreenState: FullScreenState
  isZoomedCompletelyOut: boolean
}

export interface ImageCarouselContext {
  state: Readonly<ImageCarouselState>
  images: ImageDescriptor[]
  embeddedImageRefs: View[]
  embeddedFlatListRef: React.RefObject<FlatList<any>>
  dispatch(action: ImageCarouselAction): void
}

export function useNewImageCarouselContext({ images }: { images: ImageDescriptor[] }): ImageCarouselContext {
  const embeddedImageRefs = useMemo(() => [], [])
  const embeddedFlatListRef = useRef<FlatList<any>>()
  const state = observable({
    imageIndex: 0,
    fullScreenState: "none" as FullScreenState,
    isZoomedCompletelyOut: true,
  })
  const tracking = useTracking()

  return useMemo(
    () => ({
      state,
      images,
      embeddedImageRefs,
      embeddedFlatListRef,
      dispatch: (action: ImageCarouselAction) => {
        switch (action.type) {
          case "IMAGE_INDEX_CHANGED":
            if (state.imageIndex !== action.nextImageIndex) {
              tracking.trackEvent({
                action_name: Schema.ActionNames.ArtworkImageSwipe,
                action_type: Schema.ActionTypes.Swipe,
                context_module: Schema.ContextModules.ArtworkImage,
              })
              state.imageIndex = action.nextImageIndex
              state.isZoomedCompletelyOut = true
              if (state.fullScreenState !== "none") {
                embeddedFlatListRef.current.scrollToIndex({ index: action.nextImageIndex, animated: false })
              }
            }
            break
          case "FULL_SCREEN_DISMISSED":
            state.fullScreenState = "none"
            break
          case "TAPPED_TO_GO_FULL_SCREEN":
            state.fullScreenState = "doing first render"
            break
          case "FULL_SCREEN_INITIAL_RENDER_COMPLETED":
            state.fullScreenState = "animating entry transition"
            break
          case "FULL_SCREEN_FINISHED_ENTERING":
            state.fullScreenState = "entered"
            break
          case "ZOOM_SCALE_CHANGED":
            state.isZoomedCompletelyOut = action.nextZoomScale <= 1
        }
      },
    }),
    []
  )
}

export const ImageCarouselContext = React.createContext<ImageCarouselContext>(null)
