import { Sans } from "@artsy/palette"
import { ArtworkExtraLinks_artwork } from "__generated__/ArtworkExtraLinks_artwork.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Router } from "lib/utils/router"
import { Schema, track } from "lib/utils/track"
import React from "react"
import { Text } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

export interface ArtworkExtraLinksProps {
  artwork: ArtworkExtraLinks_artwork
}

@track()
export class ArtworkExtraLinks extends React.Component<ArtworkExtraLinksProps> {
  handleReadOurFAQTap = () => {
    SwitchBoard.presentNavigationViewController(this, `/buy-now-feature-faq`)
  }

  handleAskASpecialistTap = () => {
    const { artwork } = this.props
    SwitchBoard.presentNavigationViewController(this, `/inquiry/${artwork.slug}`)
  }

  @track(() => {
    return {
      action_name: Schema.ActionNames.ConsignWithArtsy,
      action_type: Schema.ActionTypes.Tap,
      context_module: Schema.ContextModules.ArtworkExtraLinks,
    } as any
  })
  handleConsignmentsTap() {
    SwitchBoard.presentNavigationViewController(this, Router.ConsignmentsStartSubmission)
  }

  render() {
    const {
      artwork: { isAcquireable, isInquireable, artists },
    } = this.props
    const consignableArtistsCount = artists.filter(artist => artist.isConsignable).length
    const artistName = artists && artists.length === 1 ? artists[0].name : null

    return (
      <>
        {(isInquireable || isAcquireable) && (
          <Sans size="2" color="black60">
            Have a question?{" "}
            <Text style={{ textDecorationLine: "underline" }} onPress={() => this.handleReadOurFAQTap()}>
              Read our FAQ
            </Text>
            {isAcquireable && (
              <>
                {" "}
                or{" "}
                <Text style={{ textDecorationLine: "underline" }} onPress={() => this.handleAskASpecialistTap()}>
                  ask a specialist
                </Text>
                .
              </>
            )}
          </Sans>
        )}
        {!!consignableArtistsCount && (
          <>
            <Sans size="2" color="black60">
              Want to sell a work by {consignableArtistsCount === 1 ? artistName : "these artists"}?{" "}
              <Text style={{ textDecorationLine: "underline" }} onPress={() => this.handleConsignmentsTap()}>
                Consign with Artsy.
              </Text>
            </Sans>
          </>
        )}
      </>
    )
  }
}

export const ArtworkExtraLinksFragmentContainer = createFragmentContainer(ArtworkExtraLinks, {
  artwork: graphql`
    fragment ArtworkExtraLinks_artwork on Artwork {
      slug
      isAcquireable
      isInquireable
      artists {
        isConsignable
        name
      }
    }
  `,
})
