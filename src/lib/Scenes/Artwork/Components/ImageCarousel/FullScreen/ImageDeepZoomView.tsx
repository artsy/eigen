import React, { useImperativeHandle, useMemo, useState } from "react"
import { Image, View } from "react-native"
import { ImageDescriptor } from "../ImageCarouselContext"

interface Tile {
  setShowing: (showing: boolean) => void
}
const Tile: React.RefForwardingComponent<
  Tile,
  { url: string; top: number; left: number; width: number; height: number; ref: React.Ref<Tile> }
> = React.forwardRef(({ url, top, left, width, height }, ref) => {
  const [showing, setShowing] = useState(true)
  useImperativeHandle(ref, () => ({ setShowing }), [])
  return (
    <View
      style={{
        position: "absolute",
        top,
        left,
        width,
        height,
      }}
    >
      {showing && (
        <Image
          source={{
            uri: url,
          }}
          style={{ width, height }}
        />
      )}
    </View>
  )
})

const calculateMaxLevel = ({ Width, Height }: { Width: number; Height: number }) => {
  let w = Width
  let h = Height
  let level = 0
  while (w !== 1 || h !== 1) {
    console.log({ w, h })
    level++
    w = Math.ceil(w / 2)
    h = Math.ceil(h / 2)
  }
  return level
}

export const ImageDeepZoomView: React.FC<{
  image: ImageDescriptor
  width: number
  height: number
}> = ({
  image: {
    deep_zoom: {
      Image: { Format, Size, TileSize, Url },
    },
  },
  width,
  height,
}) => {
  const maxLevel = calculateMaxLevel(Size)
  const scale = Size.Width / width
  const numRows = Math.ceil(Size.Height / TileSize)
  const numCols = Math.ceil(Size.Width / TileSize)
  const actualTileSize = TileSize / scale
  const tileRefs = useMemo(() => new Array(numRows).fill(null).map(() => []), [])
  const tiles = useMemo(() => {
    const result = []
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const url = `${Url}${maxLevel}/${col}_${row}.${Format}`
        const tileTop = row * actualTileSize
        const tileLeft = col * actualTileSize
        const tileWidth = col < numCols - 1 ? actualTileSize : width % actualTileSize
        const tileHeight = row < numRows - 1 ? actualTileSize : height % actualTileSize

        console.log({ row, col, tileTop, tileLeft, tileWidth, tileHeight })

        result.push(
          <Tile
            key={url}
            url={url}
            ref={ref => (tileRefs[row][col] = ref)}
            top={tileTop}
            left={tileLeft}
            width={tileWidth}
            height={tileHeight}
          />
        )
      }
    }
    return result
  }, [])
  return <View style={{ position: "absolute", width, height, top: 0, left: 0 }}>{tiles}</View>
}
