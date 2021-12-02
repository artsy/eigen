import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { retrieveLocalImage } from "lib/utils/LocalImageStore"
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
  const [localImagePath, setLocalImagePath] = useState<string>("")

  useEffect(() => {
    const localImageKey = myCollectionLocalPhotoKey(artworkSlug, 0)
    retrieveLocalImage(localImageKey).then((imagePath) => {
      if (imagePath) {
        setLocalImagePath(imagePath)
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
    } else if (localImagePath) {
      return (
        <RNImage
          testID="Image"
          style={{ width: imageWidth, height: 120, resizeMode: "cover" }}
          source={{ uri: localImagePath }}
        />
      )
    } else {
      return <Box testID="Image" bg={color("black30")} width={imageWidth} height={120} />
    }
  }

  return <>{renderImage()}</>
}
