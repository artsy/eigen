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

export default class ConversationSnippet extends React.Component<any, any> {

  render() {
    const conversation = this.props.conversation
    const artwork = conversation.artworks[0]

    const galleryName = conversation.to_name
    const artworkTitle = `${artwork.title}, ${artwork.date}`
    const artworkArtist = `${artwork.artist.name} · `
    const conversationText = conversation.last_message.replace(/\n/g, " ")
    const date = "11:00 AM"
    const imageURL = artwork.image.url

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
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
  image: {
    width: 58,
    height: 58,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 15,
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
    height: 1,
    width: "100%",
    backgroundColor: colors["gray-regular"],
    marginTop: 20,
  },
})
