import { ArtworkExtraLinks_artwork } from "__generated__/ArtworkExtraLinks_artwork.graphql"
import { AuctionTimerState } from "lib/Components/Bidding/Components/Timer"
import { navigate } from "lib/navigation/navigate"
import { partnerName } from "lib/Scenes/Artwork/Components/ArtworkExtraLinks/partnerName"
import { useSelectedTab } from "lib/store/GlobalStore"
import { sendEmail } from "lib/utils/sendEmail"
import { Schema, track } from "lib/utils/track"
import { Sans, Spacer } from "palette"
import React from "react"
import { Text, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

export interface ArtworkExtraLinksProps {
  artwork: ArtworkExtraLinks_artwork
  auctionState: AuctionTimerState
}

@track()
export class ArtworkExtraLinks extends React.Component<ArtworkExtraLinksProps> {
  handleReadOurFAQTap = () => {
    navigate(`/buy-now-feature-faq`)
  }

  @track({
    action_name: Schema.ActionNames.AskASpecialist,
    action_type: Schema.ActionTypes.Tap,
    context_module: Schema.ContextModules.ArtworkExtraLinks,
  })
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  handleAskASpecialistTap(emailAddress) {
    const { artwork } = this.props
    const mailtoSubject = `Inquiry on ${artwork.title}`.concat(
      artwork.artist && artwork.artist.name ? ` by ${artwork.artist.name}` : ""
    )
    sendEmail(emailAddress, { subject: mailtoSubject })
  }

  @track({
    action_name: Schema.ActionNames.AuctionsFAQ,
    action_type: Schema.ActionTypes.Tap,
    context_module: Schema.ContextModules.ArtworkExtraLinks,
  })
  handleReadOurAuctionFAQsTap() {
    navigate(`/auction-faq`)
    return
  }

  @track({
    action_name: Schema.ActionNames.ConditionsOfSale,
    action_type: Schema.ActionTypes.Tap,
    context_module: Schema.ContextModules.ArtworkExtraLinks,
  })
  handleConditionsOfSaleTap() {
    navigate(`/conditions-of-sale`)
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
            By placing a bid you agree to {partnerName(sale)}{" "}
            <Text
              style={{ textDecorationLine: "underline" }}
              onPress={() => this.handleConditionsOfSaleTap()}
            >
              Conditions of Sale
            </Text>
            .
          </Sans>
          <Spacer mb={1} />
          <Sans size="2" color="black60">
            Have a question?{" "}
            <Text
              style={{ textDecorationLine: "underline" }}
              onPress={() => this.handleReadOurAuctionFAQsTap()}
            >
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
          <Text
            style={{ textDecorationLine: "underline" }}
            onPress={() => this.handleReadOurFAQTap()}
          >
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
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const consignableArtistsCount = artists.filter((artist) => artist.isConsignable).length
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const artistName = artists && artists.length === 1 ? artists[0].name : null

    return (
      <>
        {this.renderFAQAndSpecialist()}
        {!!consignableArtistsCount && (
          <ConsignmentsLink
            artistName={consignableArtistsCount > 1 ? "these artists" : artistName ?? "this artist"}
          />
        )}
      </>
    )
  }
}

const ConsignmentsLink: React.FC<{ artistName: string }> = ({ artistName }) => {
  const isSellTab = useSelectedTab() === "sell"
  const tracking = useTracking()

  return (
    <View>
      <Sans size="2" color="black60">
        Want to sell a work by {artistName}?{" "}
        <Text
          style={{ textDecorationLine: "underline" }}
          onPress={() => {
            tracking.trackEvent({
              action_name: Schema.ActionNames.ConsignWithArtsy,
              action_type: Schema.ActionTypes.Tap,
              context_module: Schema.ContextModules.ArtworkExtraLinks,
            })
            navigate(isSellTab ? "/collections/my-collection/marketing-landing" : "/sales")
          }}
        >
          Consign with Artsy
        </Text>
        .
      </Sans>
    </View>
  )
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
        isBenefit
        partner {
          name
        }
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
