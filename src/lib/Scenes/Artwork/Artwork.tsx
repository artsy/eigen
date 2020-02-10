import { Box, Separator, space, Spacer, Theme } from "@artsy/palette"
import { Artwork_artworkAboveTheFold } from "__generated__/Artwork_artworkAboveTheFold.graphql"
import { ArtworkAboveTheFoldQuery } from "__generated__/ArtworkAboveTheFoldQuery.graphql"
import { ArtworkFullQuery, ArtworkFullQueryResponse } from "__generated__/ArtworkFullQuery.graphql"
import { ArtworkMarkAsRecentlyViewedQuery } from "__generated__/ArtworkMarkAsRecentlyViewedQuery.graphql"
import { RetryErrorBoundary } from "lib/Components/RetryErrorBoundary"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { SafeAreaInsets } from "lib/types/SafeAreaInsets"
import { PlaceholderBox, PlaceholderRaggedText, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Schema, screenTrack } from "lib/utils/track"
import { ProvideScreenDimensions, useScreenDimensions } from "lib/utils/useScreenDimensions"
import React from "react"
import { FlatList, View } from "react-native"
import { RefreshControl } from "react-native"
import { commitMutation, createFragmentContainer, fetchQuery, graphql, QueryRenderer, RelayProp } from "react-relay"
import { AboutArtistFragmentContainer as AboutArtist } from "./Components/AboutArtist"
import { AboutWorkFragmentContainer as AboutWork } from "./Components/AboutWork"
import { ArtworkDetailsFragmentContainer as ArtworkDetails } from "./Components/ArtworkDetails"
import { ArtworkHeaderFragmentContainer as ArtworkHeader } from "./Components/ArtworkHeader"
import { ArtworkHistoryFragmentContainer as ArtworkHistory } from "./Components/ArtworkHistory"
import { CommercialInformationFragmentContainer as CommercialInformation } from "./Components/CommercialInformation"
import { ContextCardFragmentContainer as ContextCard } from "./Components/ContextCard"
import { OtherWorksFragmentContainer as OtherWorks, populatedGrids } from "./Components/OtherWorks/OtherWorks"
import { PartnerCardFragmentContainer as PartnerCard } from "./Components/PartnerCard"

interface Props {
  artworkAboveTheFold: Artwork_artworkAboveTheFold
  isVisible: boolean
  relay: RelayProp
}

interface State {
  refreshing: boolean
  artworkFull: ArtworkFullQueryResponse["artwork"] | null
}

@screenTrack<Props>(props => ({
  context_screen: Schema.PageNames.ArtworkPage,
  context_screen_owner_type: Schema.OwnerEntityTypes.Artwork,
  context_screen_owner_slug: props.artworkAboveTheFold.slug,
  context_screen_owner_id: props.artworkAboveTheFold.internalID,
  availability: props.artworkAboveTheFold.availability,
  acquireable: props.artworkAboveTheFold.is_acquireable,
  inquireable: props.artworkAboveTheFold.is_inquireable,
  offerable: props.artworkAboveTheFold.is_offerable,
  biddable: props.artworkAboveTheFold.is_biddable,
}))
export class Artwork extends React.Component<Props, State> {
  state = {
    refreshing: false,
    artworkFull: null,
  }

  shouldRenderDetails = () => {
    const {
      category,
      conditionDescription,
      signature,
      signatureInfo,
      certificateOfAuthenticity,
      framed,
      series,
      publisher,
      manufacturer,
      image_rights,
    } = this.state.artworkFull
    if (
      category ||
      conditionDescription ||
      signature ||
      signatureInfo ||
      certificateOfAuthenticity ||
      framed ||
      series ||
      publisher ||
      manufacturer ||
      image_rights
    ) {
      return true
    } else {
      return false
    }
  }

  componentDidMount() {
    this.markArtworkAsRecentlyViewed()
    this.getFullArtwork()
  }

  componentDidUpdate(prevProps) {
    // If we are visible, but weren't, then we are re-appearing (not called on first render).
    if (this.props.isVisible && !prevProps.isVisible) {
      this.forceRefetch()
      this.markArtworkAsRecentlyViewed()
    }
  }

