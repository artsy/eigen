import React from "react"
import { Dimensions, Image, Text, View } from "react-native"
import { AppClipButton } from "./Button"
import { textStyleBold, textStyleBoldItalic, textStyleGrey, viewStyleCTA } from "./styles"

interface AppClipArtworkTransactionalProps {
  artistName: string
  artwork: {
    title: string
    medium: string
    dimensions: {
      cm: string
    }
    price: string
    partner: {
      name: string
    }
  }
}

export const AppClipArtworkTransactional: React.FC<AppClipArtworkTransactionalProps> = ({ artwork }) => {
  const width = Dimensions.get("window").width
  return (
    <View>
      <Text
        style={{
          ...textStyleBold,
          marginBottom: 20,
        }}
      >
        {artwork.price}
      </Text>
      <Text style={textStyleGrey}>From {artwork.partner.name}</Text>
      <View
        style={{
          ...viewStyleCTA,
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          <Image source={require("./Icon-Small-40.png")} style={{ marginRight: 10 }} />
          <Text
            style={{
              ...textStyleBold,
              marginBottom: 10,
              maxWidth: width - 80,
            }}
          >
            Get the Artsy app to buy <Text style={textStyleBoldItalic}>{artwork.title}</Text>
          </Text>
        </View>
        <AppClipButton label="Download Artsy app" onPress={() => true} />
      </View>
    </View>
  )
}
