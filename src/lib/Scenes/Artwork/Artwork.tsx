import { Box, Separator, space, Spacer, Theme } from "@artsy/palette"
import { Artwork_artworkAboveTheFold } from "__generated__/Artwork_artworkAboveTheFold.graphql"
import { ArtworkAboveTheFoldQuery } from "__generated__/ArtworkAboveTheFoldQuery.graphql"
import { ArtworkFullQuery, ArtworkFullQueryResponse } from "__generated__/ArtworkFullQuery.graphql"
import { ArtworkMarkAsRecentlyViewedQuery } from "__generated__/ArtworkMarkAsRecentlyViewedQuery.graphql"
import { RetryErrorBoundary } from "lib/Components/RetryErrorBoundary"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { SafeAreaInsets } from "lib/types/SafeAreaInsets"
import {
  PlaceholderBox,
  PlaceholderRaggedText,
  PlaceholderText,
  ProvidePlaceholderContext,
} from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Schema, screenTrack } from "lib/utils/track"
import { ProvideScreenDimensions, useScreenDimensions } from "lib/utils/useScreenDimensions"
import React from "react"
import { ActivityIndicator, FlatList, View } from "react-native"
import { RefreshControl } from "react-native"
import { Sentry } from "react-native-sentry"
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
    this.loadFullArtwork()
  }

  componentDidUpdate(prevProps) {
    // If we are visible, but weren't, then we are re-appearing (not called on first render).
    if (this.props.isVisible && !prevProps.isVisible) {
      this.loadFullArtwork().then(() => {
        this.markArtworkAsRecentlyViewed()
      })
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

  onRefresh = async () => {
    if (this.state.refreshing) {
      return
    }

    this.setState({ refreshing: true })
    try {
      await this.loadFullArtwork()
    } catch (e) {
      if (__DEV__) {
        console.error(e)
      } else {
        Sentry.captureMessage("failed to refresh artwork", { slug: this.props.artworkAboveTheFold.slug })
      }
    }
    this.setState({ refreshing: false })
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

  sections(): ArtworkPageSection[] {
    const { artworkFull } = this.state
    const { artworkAboveTheFold } = this.props

    const sections: ArtworkPageSection[] = []

    sections.push({
      key: "header",
      element: <ArtworkHeader artwork={artworkAboveTheFold} />,
      excludePadding: true,
    })
    sections.push({
      key: "commercialInformation",
      element: <CommercialInformation artwork={artworkAboveTheFold} />,
    })

    if (!artworkFull) {
      sections.push({
        key: "belowTheFoldPlaceholder",
        element: <BelowTheFoldPlaceholder />,
      })
      return sections
    }

    const { artist, context } = artworkFull

    if (artworkFull.description || artworkFull.additional_information) {
      sections.push({
        key: "aboutWork",
        element: <AboutWork artwork={artworkFull} />,
      })
    }

    if (this.shouldRenderDetails()) {
      sections.push({
        key: "artworkDetails",
        element: <ArtworkDetails artwork={artworkFull} />,
      })
    }

    if (artworkFull.provenance || artworkFull.exhibition_history || artworkFull.literature) {
      sections.push({
        key: "history",
        element: <ArtworkHistory artwork={artworkFull} />,
      })
    }

    if (artist && artist.biography_blurb) {
      sections.push({
        key: "aboutArtist",
        element: <AboutArtist artwork={artworkFull} />,
      })
    }

    if (this.shouldRenderPartner()) {
      sections.push({
        key: "partnerCard",
        element: <PartnerCard artwork={artworkFull} />,
      })
    }

    if (context && context.__typename === "Sale" && context.isAuction) {
      sections.push({
        key: "contextCard",
        element: <ContextCard artwork={artworkFull} />,
      })
    }

    if (this.shouldRenderOtherWorks()) {
      sections.push({
        key: "otherWorks",
        element: <OtherWorks artwork={artworkFull} />,
      })
    }

    return sections
  }

  async loadFullArtwork() {
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

            # DO NOT DELETE this is needed to update the relay cache entries
            # for the above-the-fold content when the user refreshes (which in
            # turn updates the props.artworkAboveTheFold prop)
            ...Artwork_artworkAboveTheFold
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
      <FlatList<ArtworkPageSection>
        data={this.sections()}
        ItemSeparatorComponent={() => (
          <Box px={2} mx={2} my={3}>
            <Separator />
          </Box>
        )}
        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
        contentInset={{ bottom: 40 }}
        renderItem={({ item }) => (item.excludePadding ? item.element : <Box px={2}>{item.element}</Box>)}
      />
    )
  }
}

interface ArtworkPageSection {
  key: string
  element: JSX.Element
  excludePadding?: boolean
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

const BelowTheFoldPlaceholder: React.FC<{}> = ({}) => {
  return (
    <ProvidePlaceholderContext>
      <Separator />
      <Spacer mb={3} />
      {/* About the artwork title */}
      <PlaceholderText width={60} />
      <Spacer mb={2} />
      {/* About the artwork copy */}
      <PlaceholderRaggedText numLines={4} />
      <Spacer mb={3} />
      <Separator />
      <Spacer mb={3} />
      <ActivityIndicator />
      <Spacer mb={3} />
    </ProvidePlaceholderContext>
  )
}
