import { observable } from "mobx"
import React, { useContext, useMemo, useRef } from "react"
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
  state: {
    imageIndex: number
    fullScreenState: FullScreenState
  }
  images: ImageDescriptor[]
  baseImageRefs: View[]
  baseFlatListRef: React.RefObject<FlatList<any>>
  dispatch(action: ImageCarouselAction): void
}

export function useNewImageCarouselContext({ images }: { images: ImageDescriptor[] }): ImageCarouselContext {
  const baseImageRefs = useMemo(() => [], [])
  const baseFlatListRef = useRef<FlatList<any>>()
  const state = observable({
    imageIndex: 0,
    fullScreenState: "none" as FullScreenState,
  })
  return useMemo(
    () => ({
      state,
      images,
      baseImageRefs,
      baseFlatListRef,
      dispatch: (action: ImageCarouselAction) => {
        switch (action.type) {
          case "IMAGE_INDEX_CHANGED":
            state.imageIndex = action.nextImageIndex
            if (state.fullScreenState !== "none") {
              baseFlatListRef.current.scrollToIndex({ index: action.nextImageIndex, animated: false })
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
        }
      },
    }),
    []
  )
}

export const useImageIndex = () => {
  return useContext(ImageCarouselContext).state.imageIndex
}

export const useFullScreenState = () => {
  return useContext(ImageCarouselContext).state.fullScreenState
}

export const ImageCarouselContext = React.createContext<ImageCarouselContext>(null)
