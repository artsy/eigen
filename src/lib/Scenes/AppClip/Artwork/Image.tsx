import React from "react"
import { Dimensions } from "react-native"
import { Image, View } from "react-native"

interface AppClipArtworkImageProps {
  url: string
  aspectRatio: number
}

export const AppClipArtworkImage: React.FC<AppClipArtworkImageProps> = ({ url, aspectRatio }) => {
  const width = Dimensions.get("window").width
  const height = Dimensions.get("window").height
  const maxHeight = height * 0.4
  let imageWidth: number
  let imageHeight: number
  if (aspectRatio < 1) {
    imageHeight = maxHeight
    imageWidth = imageHeight * aspectRatio
  } else {
    imageWidth = width
    imageHeight = imageWidth / aspectRatio
  }
  return (
    <View
      style={{
        width,
        backgroundColor: "white",
        alignItems: "center",
        marginTop: height * 0.1,
      }}
    >
      <Image source={{ uri: url }} style={{ width: imageWidth, height: imageHeight }} />
    </View>
  )
}
