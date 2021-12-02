import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import React from "react"
import { MyCollectionImageViewProps } from "./MyCollectionImageView"

export const MyCollectionDetailsImageView: React.FC<MyCollectionImageViewProps> = ({
  imageURL,
  imageWidth,
  imageHeight,
  aspectRatio,
}) => {
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
}
