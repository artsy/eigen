import React from "react"
import { Text, View } from "react-native"

interface AppClipArtworkTombstoneProps {
  artistName: string
}

const textStyle = {
  fontSize: 16,
  fontFamily: "Unica77LL",
}

export const AppClipArtworkTombstone: React.FC<AppClipArtworkTombstoneProps> = ({ artistName }) => {
  return (
    <View>
      <Text style={textStyle}>{artistName}</Text>
      <Text>{artistName}</Text>
    </View>
  )
}
