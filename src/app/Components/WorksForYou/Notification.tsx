import React from "react"
import {
  Image,
  ImageStyle,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import GenericGrid from "../ArtworkGrids/GenericGrid"

import { Notification_notification } from "__generated__/Notification_notification.graphql"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { ClassTheme, Sans } from "palette"

interface Props {
  // Special notifications will pass down an artistHref. Otherwise, grab it from the artworks.
  notification: Notification_notification & { artistHref?: string }
  width: number
}

const HORIZONTAL_PADDING = 20

export class Notification extends React.Component<Props> {
  handleArtistTap() {
    const artistHref =
      this.props.notification.artistHref ||
      extractNodes(this.props.notification.artworks)[0]?.artists?.[0]?.href
    if (artistHref) {
      navigate(artistHref)
    }
  }

  render() {
    const notification = this.props.notification
    const artworks = extractNodes(notification.artworks)

    // artwork-less notifications are rare but possible and very unsightly
    if (!artworks.length) {
      return null
    }

    return (
      <ClassTheme>
        {({ color }) => (
          <View style={styles.container}>
            <TouchableWithoutFeedback onPress={this.handleArtistTap.bind(this)}>
              <View style={styles.header}>
                {!!notification.image && (
                  <Image
                    source={{ uri: notification.image.resized?.url! }}
                    style={[styles.artistAvatar, { backgroundColor: color("black5") }]}
                  />
                )}
                <View style={styles.metadataContainer}>
                  <Sans size="3t">{notification.artists}</Sans>
                  <Sans size="2" color={color("black60")}>
                    {notification.summary}
                  </Sans>
                </View>
              </View>
            </TouchableWithoutFeedback>
            <View style={styles.gridContainer}>
              <GenericGrid width={this.props.width - HORIZONTAL_PADDING * 2} artworks={artworks} />
            </View>
          </View>
        )}
      </ClassTheme>
    )
  }
}

interface Styles {
  container: ViewStyle
  header: ViewStyle
  artistAvatar: ImageStyle
  metadataContainer: ViewStyle
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
    alignSelf: "center",
    borderRadius: 20,
    marginRight: 10,
  },
  metadataContainer: {
    alignSelf: "center",
    flex: 1,
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
