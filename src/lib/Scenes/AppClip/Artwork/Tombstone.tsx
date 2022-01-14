import React from "react"
import { Text, View } from "react-native"
import { textStyleBold, textStyleGrey } from "./styles"

interface AppClipArtworkTombstoneProps {
  artistName: string
  artwork: {
    title: string
    medium: string
    dimensions: {
      cm: string
    }
    date: string
  }
}

export const AppClipArtworkTombstone: React.FC<AppClipArtworkTombstoneProps> = ({ artistName, artwork }) => {
  return (
    <View>
      <Text
        style={{
          ...textStyleBold,
          marginBottom: 20,
        }}
      >
        {artistName}
      </Text>
      <Text style={textStyleGrey}>
        {artwork.title}, {artwork.date}
      </Text>
      <Text style={textStyleGrey}>{artwork.medium}</Text>
      <Text style={textStyleGrey}>{artwork.dimensions.cm}</Text>
    </View>
  )
}
