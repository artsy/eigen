import { Spacer, Flex, useTheme, Text, useScreenDimensions, Image } from "@artsy/palette-mobile"
import { View } from "react-native"
import LinearGradient from "react-native-linear-gradient"

import { CardTag, CardTagProps } from "./CardTag"

export interface LargeCardProps {
  image: string
  title: string
  subtitle?: string
  tag?: CardTagProps
}

/**
 * `Large` is a card with one image one tall image, and text for title and subtitle
 * at the bottom.
 */
export const LargeCard: React.FC<LargeCardProps> = ({ image, title, subtitle, tag }) => {
  const { color, space } = useTheme()

  const { width } = useScreenDimensions()
  const cardHeight = 400

  return (
    <View
      style={{
        width: width,
        height: cardHeight,
        aspectRatio: 1.0 / 1.33,
        flexDirection: "row",
      }}
    >
      <Flex flex={2} backgroundColor="mono10">
        <Image src={image} width={width} height={400} />
      </Flex>
      <LinearGradient
        colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)"]}
        style={{
          position: "absolute",
          width: width,
          height: cardHeight,
          opacity: 0.15,
        }}
      />
      <Flex
        style={{
          position: "absolute",
          bottom: 0,
          left: space(2),
          right: space(6),
        }}
      >
        <Text variant="sm-display" color={color("mono0")}>
          {title}
        </Text>
        {!!subtitle && (
          <Text variant="sm" color={color("mono0")}>
            {subtitle}
          </Text>
        )}
        <Spacer y={2} />
      </Flex>
      {!!tag && (
        <CardTag {...tag} style={{ position: "absolute", top: space(2), left: space(2) }} />
      )}
    </View>
  )
}
