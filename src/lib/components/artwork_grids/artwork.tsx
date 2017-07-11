import { map } from "lodash"
import * as React from "react"
import { Image, StyleSheet, TouchableWithoutFeedback, View } from "react-native"
import * as Relay from "react-relay"

import colors from "../../../data/colors"
import SwitchBoard from "../../native_modules/switch_board"
import ImageView from "../opaque_image_view"
import SerifText from "../text/serif"

class Artwork extends React.Component<RelayProps, any> {
  handleTap() {
    SwitchBoard.presentNavigationViewController(this, this.props.artwork.href)
  }

  render() {
    const artwork = this.props.artwork
    const partnerName = this.props.artwork.partner && this.props.artwork.partner.name
    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
        <View>
          <ImageView style={styles.image} aspectRatio={artwork.image.aspect_ratio} imageURL={artwork.image.url} />
          { this.artists() }
          { this.artworkTitle() }
          { partnerName && <SerifText style={styles.text}>{partnerName}</SerifText> }
          { this.saleMessage() }
        </View>
      </TouchableWithoutFeedback>
    )
  }

  artists() {
    const artists = this.props.artwork.artists
    if (artists && artists.length > 0) {
      return (
        <SerifText style={[styles.text, styles.artist]}>
          {map(artists, "name").join(", ")}
        </SerifText>
      )
    } else {
      return null
    }
  }

  artworkTitle() {
    const artwork = this.props.artwork
    if (artwork.title) {
      return (
        <SerifText style={styles.text}>
          <SerifText style={[styles.text, styles.title]}>{ artwork.title }</SerifText>
          { artwork.date ? (", " + artwork.date) : "" }
        </SerifText>
      )
    } else {
      return null
    }
  }

  saleMessage() {
    const artwork = this.props.artwork
    if (artwork.is_in_auction && artwork.sale_artwork.sale.is_open) {
      const numberOfBids = artwork.sale_artwork.bidder_positions_count
      let text = artwork.sale_artwork.opening_bid.display
      if (numberOfBids > 0 ) {
        text = `${artwork.sale_artwork.current_bid.display} (${numberOfBids} bid${numberOfBids === 1 ? "" : "s"})`
      }
      return (
        <View style={{flexDirection: "row"}}>
          <Image style={{ marginRight: 4 }} source={require("../../../../images/paddle.png")} />
          <SerifText style={styles.text}>{text}</SerifText>
        </View>
      )
    } else {
      return artwork.sale_message && <SerifText style={styles.text}>{artwork.sale_message}</SerifText>
    }
   }
}

const styles = StyleSheet.create({
  image: {
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    color: colors["gray-semibold"],
  },
  artist: {
    fontWeight: "bold",
  },
  title: {
    fontStyle: "italic",
  },
})

export default Relay.createContainer(Artwork, {
  fragments: {
    artwork: () => Relay.QL`
      fragment on Artwork {
        title
        date
        sale_message
        is_in_auction
        sale_artwork {
          opening_bid { display }
          current_bid { display }
          bidder_positions_count
          sale {
            is_open
          }
        }
        image {
          url(version: "large")
          aspect_ratio
        }
        artists {
          name
        }
        partner {
          name
        }
        href
      }
    `,
  },
})

interface RelayProps {
  artwork: {
    title: string | null,
    date: string | null,
    sale_message: string | null,
    is_in_auction: boolean | null,
    sale_artwork: {
      opening_bid: {
        display: string | null,
      } | null,
      current_bid: {
        display: string | null,
      } | null,
      bidder_positions_count: number | null,
      sale: {
        is_open: boolean | null,
      } | null,
    } | null,
    image: {
      url: string | null,
      aspect_ratio: number | null,
    } | null,
    artists: Array<{
      name: string | null,
    } | null> | null,
    partner: {
      name: string | null,
    } | null,
    href: string | null,
  },
}
