import { Image, useColor } from "@artsy/palette-mobile"
import { BLURHASH_DECODE_ASYNC } from "app/utils/blurhashDecodeAsync"
import { StyleProp, View, ViewStyle } from "react-native"

interface ArtworkThumbnailProps {
  imageUrl: string
  blurhash?: string | null
  width: number
  height: number
  rotate?: string
  style?: StyleProp<ViewStyle>
  testID?: string
  shadowOpacity?: number
}

export const ArtworkThumbnail: React.FC<ArtworkThumbnailProps> = ({
  imageUrl,
  blurhash,
  width,
  height,
  rotate = "0deg",
  style,
  testID,
  shadowOpacity = 0.08,
}) => {
  const color = useColor()
  const borderWidth = (width / 88) * 8
  const outerRadius = (width / 88) * 14
  const innerRadius = outerRadius - borderWidth

  return (
    <View
      testID={testID}
      style={[
        style,
        {
          width,
          height,
          transform: [{ rotate }],
          borderRadius: outerRadius,
          borderWidth,
          borderColor: color("mono0"),
          backgroundColor: color("mono0"),
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity,
          shadowRadius: 6,
          elevation: 3,
        },
      ]}
    >
      <View style={{ flex: 1, borderRadius: innerRadius, overflow: "hidden" }}>
        <Image
          src={imageUrl}
          width={width - borderWidth * 2}
          height={height - borderWidth * 2}
          blurhash={blurhash ?? undefined}
          blurhashDecodeAsync={BLURHASH_DECODE_ASYNC}
        />
      </View>
    </View>
  )
}
