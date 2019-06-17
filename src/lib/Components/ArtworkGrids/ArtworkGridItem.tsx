import { color, Flex, Sans } from "@artsy/palette"
import OpaqueImageView from "lib/Components/OpaqueImageView"
import colors from "lib/data/colors"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { map } from "lodash"
import React from "react"
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"
import SerifText from "../Text/Serif"

import { ArtworkGridItem_artwork } from "__generated__/ArtworkGridItem_artwork.graphql"

const Badges = styled.View`
  position: absolute;
  bottom: 16px;
  left: 1px;
  display: flex;
  flex-direction: row;
`
const Badge = styled.View`
  border-radius: 2px;
  padding: 3px 5px 1px 6px;
  background-color: white;
  margin-left: 5px;
`

interface Props {
  artwork: ArtworkGridItem_artwork
  // Passes the Artwork ID back up to another component
  // ideally, this would be used to send an array of Artworks
  // through to Eigen where this item is the default selected one.
  //
  // If it's not provided, then it will push just the one artwork
  // to the switchboard.
  onPress?: (artworkID: string) => void
}

export class Artwork extends React.Component<Props, any> {
  handleTap() {
    this.props.onPress && this.props.artwork.gravityID
      ? this.props.onPress(this.props.artwork.gravityID)
      : SwitchBoard.presentNavigationViewController(this, this.props.artwork.href)
  }

  render() {
    const artwork = this.props.artwork
    const partnerName = artwork.partner && artwork.partner.name
    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
        <View>
          <View style={styles.imageWrapper}>
            <OpaqueImageView aspectRatio={artwork.image.aspect_ratio} imageURL={artwork.image.url} />
            {this.badges()}
          </View>
          {this.saleInfoLine()}
          {this.artists()}
          {this.artworkTitle()}
          {!!partnerName && <SerifText style={styles.text}>{partnerName}</SerifText>}
        </View>
      </TouchableWithoutFeedback>
    )
  }

  hasBadges() {
    const { is_acquireable, is_biddable, is_offerable } = this.props.artwork
    return is_acquireable || is_biddable || is_offerable
  }

  badges() {
    const { is_acquireable, is_biddable, is_offerable } = this.props.artwork

    // TODO: Replace with proper size "0".
    return (
      this.hasBadges() && (
        <Badges>
          {!!is_acquireable && (
            <Badge>
              <Sans fontSize="8px" lineHeight={8} style={{ paddingTop: 1 }} weight="medium" size="1">
                BUY NOW
              </Sans>
            </Badge>
          )}
          {!!is_offerable && (
            <Badge>
              <Sans fontSize="8px" lineHeight={8} style={{ paddingTop: 1 }} weight="medium" size="1">
                MAKE OFFER
              </Sans>
            </Badge>
          )}
          {!!is_biddable && (
            <Badge>
              <Sans fontSize="8px" lineHeight={8} style={{ paddingTop: 1 }} weight="medium" size="1">
                BID
              </Sans>
            </Badge>
          )}
        </Badges>
      )
    )
  }

  artists() {
    const artists = this.props.artwork.artists
    if (artists && artists.length > 0) {
      return <SerifText style={[styles.text, styles.artist]}>{map(artists, "name").join(", ")}</SerifText>
    } else {
      return null
    }
  }

  artworkTitle() {
    const artwork = this.props.artwork
    if (artwork.title) {
      return (
        <SerifText style={styles.text}>
          <SerifText style={[styles.text, styles.title]}>{artwork.title}</SerifText>
          {artwork.date ? ", " + artwork.date : ""}
        </SerifText>
      )
    } else {
      return null
    }
  }

  saleInfoLine() {
    const { artwork } = this.props
    const { sale } = artwork
    const inClosedAuction = sale && sale.is_auction && sale.is_closed
    const renderSaleInfo = inClosedAuction || !!this.saleMessageOrBidInfo() || !!this.auctionInfo()

    if (!renderSaleInfo) {
      return null
    }

    // TODO: Look into wrapping in <Theme> component to remove `color` util functions
    return (
      <Flex flexDirection="row" mb="2px">
        <Sans color={color("black100")} weight="medium" size="2" fontSize="13px" lineHeight="18px">
          {inClosedAuction ? "Bidding closed" : this.saleMessageOrBidInfo()}{" "}
        </Sans>
        <Sans size="2" color={color("black60")}>
          {!inClosedAuction && this.auctionInfo()}
        </Sans>
      </Flex>
    )
  }

  saleMessageOrBidInfo() {
    const { artwork } = this.props
    const { sale, sale_artwork } = artwork
    const inRunningAuction = sale && sale_artwork && sale.is_auction && !sale.is_closed

    if (inRunningAuction) {
      const currentBid = sale_artwork.current_bid
      return currentBid && currentBid.display
    }

    // TODO: Extract this sentence-cased version and apply everywhere.
    if (artwork.sale_message === "Contact For Price") {
      return "Contact for price"
    }

    return artwork.sale_message
  }

  auctionInfo() {
    const { artwork } = this.props
    const { sale } = artwork

    if (sale) {
      return `(${sale.display_timely_at})`
    }
  }
}

const styles = StyleSheet.create({
  imageWrapper: {
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: 18,
    height: 18,
    color: colors["gray-semibold"],
  },
  artist: {
    fontWeight: "bold",
  },
  title: {
    fontStyle: "italic",
  },
})

export default createFragmentContainer(Artwork, {
  artwork: graphql`
    fragment ArtworkGridItem_artwork on Artwork {
      title
      date
      sale_message
      is_in_auction
      is_biddable
      is_acquireable
      is_offerable
      gravityID
      sale {
        is_auction
        is_live_open
        is_open
        is_closed
        display_timely_at
      }
      sale_artwork {
        current_bid {
          display
        }
      }
      image {
        url(version: "large")
        aspect_ratio
      }
      artists(shallow: true) {
        name
      }
      partner {
        name
      }
      href
    }
  `,
})