  shouldRenderPartner = () => {
    const { partner, sale } = this.state.artworkFull
    if ((sale && sale.isBenefit) || (sale && sale.isGalleryAuction)) {
      return false
    } else if (partner && partner.type && partner.type !== "Auction House") {
      return true
    } else {
      return false
    }
  }

  shouldRenderOtherWorks = () => {
    const { contextGrids } = this.state.artworkFull
    const gridsToShow = populatedGrids(contextGrids)

    if (gridsToShow && gridsToShow.length > 0) {
      return true
    } else {
      return false
    }
  }

  onRefresh = () => {
    if (this.state.refreshing) {
      return
    }

    this.setState({ refreshing: true })
    this.forceRefetch(() => this.setState({ refreshing: false }))
  }

  markArtworkAsRecentlyViewed = () => {
    commitMutation<ArtworkMarkAsRecentlyViewedQuery>(this.props.relay.environment, {
      mutation: graphql`
        mutation ArtworkMarkAsRecentlyViewedQuery($input: RecordArtworkViewInput!) {
          recordArtworkView(input: $input) {
            artworkId
          }
        }
      `,
      variables: {
        input: {
          artwork_id: this.props.artworkAboveTheFold.slug,
        },
      },
    })
  }

  forceRefetch = async (onComplete?: () => void) => {
    await this.getFullArtwork()
    onComplete()
  }

  sections = () => {
    const { artworkFull } = this.state

    const sections = []

    sections.push("header")
    sections.push("commercialInformation")

    if (!artworkFull) {
      return sections
    }

    const { artist, context } = artworkFull
    if (artworkFull.description || artworkFull.additional_information) {
      sections.push("aboutWork")
    }

    if (this.shouldRenderDetails()) {
      sections.push("details")
    }

    if (artworkFull.provenance || artworkFull.exhibition_history || artworkFull.literature) {
      sections.push("history")
    }

    if (artist && artist.biography_blurb) {
      sections.push("aboutArtist")
    }

    if (this.shouldRenderPartner()) {
      sections.push("partnerCard")
    }

    if (context && context.__typename === "Sale" && context.isAuction) {
      sections.push("contextCard")
    }

    if (this.shouldRenderOtherWorks()) {
      sections.push("otherWorks")
    }

    return sections
  }

  renderItem = ({ item: section }) => {
    const { artworkAboveTheFold } = this.props
    const { artworkFull } = this.state
    switch (section) {
      case "header":
        return <ArtworkHeader artwork={artworkFull || artworkAboveTheFold} />
      case "commercialInformation":
        return <CommercialInformation artwork={artworkFull || artworkAboveTheFold} />
      case "aboutWork":
        return <AboutWork artwork={artworkFull} />
      case "details":
        return <ArtworkDetails artwork={artworkFull} />
      case "history":
        return <ArtworkHistory artwork={artworkFull} />
      case "aboutArtist":
        return <AboutArtist artwork={artworkFull} />
      case "partnerCard":
        return <PartnerCard artwork={artworkFull} />
      case "contextCard":
        return <ContextCard artwork={artworkFull} />
      case "otherWorks":
        return <OtherWorks artwork={artworkFull} />
      default:
        return null
    }
  }

  async getFullArtwork() {
    const result = await fetchQuery<ArtworkFullQuery>(
      this.props.relay.environment,
      graphql`
        query ArtworkFullQuery($artworkID: String!) {
          artwork(id: $artworkID) {
            additional_information: additionalInformation
            description
            provenance
            exhibition_history: exhibitionHistory
            literature
            partner {
              type
              id
            }
            artist {
              biography_blurb: biographyBlurb {
                text
              }
            }
            sale {
              id
              isBenefit
              isGalleryAuction
            }
            category
            conditionDescription {
              details
            }
            signature
            signatureInfo {
              details
            }
            certificateOfAuthenticity {
              details
            }
            framed {
              details
            }
            series
            publisher
            manufacturer
            image_rights: imageRights
            context {
              __typename
              ... on Sale {
                isAuction
              }
            }
            contextGrids {
              artworks: artworksConnection(first: 6) {
                edges {
                  node {
                    id
                  }
                }
              }
            }
            ...PartnerCard_artwork
            ...AboutWork_artwork
            ...OtherWorks_artwork
            ...AboutArtist_artwork
            ...ArtworkDetails_artwork
            ...ContextCard_artwork
            ...ArtworkHistory_artwork

            # this should be duplicated from Artwork_aboveTheFold
            ...ArtworkHeader_artwork
            ...CommercialInformation_artwork
            slug
            internalID
            id
            is_acquireable: isAcquireable
            is_offerable: isOfferable
            is_biddable: isBiddable
            is_inquireable: isInquireable
            availability
          }
        }
      `,
      { artworkID: this.props.artworkAboveTheFold.internalID },
      { force: true }
    )

    this.setState({ artworkFull: result.artwork })
  }

