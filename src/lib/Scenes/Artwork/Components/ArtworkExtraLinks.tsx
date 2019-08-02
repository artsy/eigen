import { Sans } from "@artsy/palette"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Router } from "lib/utils/router"
import { Schema, track } from "lib/utils/track"
import React from "react"
import { Text } from "react-native"

interface ArtworkExtraLinksProps {
  consignableArtistsCount: number
  artistName: string | null
}

@track()
export class ArtworkExtraLinks extends React.Component<ArtworkExtraLinksProps> {
  handleTap(href: string) {
    SwitchBoard.presentNavigationViewController(this, href)
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

  renderConsignmentsLine(artistsCount, artistName) {
    return (
      <Sans size="2" color="black60">
        Want to sell a work by {artistsCount === 1 ? artistName : "these artists"}?{" "}
        <Text style={{ textDecorationLine: "underline" }} onPress={() => this.handleConsignmentsTap()}>
          Consign with Artsy.
        </Text>
      </Sans>
    )
  }

  render() {
    const { consignableArtistsCount, artistName } = this.props

    return <>{!!consignableArtistsCount && this.renderConsignmentsLine(consignableArtistsCount, artistName)}</>
  }
}
