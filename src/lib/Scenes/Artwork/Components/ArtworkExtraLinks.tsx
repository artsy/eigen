import { Sans } from "@artsy/palette"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Router } from "lib/utils/router"
import { Schema, track } from "lib/utils/track"
import React from "react"
import { Text } from "react-native"

interface ArtworkExtraLinksProps {
  consignableArtistsCount: number
  artistName: string | null
  isAcquireable: boolean
  isInquireable: boolean
  artworkSlug: string
}

@track()
export class ArtworkExtraLinks extends React.Component<ArtworkExtraLinksProps> {
  handleReadOurFAQTap = () => {
    SwitchBoard.presentNavigationViewController(this, `/buy-now-feature-faq`)
  }

  handleAskASpecialistTap = () => {
    const { artworkSlug } = this.props
    SwitchBoard.presentNavigationViewController(this, `/inquiry/${artworkSlug}`)
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
    const { consignableArtistsCount, artistName, isAcquireable, isInquireable } = this.props

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
