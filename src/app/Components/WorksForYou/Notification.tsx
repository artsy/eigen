import { Text } from "@artsy/palette-mobile"
import { Notification_notification$data } from "__generated__/Notification_notification.graphql"
import GenericGrid from "app/Components/ArtworkGrids/GenericGrid"
import { ThemeAwareClassTheme } from "app/Components/DarkModeClassTheme"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
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

interface Props {
  // Special notifications will pass down an artistHref. Otherwise, grab it from the artworks.
  notification: Notification_notification$data & { artistHref?: string }
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
      <ThemeAwareClassTheme>
        {({ color }) => (
          <View style={styles.container}>
            <TouchableWithoutFeedback
              accessibilityRole="button"
              onPress={this.handleArtistTap.bind(this)}
            >
              <View style={styles.header}>
                {!!notification.image && (
                  <Image
                    source={{ uri: notification.image.resized?.url }}
                    style={[styles.artistAvatar, { backgroundColor: color("mono5") }]}
                  />
                )}
                <View style={styles.metadataContainer}>
                  <Text variant="sm">{notification.artists}</Text>
                  <Text variant="xs" color={color("mono60")}>
                    {notification.summary}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
            <View style={styles.gridContainer}>
              <GenericGrid artworks={artworks} />
            </View>
          </View>
        )}
      </ThemeAwareClassTheme>
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
