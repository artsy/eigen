import { Box, color, Flex, Sans, Serif } from "@artsy/palette"
import { ArtworkTombstone_artwork } from "__generated__/ArtworkTombstone_artwork.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { NativeModules, TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

const Constants = NativeModules.ARCocoaConstantsModule

type Artist = ArtworkTombstone_artwork["artists"][0]

export interface ArtworkTombstoneProps {
  artwork: ArtworkTombstone_artwork
}

export interface ArtworkTombstoneState {
  showingMoreArtists: boolean
}

export class ArtworkTombstone extends React.Component<ArtworkTombstoneProps, ArtworkTombstoneState> {
  state = {
    showingMoreArtists: false,
  }
  handleTap(href) {
    SwitchBoard.presentNavigationViewController(this, href)
  }

  showMoreArtists = () => {
    this.setState({
      showingMoreArtists: !this.state.showingMoreArtists,
    })
  }

  renderSingleArtist(artist: Artist) {
    return (
      <React.Fragment>
        <Flex flexDirection="row">
          {this.renderArtistName(artist.name, artist.href)}
          <Sans color={color("black60")} size="6" mx={1}>
            &middot;
          </Sans>
          <Sans color={color("black60")} size="4">
            Follow
          </Sans>
        </Flex>
      </React.Fragment>
    )
  }

  renderArtistName(artistName, href) {
    return href ? (
      <>
        <TouchableWithoutFeedback onPress={this.handleTap.bind(this, href)}>
          <Serif size="5t" weight="semibold">
            {artistName}
          </Serif>
        </TouchableWithoutFeedback>
      </>
    ) : (
      <>
        <Serif size="5t" weight="semibold">
          {artistName}
        </Serif>
      </>
    )
  }

  renderMultipleArtists = () => {
    const {
      artwork: { artists },
    } = this.props
    return artists.map((artist, index) => {
      const isHidden = index > 2 && !this.state.showingMoreArtists
      const artistNameWithComma = index !== artists.length - 1 ? artist.name + ", " : artist.name
      return (
        <React.Fragment key={artist.__id}>
          {!isHidden && <>{this.renderArtistName(artistNameWithComma, artist.href)}</>}
        </React.Fragment>
      )
    })
  }

  renderTruncatedArtists = () => {
    const {
      artwork: { artists },
    } = this.props
    return (
      <Flex flexDirection="row" flexWrap="wrap">
        {this.renderMultipleArtists()}
        {!this.state.showingMoreArtists &&
          artists.length > 3 && (
            <TouchableWithoutFeedback onPress={this.showMoreArtists}>
              <Serif size="5t" weight="semibold">
                {artists.length - 3} more
              </Serif>
            </TouchableWithoutFeedback>
          )}
      </Flex>
    )
  }

  renderCulturalMaker(culturalMaker: string) {
    return (
      <Serif size="5t" weight="semibold">
        {culturalMaker}
      </Serif>
    )
  }

  render() {
    const { artwork } = this.props
    return (
      <Box textAlign="left">
        <Flex flexDirection="row" flexWrap="wrap">
          {artwork.artists.length === 1 ? this.renderSingleArtist(artwork.artists[0]) : this.renderTruncatedArtists()}
          {artwork.artists.length === 0 && artwork.cultural_maker && this.renderCulturalMaker(artwork.cultural_maker)}
        </Flex>
        <Serif color={color("black60")} size="3" m="0" p="0">
          {artwork.title}, {artwork.date}
        </Serif>
        <Serif color={color("black60")} size="3">
          {artwork.medium}
        </Serif>
        <Serif color={color("black60")} size="3">
          {Constants.CurrentLocale === "en_US" ? artwork.dimensions.in : artwork.dimensions.cm}
        </Serif>
        {artwork.edition_of && (
          <Serif color={color("black60")} size="3">
            {artwork.edition_of}
          </Serif>
        )}
        {artwork.attribution_class && (
          <Serif color={color("black60")} size="3">
            {artwork.attribution_class.short_description}
          </Serif>
        )}
      </Box>
    )
  }
}

export const ArtworkTombstoneFragmentContainer = createFragmentContainer(ArtworkTombstone, {
  artwork: graphql`
    fragment ArtworkTombstone_artwork on Artwork {
      title
      medium
      date
      cultural_maker
      artists {
        __id
        name
        href
      }
      dimensions {
        in
        cm
      }
      edition_of
      attribution_class {
        short_description
      }
    }
  `,
})
