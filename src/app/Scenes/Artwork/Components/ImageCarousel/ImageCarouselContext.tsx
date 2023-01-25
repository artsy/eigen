import { ImageCarousel_images$data } from "__generated__/ImageCarousel_images.graphql"
import { ImageCarousel_videos$data } from "__generated__/ImageCarousel_videos.graphql"
import { Schema } from "app/utils/track"
import { GlobalState, useGlobalState } from "app/utils/useGlobalState"
import React, { useMemo, useRef } from "react"
import { Animated, FlatList, View } from "react-native"
import { useTracking } from "react-tracking"

export type ImageDescriptor = Pick<
  ImageCarousel_images$data[number],
  "deepZoom" | "height" | "width" | "url" | "largeImageURL"
>

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

export type FullScreenState =
  | "none"
  | "doing first render"
  | "animating entry transition"
  | "entered"
  | "exiting"

export interface ImageCarouselContext {
  dispatch(action: ImageCarouselAction): void
  embeddedFlatListRef: React.RefObject<FlatList<any>>
  embeddedImageRefs: View[]
  fullScreenState: GlobalState<FullScreenState>
  imageIndex: GlobalState<number>
  images: ImageDescriptor[]
  isZoomedCompletelyOut: GlobalState<boolean>
  lastImageIndex: GlobalState<number>
  media?: ImageCarousel_images$data & ImageCarousel_videos$data
  setVideoAsCover?: boolean
  videos?: ImageCarousel_videos$data
  xScrollOffsetAnimatedValue: React.RefObject<Animated.Value>
}

export function useNewImageCarouselContext({
  images,
  onImageIndexChange,
  setVideoAsCover = false,
  videos = [],
}: Pick<ImageCarouselContext, "images" | "setVideoAsCover" | "videos"> & {
  onImageIndexChange?: (imageIndex: number) => void
}): ImageCarouselContext {
  const embeddedImageRefs = useMemo(() => [], [])
  const embeddedFlatListRef = useRef<FlatList<any>>()
  const xScrollOffsetAnimatedValue = useRef<Animated.Value>(new Animated.Value(0))
  const [imageIndex, setImageIndex] = useGlobalState(0)
  const [lastImageIndex, setLastImageIndex] = useGlobalState(0)
  const [fullScreenState, setFullScreenState] = useGlobalState("none" as FullScreenState)
  const [isZoomedCompletelyOut, setIsZoomedCompletelyOut] = useGlobalState(true)
  const tracking = useTracking()

  // const media = setVideoAsCover ? [...videos, ...images] : [...images, ...videos]
  const media = [...videos, ...images]

  const imageCarouselContext = useMemo(
    () => ({
      imageIndex,
      lastImageIndex,
      fullScreenState,
      isZoomedCompletelyOut,
      images,
      media,
      embeddedImageRefs,
      embeddedFlatListRef,
      xScrollOffsetAnimatedValue,
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
                // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                embeddedFlatListRef.current.scrollToIndex({
                  index: action.nextImageIndex,
                  animated: false,
                })
              }

              onImageIndexChange && onImageIndexChange(imageIndex.current)
            }
            break
          case "FULL_SCREEN_DISMISSED":
            setFullScreenState("exiting")
            break
          case "FULL_SCREEN_FINISHED_EXITING":
            setFullScreenState("none")
            break
          case "TAPPED_TO_GO_FULL_SCREEN":
            // some artwork images are corrupt (!?) and do not have deepZoom
            if (images[imageIndex.current].deepZoom) {
              tracking.trackEvent({
                action_name: Schema.ActionNames.ArtworkImageZoom,
                action_type: Schema.ActionTypes.Tap,
                context_module: Schema.ContextModules.ArtworkImage,
              })
              setFullScreenState("doing first render")
            }
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

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  return imageCarouselContext
}

export const ImageCarouselContext = React.createContext<ImageCarouselContext>(
  null as any /* STRICTNESS_MIGRATION */
)
