import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { Size } from "lib/Scenes/Artwork/Components/ImageCarousel/geometry"
import { LocalImage, retrieveLocalImage } from "lib/utils/LocalImageStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, useColor } from "palette"
import React, { useEffect, useState } from "react"
import { Image as RNImage } from "react-native"
import { getBoundingBox, myCollectionLocalPhotoKey } from "../Screens/ArtworkForm/MyCollectionImageUtil"

export interface MyCollectionImageViewProps {
  imageURL?: string
  imageWidth?: number
  imageHeight?: number
  aspectRatio?: number
  artworkSlug: string
  mode: "list" | "details"
}

export const MyCollectionImageView: React.FC<MyCollectionImageViewProps> = ({
  imageURL,
  imageWidth,
  imageHeight,
  aspectRatio,
  artworkSlug,
  mode,
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

  const imageSize = (imageMode: "details" | "list", image: LocalImage, width?: number) => {
    if (imageMode === "details") {
      const maxImageHeight = dimensions.height / 2.5
      const localImageSize: Size = {
        width: image.width,
        height: image.height,
      }
      const size = getBoundingBox(localImageSize, maxImageHeight, dimensions)
      return size
    } else {
      const size = {
        width: width ?? 120,
        height: 120,
      }
      return size
    }
  }

  const renderImage = () => {
    if (!!imageURL) {
      const targetURL = mode === "list" ? imageURL.replace(":version", "square") : imageURL
      const useRawURL = mode !== "list"
      return (
        <OpaqueImageView
          testID="Image-Remote"
          imageURL={targetURL}
          useRawURL={useRawURL}
          retryFailedURLs
          height={imageHeight}
          width={imageWidth}
          aspectRatio={aspectRatio}
        />
      )
    } else if (localImage) {
      const size = imageSize(mode, localImage, imageWidth)

      return (
        <RNImage
          testID="Image-Local"
          style={{ width: size.width, height: size.height, resizeMode: "cover" }}
          source={{ uri: localImage.path }}
        />
      )
    } else {
      return <Box testID="Fallback" bg={color("black30")} width={imageWidth ?? 120} height={120} />
    }
  }

  return <>{renderImage()}</>
}
