import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { Size } from "lib/Scenes/Artwork/Components/ImageCarousel/geometry"
import { LocalImage, retrieveLocalImage } from "lib/utils/LocalImageStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, useColor } from "palette"
import React, { useEffect, useState } from "react"
import { Image as RNImage } from "react-native"
import { getBoundingBox, myCollectionLocalPhotoKey } from "../Screens/ArtworkForm/MyCollectionImageUtil"
import { MyCollectionImageViewProps } from "./MyCollectionImageView"

export const MyCollectionDetailsImageView: React.FC<MyCollectionImageViewProps> = ({
  imageURL,
  imageWidth,
  imageHeight,
  aspectRatio,
  artworkSlug,
}) => {
  const color = useColor()
  const dimensions = useScreenDimensions()
  const [localImage, setLocalImage] = useState<LocalImage | null>(null)

  useEffect(() => {
    const localImageKey = myCollectionLocalPhotoKey(artworkSlug, 0)
    retrieveLocalImage(localImageKey).then((image) => {
      if (image) {
        setLocalImage(image)
      }
    })
  }, [])

  const renderImage = () => {
    const maxImageHeight = dimensions.height / 2.5
    if (!!imageURL) {
      return (
        <OpaqueImageView
          imageURL={imageURL}
          useRawURL
          retryFailedURLs
          height={imageHeight}
          width={imageWidth}
          aspectRatio={aspectRatio}
        />
      )
    } else if (localImage) {
      const localImageSize: Size = {
        width: localImage.width,
        height: localImage.height,
      }
      const imageSize = getBoundingBox(localImageSize, maxImageHeight, dimensions)
      return (
        <RNImage
          testID="Image"
          style={{ width: imageSize.width, height: imageSize.height, resizeMode: "cover" }}
          source={{ uri: localImage.path }}
        />
      )
    } else {
      return <Box testID="Fallback" bg={color("black30")} width={dimensions.width} height={maxImageHeight} />
    }
  }

  return <>{renderImage()}</>
}
