import * as React from "react"

import {
  MetadataText,
  PreviewText as P,
  SmallHeadline,
  Subtitle,
} from "../typography"

import {
  StyleSheet,
  View,
  ViewStyle,
} from "react-native"

import colors from "../../../../data/colors"
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
      <View style={styles.conversationCard}>
        <View style={styles.contentContainer}>
          <OpaqueImageView imageURL={imageURL} style={styles.image} />
          <View style={styles.textContainer}>
            <View style={styles.headingContainer}>
              <SmallHeadline>{galleryName}</SmallHeadline>
              <View style={styles.dateContainer}>
                <MetadataText>{date}</MetadataText>
                <View style={styles.unreadIndicator} />
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Subtitle>{artworkArtist}</Subtitle><Subtitle>{artworkTitle}</Subtitle>
            </View>
            <P>{conversationText}</P>
          </View>
        </View>
        <View style={styles.separator} />
      </View>
    )
  }
}

interface Styles {
  conversationCard: ViewStyle,
  contentContainer: ViewStyle,
  image: ViewStyle,
  textContainer: ViewStyle,
  headingContainer: ViewStyle,
  dateContainer: ViewStyle,
  unreadIndicator: ViewStyle,
  separator: ViewStyle,
}

const styles = StyleSheet.create<Styles>({
  conversationCard: {
    marginLeft: 20, marginRight: 20, marginTop: 20,
  },
  image: {
    width: 58, height: 58,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1, flexDirection: "column", marginLeft: 15,
  },
  headingContainer: {
    flex: 1,
    flexDirection: "row",
  },
  dateContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  unreadIndicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: colors["purple-regular"],
    marginLeft: 4,
    marginVertical: 3,
  },
  separator: {
    height: 1, width: "100%", backgroundColor: colors["gray-regular"], marginTop: 20,
  },
})
