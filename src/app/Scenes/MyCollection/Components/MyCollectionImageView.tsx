import { NoImageIcon } from "@artsy/palette-mobile"
import { Flex, useColor } from "palette"
import OpaqueImageView2 from "palette/elements/OpaqueImageView/OpaqueImageView2"
import React from "react"

export interface MyCollectionImageViewProps {
  imageURL?: string
  imageWidth: number
  imageHeight?: number
  aspectRatio?: number
  artworkSlug: string
  artworkSubmissionId?: string | null
  useRawURL?: boolean
  internalID?: string | null
  versions?: string[]
}

export const MyCollectionImageView: React.FC<MyCollectionImageViewProps> = ({
  imageURL,
  imageWidth,
  imageHeight,
  aspectRatio,
  useRawURL,
}) => {
  const color = useColor()

  if (!imageURL) {
    return (
      <Flex
        testID="Fallback"
        bg={color("black5")}
        width={imageWidth ?? 120}
        height={120}
        justifyContent="center"
      >
        <NoImageIcon fill="black60" mx="auto" />
      </Flex>
    )
  }

  const targetURL = imageURL.replace(":version", "square")
  return (
    <Flex testID="Image-Remote">
      <OpaqueImageView2
        imageURL={targetURL}
        retryFailedURLs
        height={imageHeight}
        width={imageWidth}
        aspectRatio={aspectRatio}
        useRawURL={useRawURL}
      />
    </Flex>
  )
}
