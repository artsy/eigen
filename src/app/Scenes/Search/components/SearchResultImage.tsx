import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import React from "react"

export const IMAGE_SIZE = 40

export const SearchResultImage: React.FC<{ imageURL: string | null; resultType: string }> = ({
  imageURL,
  resultType,
}) => {
  const round = resultType === "Artist"

  return (
    <OpaqueImageView
      useRawURL={resultType === "Article"}
      imageURL={imageURL}
      style={{
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        borderRadius: round ? IMAGE_SIZE / 2 : 0,
        overflow: "hidden",
      }}
    />
  )
}
