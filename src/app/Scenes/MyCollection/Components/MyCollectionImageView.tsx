import { NoArtIcon } from "@artsy/icons/native"
import { Flex, useColor, Image } from "@artsy/palette-mobile"
import React from "react"

export interface MyCollectionImageViewProps {
  imageURL?: string
  imageWidth: number
  imageHeight?: number
  aspectRatio?: number
  artworkSlug: string
  useRawURL?: boolean
  internalID?: string | null
  versions?: string[]
  blurhash?: string | null | undefined
}

export const MyCollectionImageView: React.FC<MyCollectionImageViewProps> = ({
  imageURL,
  imageWidth,
  imageHeight,
  aspectRatio,
  useRawURL,
  blurhash,
}) => {
  const color = useColor()

  if (!imageURL) {
    return (
      <Flex
        testID="Fallback"
        bg={color("mono5")}
        width={imageWidth ?? 120}
        height={120}
        justifyContent="center"
      >
        <NoArtIcon fill="mono60" mx="auto" />
      </Flex>
    )
  }

  const targetURL = imageURL.replace(":version", "large")
  return (
    <Flex testID="Image-Remote">
      <Image
        src={targetURL}
        height={imageHeight}
        width={imageWidth}
        aspectRatio={aspectRatio}
        performResize={!useRawURL}
        blurhash={blurhash}
      />
    </Flex>
  )
}
