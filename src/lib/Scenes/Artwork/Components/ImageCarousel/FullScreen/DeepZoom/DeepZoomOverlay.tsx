import React, { useEffect, useMemo } from "react"
import { Animated, View } from "react-native"
import { Rect } from "../../geometry"
import { ImageDescriptor } from "../../ImageCarouselContext"
import { screenBoundingBox } from "../screen"
import { EventStream } from "../useEventStream"
import { calculateDeepZoomLevels, calculateMinMaxDeepZoomLevels, getZoomScaleBoundaries } from "./deepZoomGeometry"
import { DeepZoomLevel } from "./DeepZoomLevel"
import { DeepZoomPyramid } from "./DeepZoomPyramid"

export interface DeepZoomOverlayProps {
  image: ImageDescriptor
  width: number
  height: number
  viewPortChanges: EventStream<Rect>
  $zoomScale: Animated.Value
  $contentOffsetX: Animated.Value
  $contentOffsetY: Animated.Value
  triggerScrollEvent(): void
}

export const DeepZoomOverlay: React.FC<DeepZoomOverlayProps> = ({
  image: {
    deepZoom: {
      Image: { Format, Size: fullImageSize, TileSize, Url },
    },
  },
  width,
  height,
  viewPortChanges,
  $zoomScale,
  $contentOffsetX,
  $contentOffsetY,
  triggerScrollEvent,
}) => {
  const pyramid = useMemo(() => new DeepZoomPyramid(), [])
  useEffect(() => {
    triggerScrollEvent()
  }, [])

  // setup geometry
  const levels = useMemo(() => calculateDeepZoomLevels(fullImageSize), [fullImageSize])
  const imageFittedWithinScreen = useMemo(() => ({ width, height }), [width, height])
  const zoomScaleBoundaries = useMemo(() => getZoomScaleBoundaries({ imageFittedWithinScreen, levels }), [
    levels,
    imageFittedWithinScreen,
  ])
  const { minLevel, maxLevel } = useMemo(() => calculateMinMaxDeepZoomLevels({ width, height }, levels), [
    width,
    height,
    levels,
  ])

  const levelElements = useMemo(
    () => {
      const result: JSX.Element[] = []
      for (let level = minLevel; level <= maxLevel; level++) {
        result.push(
          <DeepZoomLevel
            level={level}
            zoomScaleBoundaries={zoomScaleBoundaries[level]}
            levelDimensions={levels[level]}
            imageFittedWithinScreen={imageFittedWithinScreen}
            makeUrl={({ row, col }) => `${Url}${level}/${col}_${row}.${Format}`}
            $contentOffsetX={$contentOffsetX}
            $contentOffsetY={$contentOffsetY}
            $zoomScale={$zoomScale}
            tileSize={TileSize}
            viewPortChanges={viewPortChanges}
            triggerScrollEvent={triggerScrollEvent}
            key={level}
            pyramid={pyramid}
          />
        )
      }
      return result
    },
    [minLevel, maxLevel, levels, imageFittedWithinScreen]
  )

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        ...screenBoundingBox,
        top: 0,
        left: 0,
      }}
    >
      {levelElements}
    </View>
  )
}
