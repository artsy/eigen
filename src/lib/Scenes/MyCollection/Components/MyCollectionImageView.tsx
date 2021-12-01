import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { retrieveLocalImage } from "lib/utils/LocalImageStore"
import { Box, useColor } from "palette"
import React, { useEffect, useState } from "react"
import { Image as RNImage } from "react-native"
import { myCollectionLocalPhotoKey } from "../Screens/ArtworkFormModal/MyCollectionImageUtil"

interface MyCollectionImageViewProps {
  imageURL?: string
  imageWidth: number
  aspectRatio?: number
  artworkSlug: string
}

export const MyCollectionImageView: React.FC<MyCollectionImageViewProps> = ({
  imageURL,
  imageWidth,
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
          testID="Image"
          imageURL={imageURL.replace(":version", "square")}
          aspectRatio={aspectRatio ?? 1}
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
