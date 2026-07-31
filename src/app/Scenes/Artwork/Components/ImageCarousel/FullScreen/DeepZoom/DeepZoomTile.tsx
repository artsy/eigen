import { useColor } from "@artsy/palette-mobile"
import { useSpringValue } from "app/Scenes/Artwork/Components/ImageCarousel/useSpringValue"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Animated, Image, View } from "react-native"
import { DeepZoomPyramid } from "./DeepZoomPyramid"
import { VISUAL_DEBUG_MODE } from "./__deepZoomDebug"
import { useIsMounted } from "./useIsMounted"

export class DeepZoomTileID {
  static _cache: Record<string, DeepZoomTileID> = {}
  static create(level: number, row: number, col: number) {
    return new DeepZoomTileID(level, row, col).intern()
  }
  id: string | null = null
  private constructor(
    public readonly level: number,
    public readonly row: number,
    public readonly col: number
  ) {}
  toString() {
    if (this.id !== null) {
      return this.id
    }
    this.id = `${this.level}:${this.row}:${this.col}`
    return this.id
  }
  private intern() {
    const result = DeepZoomTileID._cache[this.toString()]
    if (result) {
      return result
    }
    DeepZoomTileID._cache[this.toString()] = this
    return this
  }
}

export interface DeepZoomTileProps {
  url: string
  top: number
  left: number
  width: number
  height: number
  id: DeepZoomTileID
  pyramid: DeepZoomPyramid
}

/**
 * A tile is a single image in the pyramid
 */
export const DeepZoomTile: React.FC<DeepZoomTileProps> = ({
  url,
  top,
  left,
  width,
  height,
  id,
  pyramid,
}) => {
  const color = useColor()
  const [showing, setShowing] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const isMounted = useIsMounted()
  const onLoad = useCallback(() => {
    if (!isMounted()) {
      return
    }
    setLoaded(true)
    pyramid.didLoad(id)
  }, [])

  // register with pyramid during first render
  useMemo(() => {
    pyramid.willMount(id)
  }, [])

  // wait for tiles above this one to load before this one
  useEffect(() => {
    pyramid.didMount({
      id,
      onShouldLoad() {
        setShowing(true)
      },
    })
    return () => {
      pyramid.didUnmount(id)
    }
  }, [])

  if (VISUAL_DEBUG_MODE) {
    // need to fake the load delay of images
    // eslint-disable-next-line react-hooks/rules-of-hooks -- VISUAL_DEBUG_MODE is a module-level constant, so this condition never changes across renders of a given instance
    useEffect(() => {
      if (showing) {
        setTimeout(onLoad, 400)
      }
    }, [showing])

    const borderWidth = Math.pow(2, Math.max(id.level, 9) - 9)

    return (
      <View
        style={{
          position: "absolute",
          top,
          left,
          width: width - 2 * borderWidth,
          height: height - 2 * borderWidth,
          borderColor: color("mono100"),
          borderWidth,
          backgroundColor: !showing
            ? "rgba(255, 0, 0, 0.2)"
            : !loaded
              ? "rgba(0, 0, 255, 0.2)"
              : "rgba(0, 255, 0, 0.2)",
        }}
      />
    )
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks -- VISUAL_DEBUG_MODE is a module-level constant, so this condition never changes across renders of a given instance
  const opacity = useSpringValue(loaded ? 1 : 0)

  return !showing ? null : (
    <Animated.View
      style={{
        position: "absolute",
        top,
        left,
        width,
        height,
        opacity,
      }}
    >
      <Image onLoad={onLoad} source={{ uri: url }} style={{ width, height }} />
    </Animated.View>
  )
}
