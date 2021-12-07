import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { LocalImage, retrieveLocalImage } from "lib/utils/LocalImageStore"
import { Box, useColor } from "palette"
import React, { useEffect, useState } from "react"
import { Image as RNImage } from "react-native"
import { myCollectionLocalPhotoKey } from "../Screens/ArtworkFormModal/MyCollectionImageUtil"
import { MyCollectionImageViewProps } from "./MyCollectionImageView"

export const MyCollectionDetailsImageView: React.FC<MyCollectionImageViewProps> = ({
  imageURL,
  imageWidth,
  imageHeight,
  aspectRatio,
  artworkSlug,
}) => {
  const color = useColor()
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
      return (
        <RNImage
          testID="Image"
          style={{ width: imageWidth, height: 120, resizeMode: "cover" }}
          source={{ uri: localImage.path }}
        />
      )
    } else {
      return <Box testID="Image" bg={color("black30")} width={imageWidth} height={120} />
    }
  }

  return <>{renderImage()}</>
}
