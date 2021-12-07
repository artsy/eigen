import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { LocalImage, retrieveLocalImage } from "lib/utils/LocalImageStore"
import { Box, useColor } from "palette"
import React, { useEffect, useState } from "react"
import { Image as RNImage } from "react-native"
import { myCollectionLocalPhotoKey } from "../Screens/ArtworkFormModal/MyCollectionImageUtil"

export interface MyCollectionImageViewProps {
  imageURL?: string
  imageWidth: number
  imageHeight?: number
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
          testID="Image-Remote"
          imageURL={imageURL.replace(":version", "square")}
          aspectRatio={aspectRatio ?? 1}
        />
      )
    } else if (localImage) {
      return (
        <RNImage
          testID="Image-Local"
          style={{ width: imageWidth, height: 120, resizeMode: "cover" }}
          source={{ uri: localImage.path }}
        />
      )
    } else {
      return <Box testID="Fallback" bg={color("black30")} width={imageWidth} height={120} />
    }
  }

  return <>{renderImage()}</>
}
