import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { LocalImage } from "app/utils/LocalImageStore"
import { Flex, NoImageIcon, useColor } from "palette"
import React from "react"
import { Image as RNImage } from "react-native"

export interface MyCollectionImageViewProps {
  imageURL?: string
  imageWidth: number
  imageHeight?: number
  aspectRatio?: number
  localImage?: LocalImage
}

export const MyCollectionImageView: React.FC<MyCollectionImageViewProps> = ({
  imageURL,
  imageWidth,
  imageHeight,
  aspectRatio,
  localImage,
}) => {
  const color = useColor()

  const renderImage = () => {
    if (!!imageURL) {
      const targetURL = imageURL.replace(":version", "square")
      return (
        <OpaqueImageView
          testID="Image-Remote"
          imageURL={targetURL}
          retryFailedURLs
          height={imageHeight}
          width={imageWidth}
          aspectRatio={aspectRatio}
        />
      )
    } else if (!!localImage) {
      return (
        <RNImage
          testID="Image-Local"
          style={{
            width: imageWidth,
            height: (imageWidth / localImage.width) * localImage.height,
          }}
          resizeMode="contain"
          source={{ uri: localImage.path }}
        />
      )
    } else {
      const width = imageWidth ?? 120
      return (
        <Flex
          testID="Fallback"
          bg={color("black5")}
          width={width}
          height={120}
          justifyContent="center"
        >
          <NoImageIcon fill="black60" mx="auto" />
        </Flex>
      )
    }
  }

  return <>{renderImage()}</>
}
