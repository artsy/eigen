import React from "react"
import { Image, ImageStyle, StyleSheet, TextStyle, TouchableWithoutFeedback, View, ViewStyle } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import SwitchBoard from "../../NativeModules/SwitchBoard"
import GenericGrid from "../ArtworkGrids/GenericGrid"
import Headline from "../Text/Headline"
import SerifText from "../Text/Serif"

import colors from "lib/data/colors"

import { Notification_notification } from "__generated__/Notification_notification.graphql"

interface Props {
  // Special notifications will pass down an artistHref. Otherwise, grab it from the artworks.
  notification: Notification_notification & { artistHref?: string }
}

export class Notification extends React.Component<Props> {
  handleArtistTap() {
    const artistHref = this.props.notification.artistHref || this.props.notification.artworks[0].artists[0].href
    if (artistHref) {
      SwitchBoard.presentNavigationViewController(this, artistHref)
    }
  }

  render() {
    const notification = this.props.notification

    // artwork-less notifications are rare but possible and very unsightly
    if (!notification.artworks.edges.length) {
      return null
    }

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.handleArtistTap.bind(this)}>
          <View style={styles.header}>
            {notification.image && (
              <Image source={{ uri: notification.image.resized.url }} style={styles.artistAvatar} />
            )}
            <View style={styles.metadataContainer}>
              <Headline style={styles.artistName}>{notification.artists}</Headline>
              <SerifText style={styles.metadata}>{notification.summary}</SerifText>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.gridContainer}>
          <GenericGrid artworks={notification.artworks.edges.map(({ node }) => node)} />
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
    marginLeft: 20,
    marginRight: 20,
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
      artworks(first: 10) {
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
