import * as React from "react"

import {
  MetadataText,
  PreviewText as P,
  SmallHeadline,
  Subtitle,
} from "../typography"

import {
  View,
} from "react-native"

import OpaqueImageView from "../../opaque_image_view"

export default class ConversationSnippet extends React.Component<{}, any> {

  render() {
    const galleryName = "Patrick Parrish"
    const artworkTitle = "Threestool, 2014"
    const artworkArtist = "Ian Stell · "
    const conversationText = "Hi Katarina, thanks for for reaching out with regards to this artwork"
    const date = "11:00 AM"
    const imageURL = "https://d32dm0rphc51dk.cloudfront.net/rmpESHC2mhtxdTq0S6mMCw/tall.jpg"
    return (
      <View style={{ marginLeft: 20, marginRight: 20 }}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <OpaqueImageView imageURL={imageURL} style={{ width: 58, height: 58 }} />
          <View style={{ flex: 1, flexDirection: "column", marginLeft: 15 }}>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
              <SmallHeadline>{galleryName}</SmallHeadline>
              <View style={{flex: 1, flexDirection: "row", justifyContent: "flex-end"}}>
                <MetadataText>{date}</MetadataText>
                <View style={{ height: 8, width: 8, borderRadius: 4, backgroundColor: "purple",
                marginLeft: 4, marginVertical: 4}} />
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Subtitle>{artworkArtist}</Subtitle><Subtitle>{artworkTitle}</Subtitle>
            </View>
            <P>{conversationText}</P>
          </View>
        </View>
        <View style={{ height: 1, width: "100%", backgroundColor: "black", marginTop: 20 }} />
      </View>
    )
  }
}
