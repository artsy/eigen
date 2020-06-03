import React from "react"
import { Image, ImageStyle, StyleSheet, TextStyle, TouchableWithoutFeedback, View, ViewStyle } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import colors from "lib/data/colors"
import { get } from "lib/utils/get"
import SwitchBoard from "../../NativeModules/SwitchBoard"
import GenericGrid from "../ArtworkGrids/GenericGrid"
import Headline from "../Text/Headline"
import SerifText from "../Text/Serif"

import { Notification_notification } from "__generated__/Notification_notification.graphql"

interface Props {
  // Special notifications will pass down an artistHref. Otherwise, grab it from the artworks.
  notification: Notification_notification & { artistHref?: string }
  width: number
}

const HORIZONTAL_PADDING = 20

export class Notification extends React.Component<Props> {
  handleArtistTap() {
    const artistHref =
      // @ts-ignore STRICTNESS_MIGRATION
      this.props.notification.artistHref || get(this.props.notification, n => n.artworks.edges[0].node.artists[0].href)
    if (artistHref) {
      SwitchBoard.presentNavigationViewController(this, artistHref)
    }
  }

  render() {
    const notification = this.props.notification

    // artwork-less notifications are rare but possible and very unsightly
    // @ts-ignore STRICTNESS_MIGRATION
    if (!notification.artworks.edges.length) {
      return null
    }

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.handleArtistTap.bind(this)}>
          <View style={styles.header}>
            {!!notification.image && (
              // @ts-ignore STRICTNESS_MIGRATION
              <Image source={{ uri: notification.image.resized.url }} style={styles.artistAvatar} />
            )}
            <View style={styles.metadataContainer}>
              <Headline style={styles.artistName}>{notification.artists}</Headline>
              <SerifText style={styles.metadata}>{notification.summary}</SerifText>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.gridContainer}>
          <GenericGrid
            width={this.props.width - HORIZONTAL_PADDING * 2}
            // @ts-ignore STRICTNESS_MIGRATION
            artworks={notification.artworks.edges.map(({ node }) => node)}
          />
        </View>
      </View>
    )
  }
}

interface Styles {
  container: ViewStyle
  header: ViewStyle
  artistAvatar: ImageStyle
  metadataContainer: ViewStyle
  artistName: TextStyle
  metadata: TextStyle
  gridContainer: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    marginTop: 20,
    marginHorizontal: HORIZONTAL_PADDING,
  },
  header: {
    flexDirection: "row",
  },
  artistAvatar: {
    height: 40,
    width: 40,
    backgroundColor: colors["gray-light"],
    alignSelf: "center",
    borderRadius: 20,
    marginRight: 10,
  },
  metadataContainer: {
    alignSelf: "center",
    flex: 1,
  },
  artistName: {
    fontSize: 12,
  },
  metadata: {
    marginTop: 2,
    fontSize: 14,
    color: colors["gray-semibold"],
  },
  gridContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
})

export default createFragmentContainer(Notification, {
  notification: graphql`
    fragment Notification_notification on FollowedArtistsArtworksGroup {
      summary
      artists
      artworks: artworksConnection(first: 10) {
        edges {
          node {
            artists(shallow: true) {
              href
            }
            ...GenericGrid_artworks
          }
        }
      }
      image {
        resized(height: 80, width: 80) {
          url
        }
      }
    }
  `,
})
