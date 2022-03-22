import { ArtworkTombstone_artwork } from "__generated__/ArtworkTombstone_artwork.graphql"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { navigate } from "app/navigation/navigate"
import { Schema, track } from "app/utils/track"
import { Box, Flex, Sans, Spacer } from "palette"
import { Text, TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { FollowArtistLinkFragmentContainer as FollowArtistLink } from "./FollowArtistLink"

type Artist = NonNullable<NonNullable<ArtworkTombstone_artwork["artists"]>[0]>

export interface ArtworkTombstoneProps {
  artwork: ArtworkTombstone_artwork
}

export interface ArtworkTombstoneState {
  showingMoreArtists: boolean
}

@track()
export class ArtworkTombstone extends React.Component<
  ArtworkTombstoneProps,
  ArtworkTombstoneState
> {
  state = {
    showingMoreArtists: false,
  }

  @track(() => ({
    action_name: Schema.ActionNames.ArtistName,
    action_type: Schema.ActionTypes.Tap,
    context_module: Schema.ContextModules.ArtworkTombstone,
  }))
  handleArtistTap(href: string) {
    navigate(href)
  }

  @track(() => ({
    action_name: Schema.ActionNames.ArtworkClassification,
    action_type: Schema.ActionTypes.Tap,
    context_module: Schema.ContextModules.ArtworkTombstone,
  }))
  handleClassificationTap(href: string) {
    navigate(href)
  }

  showAttributionClassFAQ() {
    navigate("/artwork-classifications")
  }

  showMoreArtists = () => {
    this.setState({
      showingMoreArtists: !this.state.showingMoreArtists,
    })
  }

  renderSingleArtist(artist: Artist) {
    return (
      <Text>
        {this.renderArtistName(
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          artist.name,
          artist.href
        )}
        <Sans size="4t" weight="medium">
          {"  "}·{"  "}
        </Sans>
        <FollowArtistLink artist={artist} contextModule={Schema.ContextModules.ArtworkTombstone} />
      </Text>
    )
  }

  renderArtistName(artistName: string, href: string) {
    return href ? (
      <TouchableWithoutFeedback onPress={this.handleArtistTap.bind(this, href)}>
        <Sans size="4t" weight="medium">
          {artistName}
        </Sans>
      </TouchableWithoutFeedback>
    ) : (
      <Sans size="4t" weight="medium">
        {artistName}
      </Sans>
    )
  }

  renderMultipleArtists = () => {
    const {
      artwork: { artists },
    } = this.props

    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const truncatedArtists = !this.state.showingMoreArtists ? artists.slice(0, 3) : artists
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const artistNames = truncatedArtists.map((artist, index) => {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      const artistNameWithComma = index !== artists.length - 1 ? artist.name + ", " : artist.name
      return (
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        <React.Fragment key={artist.href}>
          {/* @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏 */}
          {this.renderArtistName(artistNameWithComma, artist.href)}
        </React.Fragment>
      )
    })

    return (
      <Flex flexDirection="row" flexWrap="wrap">
        <Sans size="4t">
          {artistNames}
          {!this.state.showingMoreArtists && artists! /* STRICTNESS_MIGRATION */.length > 3 && (
            <TouchableWithoutFeedback onPress={this.showMoreArtists}>
              <Sans size="4t" weight="medium">
                {artists! /* STRICTNESS_MIGRATION */.length - 3} more
              </Sans>
            </TouchableWithoutFeedback>
          )}
        </Sans>
      </Flex>
    )
  }

  render() {
    const { artwork } = this.props
    const addedComma = artwork.date ? ", " : ""
    const displayAuctionLotLabel =
      artwork.isInAuction &&
      artwork.saleArtwork &&
      artwork.saleArtwork.lotLabel &&
      artwork.sale &&
      !artwork.sale.isClosed

    return (
      <Box textAlign="left">
        <Flex flexDirection="row" flexWrap="wrap">
          {artwork.artists! /* STRICTNESS_MIGRATION */.length === 1
            ? this.renderSingleArtist(
                // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                artwork.artists[0]
              )
            : this.renderMultipleArtists()}
          {!!(artwork.artists! /* STRICTNESS_MIGRATION */.length === 0 && artwork.cultural_maker) &&
            // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            this.renderArtistName(artwork.cultural_maker, null)}
        </Flex>
        <Spacer mb={1} />
        {!!displayAuctionLotLabel && (
          <Sans color="black100" size="3" weight="medium">
            Lot {artwork.saleArtwork.lotLabel}
          </Sans>
        )}
        <Flex flexDirection="row" flexWrap="wrap">
          <Sans size="3">
            <Sans color="black60" size="3">
              {artwork.title + addedComma}
            </Sans>
            {!!artwork.date && (
              <Sans color="black60" size="3">
                {artwork.date}
              </Sans>
            )}
          </Sans>
        </Flex>
        {!!artwork.medium && (
          <Sans color="black60" size="3">
            {artwork.medium}
          </Sans>
        )}
        {!!artwork.dimensions! /* STRICTNESS_MIGRATION */.in &&
          !!artwork.dimensions! /* STRICTNESS_MIGRATION */.cm && (
            <Sans color="black60" size="3">
              {LegacyNativeModules.ARCocoaConstantsModule.CurrentLocale === "en_US"
                ? artwork.dimensions! /* STRICTNESS_MIGRATION */.in
                : artwork.dimensions! /* STRICTNESS_MIGRATION */.cm}
            </Sans>
          )}
        {!!artwork.edition_of && (
          <Sans color="black60" size="3">
            {artwork.edition_of}
          </Sans>
        )}
        {!!artwork.attribution_class && (
          <Sans color="black60" size="3" mt={1}>
            <TouchableWithoutFeedback
              onPress={() => this.handleClassificationTap("/artwork-classifications")}
            >
              <Text style={{ textDecorationLine: "underline" }}>
                {artwork.attribution_class.shortDescription}
              </Text>
            </TouchableWithoutFeedback>
            .
          </Sans>
        )}
        {!!artwork.isInAuction && !!artwork.sale && !artwork.sale.isClosed && (
          <>
            <Spacer mb={1} />
            {!!artwork.partner && (
              <Sans color="black100" size="3" weight="medium">
                {artwork.partner.name}
              </Sans>
            )}
            {!!artwork.saleArtwork && !!artwork.saleArtwork.estimate && (
              <Sans size="3" color="black60">
                Estimated value: {artwork.saleArtwork.estimate}
              </Sans>
            )}
          </>
        )}
      </Box>
    )
  }
}

export const ArtworkTombstoneFragmentContainer = createFragmentContainer(ArtworkTombstone, {
  artwork: graphql`
    fragment ArtworkTombstone_artwork on Artwork {
      title
      isInAuction
      medium
      date
      cultural_maker: culturalMaker
      saleArtwork {
        lotLabel
        estimate
      }
      partner {
        name
      }
      sale {
        isClosed
      }
      artists {
        name
        href
        ...FollowArtistLink_artist
      }
      dimensions {
        in
        cm
      }
      edition_of: editionOf
      attribution_class: attributionClass {
        shortDescription
      }
    }
  `,
})
