import { Sans, Spacer } from "@artsy/palette"
import { ArtworkExtraLinks_artwork } from "__generated__/ArtworkExtraLinks_artwork.graphql"
import { AuctionTimerState } from "lib/Components/Bidding/Components/Timer"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Router } from "lib/utils/router"
import { Schema, track } from "lib/utils/track"
import React from "react"
import { Linking, Text } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

export interface ArtworkExtraLinksProps {
  artwork: ArtworkExtraLinks_artwork
  auctionState: AuctionTimerState
}

@track()
export class ArtworkExtraLinks extends React.Component<ArtworkExtraLinksProps> {
  handleReadOurFAQTap = () => {
    SwitchBoard.presentNavigationViewController(this, `/buy-now-feature-faq`)
  }

  @track({
    action_name: Schema.ActionNames.AskASpecialist,
    action_type: Schema.ActionTypes.Tap,
    context_module: Schema.ContextModules.ArtworkExtraLinks,
  })
  handleAskASpecialistTap(emailAddress) {
    const { artwork } = this.props
    const mailtoSubject = `Inquiry on ${artwork.title}`.concat(
      artwork.artist && artwork.artist.name ? ` by ${artwork.artist.name}` : ""
    )
    Linking.openURL(`mailto:${emailAddress}?subject=${mailtoSubject}`)
  }

  @track({
    action_name: Schema.ActionNames.AuctionsFAQ,
    action_type: Schema.ActionTypes.Tap,
    context_module: Schema.ContextModules.ArtworkExtraLinks,
  })
  handleReadOurAuctionFAQsTap() {
    SwitchBoard.presentNavigationViewController(this, `/auction-faq`)
    return
  }

  @track({
    action_name: Schema.ActionNames.ConditionsOfSale,
    action_type: Schema.ActionTypes.Tap,
    context_module: Schema.ContextModules.ArtworkExtraLinks,
  })
  handleConditionsOfSaleTap() {
    SwitchBoard.presentNavigationViewController(this, `/conditions-of-sale`)
  }

  @track({
    action_name: Schema.ActionNames.ConsignWithArtsy,
    action_type: Schema.ActionTypes.Tap,
    context_module: Schema.ContextModules.ArtworkExtraLinks,
  })
  handleConsignmentsTap() {
    SwitchBoard.presentNavigationViewController(this, Router.ConsignmentsStartSubmission)
  }

  renderFAQAndSpecialist = () => {
    const {
      artwork: { isAcquireable, isOfferable, isInAuction, sale, isForSale },
      auctionState,
    } = this.props

    if (isInAuction && sale && isForSale && auctionState !== AuctionTimerState.CLOSED) {
      return (
        <>
          <Sans size="2" color="black60">
            By placing a bid you agree to Artsy's{" "}
            <Text style={{ textDecorationLine: "underline" }} onPress={() => this.handleConditionsOfSaleTap()}>
              Conditions of Sale
            </Text>
            .
          </Sans>
          <Spacer mb={1} />
          <Sans size="2" color="black60">
            Have a question?{" "}
            <Text style={{ textDecorationLine: "underline" }} onPress={() => this.handleReadOurAuctionFAQsTap()}>
              Read our auction FAQs
            </Text>{" "}
            or{" "}
            <Text
              style={{ textDecorationLine: "underline" }}
              onPress={() => this.handleAskASpecialistTap("specialist@artsy.net")}
            >
              ask a specialist
            </Text>
            .
          </Sans>
        </>
      )
    } else if (isAcquireable || isOfferable) {
      return (
        <Sans size="2" color="black60">
          Have a question?{" "}
          <Text style={{ textDecorationLine: "underline" }} onPress={() => this.handleReadOurFAQTap()}>
            Read our FAQ
          </Text>{" "}
          or{" "}
          <Text
            style={{ textDecorationLine: "underline" }}
            onPress={() => this.handleAskASpecialistTap("orders@artsy.net")}
          >
            ask a specialist
          </Text>
          .
        </Sans>
      )
    } else {
      return null
    }
  }

  render() {
    const {
      artwork: { artists },
    } = this.props
    const consignableArtistsCount = artists.filter(artist => artist.isConsignable).length
    const artistName = artists && artists.length === 1 ? artists[0].name : null

    return (
      <>
        {this.renderFAQAndSpecialist()}
        {!!consignableArtistsCount && (
          <Sans size="2" color="black60">
            Want to sell a work by {consignableArtistsCount === 1 ? artistName : "these artists"}?{" "}
            <Text style={{ textDecorationLine: "underline" }} onPress={() => this.handleConsignmentsTap()}>
              Consign with Artsy
            </Text>
            .
          </Sans>
        )}
      </>
    )
  }
}

export const ArtworkExtraLinksFragmentContainer = createFragmentContainer(ArtworkExtraLinks, {
  artwork: graphql`
    fragment ArtworkExtraLinks_artwork on Artwork {
      isAcquireable
      isInAuction
      isOfferable
      title
      isForSale
      sale {
        isClosed
      }
      artists {
        isConsignable
        name
      }
      artist {
        name
      }
    }
  `,
})
