import { color, Flex, Sans, space } from "@artsy/palette"
import { ArtworkGridItem_artwork } from "__generated__/ArtworkGridItem_artwork.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import colors from "lib/data/colors"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { get } from "lib/utils/get"
import { map } from "lodash"
import React from "react"
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"
import { Schema, Track, track as _track } from "../../utils/track"
import SerifText from "../Text/Serif"

const Badges = styled.View`
  position: absolute;
  bottom: ${space(0.5)};
  left: 0;
  display: flex;
  flex-direction: row;
`
const Badge = styled.View`
  border-radius: 2px;
  padding: 3px 5px 1px 6px;
  background-color: white;
  margin-left: ${space(0.5)};
`

interface Props {
  artwork: ArtworkGridItem_artwork
  // If it's not provided, then it will push just the one artwork
  // to the switchboard.
  onPress?: (artworkID: string) => void
  trackingFlow?: string
  contextModule?: string
}

const track: Track<Props, any> = _track

@track()
export class Artwork extends React.Component<Props, any> {
  @track((props: Props) => ({
    action_name: Schema.ActionNames.GridArtwork,
    action_type: Schema.ActionTypes.Tap,
    flow: props.trackingFlow,
    context_module: props.contextModule,
  }))
  handleTap() {
    // FIXME: Should this be internalID?
    this.props.onPress && this.props.artwork.slug
      ? this.props.onPress(this.props.artwork.slug)
      : SwitchBoard.presentNavigationViewController(this, this.props.artwork.href)
  }

  render() {
    const artwork = this.props.artwork
    const partnerName = artwork.partner && artwork.partner.name
    const artworkImage = artwork.image
    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
        <View>
          {artworkImage && (
            <View style={styles.imageWrapper}>
              <OpaqueImageView aspectRatio={artwork.image.aspect_ratio} imageURL={artwork.image.url} />
              {this.badges()}
            </View>
          )}
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
              <Sans weight="medium" size="0">
                BUY NOW
              </Sans>
            </Badge>
          )}
          {!!is_offerable && (
            <Badge>
              <Sans weight="medium" size="0">
                MAKE OFFER
              </Sans>
            </Badge>
          )}
          {!!is_biddable && (
            <Badge>
              <Sans weight="medium" size="0">
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
    const inRunningAuction = sale && sale.is_auction && !sale.is_closed

    if (inRunningAuction) {
      return get(sale_artwork, sa => sa.current_bid.display)
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
      sale_message: saleMessage
      is_biddable: isBiddable
      is_acquireable: isAcquireable
      is_offerable: isOfferable
      slug
      sale {
        is_auction: isAuction
        is_closed: isClosed
        display_timely_at: displayTimelyAt
      }
      sale_artwork: saleArtwork {
        current_bid: currentBid {
          display
        }
      }
      image {
        url(version: "large")
        aspect_ratio: aspectRatio
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
