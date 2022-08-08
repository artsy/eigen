import { ArtworkTombstone_artwork$data } from "__generated__/ArtworkTombstone_artwork.graphql"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { navigate } from "app/navigation/navigate"
import { Schema, track } from "app/utils/track"
import { ArtworkIcon, Box, CertificateIcon, comma, Flex, Spacer, Text } from "palette"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { CascadingEndTimesBanner } from "./CascadingEndTimesBanner"
import { CertificateAuthenticityModal } from "./CertificateAuthenticityModal"
import { FollowArtistLinkFragmentContainer as FollowArtistLink } from "./FollowArtistLink"

type Artist = NonNullable<NonNullable<ArtworkTombstone_artwork$data["artists"]>[0]>

export interface ArtworkTombstoneProps {
  artwork: ArtworkTombstone_artwork$data
}

export interface ArtworkTombstoneState {
  showingMoreArtists: boolean
  showAuthenticityCertificateModal: boolean
}

@track()
export class ArtworkTombstone extends React.Component<
  ArtworkTombstoneProps,
  ArtworkTombstoneState
> {
  state = {
    showingMoreArtists: false,
    showAuthenticityCertificateModal: false,
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
      ...this.state,
      showingMoreArtists: !this.state.showingMoreArtists,
    })
  }

  renderSingleArtist(artist: Artist) {
    return (
      <Text>
        {this.renderArtistName(artist.name!, artist.href)}
        <Text variant="md" weight="medium">
          {"  "}·{"  "}
        </Text>
        <FollowArtistLink artist={artist} contextModule={Schema.ContextModules.ArtworkTombstone} />
      </Text>
    )
  }

  renderArtistName(artistName: string, href: string | null) {
    return href ? (
      <TouchableWithoutFeedback onPress={this.handleArtistTap.bind(this, href)}>
        <Text variant="md" weight="medium">
          {artistName}
        </Text>
      </TouchableWithoutFeedback>
    ) : (
      <Text variant="md" weight="medium">
        {artistName}
      </Text>
    )
  }

  renderMultipleArtists = () => {
    const artists = this.props.artwork.artists ?? []
    const truncatedArtists = !this.state.showingMoreArtists ? artists.slice(0, 3) : artists
    const artistNames = truncatedArtists.map((artist, index) => {
      const artistNameWithComma = index !== artists.length - 1 ? artist!.name + ", " : artist!.name!
      return (
        <React.Fragment key={artist!.href}>
          {this.renderArtistName(artistNameWithComma, artist!.href)}
        </React.Fragment>
      )
    })

    return (
      <Flex flexDirection="row" flexWrap="wrap">
        <Text variant="md">
          {artistNames}
          {!this.state.showingMoreArtists && artists! /* STRICTNESS_MIGRATION */.length > 3 && (
            <TouchableWithoutFeedback onPress={this.showMoreArtists}>
              <Text variant="md" weight="medium">
                {artists! /* STRICTNESS_MIGRATION */.length - 3} more
              </Text>
            </TouchableWithoutFeedback>
          )}
        </Text>
      </Flex>
    )
  }

  getArtworkTitleAndMaybeDate = () => {
    const { artwork } = this.props

    if (artwork.date) {
      return `${artwork.title!}${comma} ${artwork.date}`
    }

    return artwork.title!
  }

  render() {
    const { artwork } = this.props
    const displayAuctionLotLabel =
      artwork.isInAuction &&
      artwork.saleArtwork &&
      artwork.saleArtwork.lotLabel &&
      artwork.sale &&
      !artwork.sale.isClosed
    const attributionClass = artwork.attributionClass

    return (
      <Box textAlign="left">
        <Flex flexDirection="row" flexWrap="wrap">
          {artwork.artists! /* STRICTNESS_MIGRATION */.length === 1
            ? this.renderSingleArtist(artwork!.artists![0]!)
            : this.renderMultipleArtists()}
          {!!(artwork.artists! /* STRICTNESS_MIGRATION */.length === 0 && artwork.cultural_maker) &&
            this.renderArtistName(artwork.cultural_maker, null)}
        </Flex>
        <Spacer mb={1} />
        {!!displayAuctionLotLabel && (
          <Text variant="sm" color="black100" weight="medium">
            Lot {artwork.saleArtwork.lotLabel}
          </Text>
        )}
        <Flex flexDirection="row" flexWrap="wrap">
          <Text variant="sm" color="black60">
            {this.getArtworkTitleAndMaybeDate()}
          </Text>
        </Flex>
        {!!artwork.medium && (
          <Text variant="sm" color="black60">
            {artwork.medium}
          </Text>
        )}
        {!!artwork.dimensions! /* STRICTNESS_MIGRATION */.in &&
          !!artwork.dimensions! /* STRICTNESS_MIGRATION */.cm && (
            <Text variant="sm" color="black60">
              {LegacyNativeModules.ARCocoaConstantsModule.CurrentLocale === "en_US"
                ? artwork.dimensions! /* STRICTNESS_MIGRATION */.in
                : artwork.dimensions! /* STRICTNESS_MIGRATION */.cm}
            </Text>
          )}
        {!!artwork.edition_of && (
          <Text variant="sm" color="black60">
            {artwork.edition_of}
          </Text>
        )}
        <Spacer my={1} />
        {!!attributionClass?.shortArrayDescription &&
          !!Array.isArray(attributionClass.shortArrayDescription) &&
          attributionClass.shortArrayDescription.length > 0 && (
            <Box mt={0.5} flexDirection="row">
              <ArtworkIcon fill="black60" />
              <Text color="black60" variant="xs" ml={1}>
                {attributionClass.shortArrayDescription
                  .slice(0, attributionClass.shortArrayDescription.length - 1)
                  .join(" ") + " "}
                <TouchableWithoutFeedback
                  onPress={() => this.handleClassificationTap("/artwork-classifications")}
                >
                  <Text variant="xs" style={{ textDecorationLine: "underline" }}>
                    {
                      attributionClass.shortArrayDescription[
                        attributionClass.shortArrayDescription.length - 1
                      ]
                    }
                  </Text>
                </TouchableWithoutFeedback>
                .
              </Text>
            </Box>
          )}
        {!!artwork.certificateOfAuthenticity && (
          <Box mt={0.5} flexDirection="row">
            <CertificateIcon fill="black60" />
            <Text color="black60" variant="xs" ml={1}>
              This work includes a{" "}
              <TouchableWithoutFeedback
                onPress={() =>
                  this.setState({ ...this.setState, showAuthenticityCertificateModal: true })
                }
              >
                <Text variant="xs" style={{ textDecorationLine: "underline" }}>
                  {"Certificate of Authenticity"}
                </Text>
              </TouchableWithoutFeedback>
              .
            </Text>
          </Box>
        )}
        {!!artwork.isInAuction && !artwork.sale?.isClosed && (
          <>
            {!!artwork.sale?.cascadingEndTimeIntervalMinutes && (
              <Flex my={2} mx={-2}>
                <CascadingEndTimesBanner
                  cascadingEndTimeInterval={artwork.sale.cascadingEndTimeIntervalMinutes}
                  extendedBiddingIntervalMinutes={artwork.sale.extendedBiddingIntervalMinutes}
                />
              </Flex>
            )}
            <Spacer mb={1} />
            {!!artwork.partner && (
              <Text variant="sm" color="black100" weight="medium">
                {artwork.partner.name}
              </Text>
            )}
            {!!artwork.saleArtwork && !!artwork.saleArtwork.estimate && (
              <Text variant="sm" color="black60">
                Estimated value: {artwork.saleArtwork.estimate}
              </Text>
            )}
          </>
        )}
        <CertificateAuthenticityModal
          visible={this.state.showAuthenticityCertificateModal}
          onClose={() => this.setState({ ...this.state, showAuthenticityCertificateModal: false })}
        />
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
      certificateOfAuthenticity {
        label
        __typename
      }
      sale {
        isClosed
        cascadingEndTimeIntervalMinutes
        extendedBiddingIntervalMinutes
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
      attributionClass {
        shortArrayDescription
      }
    }
  `,
})
