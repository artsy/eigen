import * as React from "react"
import { Image, StyleSheet, TextStyle, TouchableWithoutFeedback, View, ViewProperties, ViewStyle } from "react-native"
import * as Relay from "react-relay"

import SwitchBoard from "../../native_modules/switch_board"
import ArtworksGrid from "../artwork_grids/generic_grid"
import Headline from "../text/headline"
import SerifText from "../text/serif"

import colors from "../../../data/colors"

interface Props extends RelayProps {}

export class Notification extends React.Component<Props, any> {
  handleArtistTap() {
    const artistHref = this.props.notification.artworks[0].artists[0].href
    SwitchBoard.presentNavigationViewController(this, artistHref)
  }

  render() {
    const notification = this.props.notification

    // artwork-less notifications are rare but possible and very unsightly
    if (!notification.artworks.length) {
      return null
    }

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.handleArtistTap.bind(this)}>
          <View style={styles.header}>
            { <Image source={{uri: notification.image.resized.url}} style={styles.artistAvatar}/> }
            <View style={{alignSelf: "center"}}>
              <Headline style={styles.artistName}>{notification.artists}</Headline>
              <SerifText style={styles.metadata}>{notification.message + " · " + notification.date}</SerifText>
            </View>
            { notification.status === "UNREAD" && <View style={styles.readStatus}/>}
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.gridContainer}>
          <ArtworksGrid artworks={notification.artworks}/>
        </View>
      </View>
    )
  }
}

interface Styles {
  container: ViewStyle,
  header: ViewStyle,
  artistAvatar: ViewStyle,
  artistName: TextStyle,
  metadata: TextStyle,
  gridContainer: ViewStyle,
  readStatus: ViewStyle,
}

const styles = StyleSheet.create<Styles>({
  container: {
    marginTop: 20,
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
  artistName: {
    fontSize: 14,
  },
  metadata: {
    marginTop: 2,
    fontSize: 16,
    color: "gray",
  },
  gridContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  readStatus: {
    backgroundColor: colors["purple-regular"],
    width: 10,
    height: 10,
    borderRadius: 5,
    position: "absolute",
    right: 0,
  },
})

export default Relay.createContainer(Notification, {
  fragments: {
    notification: () => Relay.QL`
      fragment on NotificationsFeedItem {
        date(format: "MMM D")
        message
        artists
        artworks {
          artists (shallow: true) {
            href
          }
          ${ArtworksGrid.getFragment("artworks")}
        }
        status
        image {
          resized(height: 80, width: 80) {
            url
          }
        }
      }
    `,
  },
})

interface RelayProps {
  notification: {
    date: string,
    message: string,
    artists: string,
    artworks: any[],
    status: string,
    image: {
      resized: {
        url: string,
      },
    } | null,
  },
}
