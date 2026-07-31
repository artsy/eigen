import { EventStream } from "app/Scenes/Artwork/Components/ImageCarousel/FullScreen/useEventStream"
import { ImageDescriptor } from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarouselContext"
import { fitInside, Rect } from "app/Scenes/Artwork/Components/ImageCarousel/geometry"
import { useScreenDimensions } from "app/utils/hooks"
import React, { useEffect, useMemo } from "react"
import { Animated, View } from "react-native"
import { DeepZoomLevel } from "./DeepZoomLevel"
import { DeepZoomPyramid } from "./DeepZoomPyramid"
import {
  calculateDeepZoomLevels,
  calculateMinMaxDeepZoomLevels,
  getZoomScaleBoundaries,
} from "./deepZoomGeometry"

export interface DeepZoomOverlayProps {
  image: ImageDescriptor
  width: number
  height: number
  // These following are the control values we need from the ScrollView in the component above (ImageZoomView)
  // we need them to position the image tiles correctly (animated values) and decide which tiles to show (view port)
  viewPortChanges: EventStream<Rect>
  $zoomScale: Animated.Value
  $contentOffsetX: Animated.Value
  $contentOffsetY: Animated.Value
  // we need to trigger a scroll event on mount to find out what the starting viewport is.
  triggerScrollEvent(): void
}

/**
 * The DeepZoomOverlay component is absolutely positioned such that it occupies the whole screen.
 * It does not respond to any touch events. Sitting just below (inside the ImageZoomView component) is a scroll view
 * which is used to provide the pinch-to-zoom and panning gestures which manipulate this overlay's state.
 */
export const DeepZoomOverlay: React.FC<DeepZoomOverlayProps> = ({
  // The caller (ImageZoomView) only renders this component when `image.deepZoom` is present,
  // but that guard doesn't narrow the nested `.image` field, so it's asserted here.
  image,
  width,
  height,
  viewPortChanges,
  $zoomScale,
  $contentOffsetX,
  $contentOffsetY,
  triggerScrollEvent,
}) => {
  // These are always fully populated whenever `image.deepZoom` is present (guaranteed by the
  // caller's guard), but the generated Relay type marks every level of this nesting as nullable.
  const {
    format,
    size: fullImageSize,
    tileSize,
    url,
  } = image.deepZoom?.image as {
    format: string
    size: { width: number; height: number }
    tileSize: number
    url: string
  }
  const screenDimensions = useScreenDimensions()
  const pyramid = useMemo(() => new DeepZoomPyramid(), [])
  // get first viewport update after mounting to start showing tiles
  useEffect(() => {
    triggerScrollEvent()
  }, [])

  // setup geometry
  const levels = useMemo(() => calculateDeepZoomLevels(fullImageSize), [fullImageSize])
  const imageFittedWithinScreen = useMemo(
    () => fitInside(screenDimensions, { width, height }),
    [width, height]
  )
  const zoomScaleBoundaries = useMemo(
    () => getZoomScaleBoundaries({ imageFittedWithinScreen, levels }),
    [levels, imageFittedWithinScreen]
  )
  const { minLevel, maxLevel } = useMemo(
    () => calculateMinMaxDeepZoomLevels({ width, height }, levels),
    [width, height, levels]
  )

  // At the moment we just render all of the levels and let them decide whether or not to show any tiles
  // this lets us avoid this component needing to update.
  const levelElements = useMemo(() => {
    const result: React.JSX.Element[] = []
    for (let level = minLevel; level <= maxLevel; level++) {
      result.push(
        <DeepZoomLevel
          level={level}
          zoomScaleBoundaries={zoomScaleBoundaries[level]}
          levelDimensions={levels[level]}
          imageFittedWithinScreen={imageFittedWithinScreen}
          makeUrl={({ row, col }) => `${url}${level}/${col}_${row}.${format}`}
          $contentOffsetX={$contentOffsetX}
          $contentOffsetY={$contentOffsetY}
          $zoomScale={$zoomScale}
          tileSize={tileSize}
          viewPortChanges={viewPortChanges}
          triggerScrollEvent={triggerScrollEvent}
          key={level}
          pyramid={pyramid}
        />
      )
    }
    return result
  }, [minLevel, maxLevel, levels, imageFittedWithinScreen])

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        width: screenDimensions.width,
        height: screenDimensions.height,
        top: 0,
        left: 0,
      }}
    >
      {levelElements}
    </View>
  )
}
