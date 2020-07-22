import { color, Flex, Sans, space, Spacer } from "@artsy/palette"
import React from "react"
import { Image, View } from "react-native"

import { CardTag, CardTagProps } from "./CardTag"

export interface SmallCardProps {
  images: string[]
  title: string
  subtitle?: string
  tag?: CardTagProps
}

/**
 * `SmallCard` is a card with a layout one square image on the left,
 * one tall or two square images on the right, and text for title and subtitle
 * at the bottom.
 */
export const SmallCard: React.FC<SmallCardProps> = ({ images, title, subtitle, tag }) => {
  return (
    <View>
      <View
        style={{
          width: "100%",
          aspectRatio: 1.5 / 1.0,
          flexDirection: "row",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <Flex flex={2} background={color("black10")}>
          <Image source={{ uri: images[0] }} style={{ flex: 1 }} />
        </Flex>
        <Spacer mr="2px" />
        <Flex flex={1}>
          {images.length < 2 && <Flex flex={1} background={color("black10")} />}
          {!!images[1] && <Image source={{ uri: images[1] }} style={{ flex: 1 }} />}
          {!!images[2] && (
            <>
              <Spacer mt="2px" />
              <Image source={{ uri: images[2] }} style={{ flex: 1 }} />
            </>
          )}
        </Flex>
      </View>
      <Spacer mt={1} />
      <Sans size="3t" weight="medium">
        {title}
      </Sans>
      {!!subtitle && (
        <Sans size="3t" color={color("black60")}>
          {subtitle}
        </Sans>
      )}
      {!!tag && <CardTag {...tag} style={{ position: "absolute", top: space(1), left: space(1) }} />}
    </View>
  )
}
