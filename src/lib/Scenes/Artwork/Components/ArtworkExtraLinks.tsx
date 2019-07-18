import { Box, Sans } from "@artsy/palette"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Router } from "lib/utils/router"
import React from "react"
import { Text } from "react-native"

interface ArtworkExtraLinksProps {
  consignableArtistsCount: number
}

export class ArtworkExtraLinks extends React.Component<ArtworkExtraLinksProps> {
  handleTap(href: string) {
    SwitchBoard.presentNavigationViewController(this, href)
  }

  handleConsignmentsTap() {
    SwitchBoard.presentNavigationViewController(this, Router.ConsignmentsStartSubmission)
  }

  renderConsignmentsLine(artistsCount) {
    return (
      <Sans size="3t" color="black60">
        Want to sell a work by {artistsCount === 1 ? "this artist" : "these artists"}?{" "}
        <Text style={{ textDecorationLine: "underline" }} onPress={() => this.handleConsignmentsTap()}>
          Consign with Artsy.
        </Text>
      </Sans>
    )
  }

  render() {
    const { consignableArtistsCount } = this.props

    return <Box>{!!consignableArtistsCount && this.renderConsignmentsLine(consignableArtistsCount)}</Box>
  }
}