  render() {
    return (
      <FlatList
        data={this.sections()}
        ItemSeparatorComponent={() => (
          <Box px={2} mx={2} my={3}>
            <Separator />
          </Box>
        )}
        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
        contentInset={{ bottom: 40 }}
        keyExtractor={(item, index) => item.type + String(index)}
        renderItem={item =>
          item.item === "header" ? this.renderItem(item) : <Box px={2}>{this.renderItem(item)}</Box>
        }
      />
    )
  }
}

export const ArtworkContainer = createFragmentContainer(Artwork, {
  artworkAboveTheFold: graphql`
    fragment Artwork_artworkAboveTheFold on Artwork {
      ...ArtworkHeader_artwork
      ...CommercialInformation_artwork
      slug
      internalID
      id
      is_acquireable: isAcquireable
      is_offerable: isOfferable
      is_biddable: isBiddable
      is_inquireable: isInquireable
      availability
    }
  `,
})

export const ArtworkRenderer: React.SFC<{ artworkID: string; safeAreaInsets: SafeAreaInsets; isVisible: boolean }> = ({
  artworkID,
  ...others
}) => {
  return (
    <RetryErrorBoundary
      render={({ isRetry }) => {
        return (
          <Theme>
            <ProvideScreenDimensions>
              <QueryRenderer<ArtworkAboveTheFoldQuery>
                environment={defaultEnvironment}
                query={graphql`
                  query ArtworkAboveTheFoldQuery($artworkID: String!) {
                    artworkAboveTheFold: artwork(id: $artworkID) {
                      ...Artwork_artworkAboveTheFold
                    }
                  }
                `}
                variables={{ artworkID }}
                cacheConfig={{
                  // Bypass Relay cache on retries.
                  ...(isRetry && { force: true }),
                }}
                render={renderWithPlaceholder({
                  Container: ArtworkContainer,
                  initialProps: others,
                  renderPlaceholder: () => <AboveTheFoldPlaceholder />,
                })}
              />
            </ProvideScreenDimensions>
          </Theme>
        )
      }}
    />
  )
}

const AboveTheFoldPlaceholder: React.FC<{}> = ({}) => {
  const screenDimensions = useScreenDimensions()
  // The logic for artworkHeight comes from the zeplin spec https://zpl.io/25JLX0Q
  const artworkHeight = screenDimensions.width >= 375 ? 340 : 290

  return (
    <View style={{ flex: 1, padding: space(2) }}>
      {/* Artwork thumbnail */}
      <PlaceholderBox height={artworkHeight} />
      <Spacer mb={2} />
      {/* save/share buttons */}
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <PlaceholderText width={50} marginHorizontal={space(1)} />
        <PlaceholderText width={50} marginHorizontal={space(1)} />
        <PlaceholderText width={50} marginHorizontal={space(1)} />
      </View>
      <Spacer mb={2} />
      {/* Artist name */}
      <PlaceholderText width={100} />
      <Spacer mb={2} />
      {/* Artwork tombstone details */}
      <View style={{ width: 130 }}>
        <PlaceholderRaggedText numLines={4} />
      </View>
      <Spacer mb={3} />
      {/* more junk */}
      <Separator />
      <Spacer mb={3} />
      <PlaceholderRaggedText numLines={3} />
      <Spacer mb={2} />
      {/* commerce button */}
      <PlaceholderBox height={60} />
    </View>
  )
}
