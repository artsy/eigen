import { NoImageIcon, Flex, useColor, Image } from "@artsy/palette-mobile"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
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
  const showBlurhash = useFeatureFlag("ARShowBlurhashImagePlaceholder")

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

  const targetURL = imageURL.replace(":version", "large")
  return (
    <Flex testID="Image-Remote">
      <Image
        src={targetURL}
        height={imageHeight}
        width={imageWidth}
        aspectRatio={aspectRatio}
        performResize={!useRawURL}
        blurhash={showBlurhash ? blurhash : undefined}
      />
    </Flex>
  )
}
