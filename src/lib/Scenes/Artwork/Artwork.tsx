import { Box, Theme } from "@artsy/palette"
import { Artwork_artwork } from "__generated__/Artwork_artwork.graphql"
import { ArtworkQuery } from "__generated__/ArtworkQuery.graphql"
import { RetryErrorBoundary } from "lib/Components/RetryErrorBoundary"
import Separator from "lib/Components/Separator"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { SafeAreaInsets } from "lib/types/SafeAreaInsets"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Schema, screenTrack } from "lib/utils/track"
import { ProvideScreenDimensions } from "lib/utils/useScreenDimensions"
import React from "react"
import { FlatList } from "react-native"
import { RefreshControl } from "react-native"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
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
  artwork: Artwork_artwork
  isVisible: boolean
  relay: RelayRefetchProp
}

interface State {
  refreshing: boolean
}

@screenTrack<Props>(props => ({
  context_screen: Schema.PageNames.ArtworkPage,
  context_screen_owner_type: Schema.OwnerEntityTypes.Artwork,
  context_screen_owner_slug: props.artwork.slug,
  context_screen_owner_id: props.artwork.internalID,
  availability: props.artwork.availability,
  acquireable: props.artwork.is_acquireable,
  inquireable: props.artwork.is_inquireable,
  offerable: props.artwork.is_offerable,
  biddable: props.artwork.is_biddable,
}))
export class Artwork extends React.Component<Props, State> {
  state = {
    refreshing: false,
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
    } = this.props.artwork
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

  componentDidUpdate(prevProps) {
    // If we are visible, but weren't, then we are re-appearing (not called on first render).
    if (this.props.isVisible && !prevProps.isVisible) {
      this.onRefresh()
    }
  }

  shouldRenderPartner = () => {
    const { partner, sale } = this.props.artwork
    if ((sale && sale.isBenefit) || (sale && sale.isGalleryAuction)) {
      return false
    } else if (partner && partner.type && partner.type !== "Auction House") {
      return true
    } else {
      return false
    }
  }

  shouldRenderOtherWorks = () => {
    const { contextGrids } = this.props.artwork
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

  forceRefetch = (onComplete?: () => void) => {
    this.props.relay.refetch(
      { id: this.props.artwork.id },
      {},
      error => {
        if (error) {
          console.error("Artwork.tsx refetch query: ", error.message)
        }
        if (onComplete) {
          onComplete()
        }
      },
      { force: true }
    )
  }

  sections = () => {
    const { artwork } = this.props
    const { artist, context } = artwork

    const sections = []

    sections.push("header")
    sections.push("commercialInformation")

    if (artwork.description || artwork.additional_information) {
      sections.push("aboutWork")
    }

    if (this.shouldRenderDetails()) {
      sections.push("details")
    }

    if (artwork.provenance || artwork.exhibition_history || artwork.literature) {
      sections.push("history")
    }

    if (artist && artist.biography_blurb) {
      sections.push("aboutArtist")
    }

    if (this.shouldRenderPartner()) {
      sections.push("partnerCard")
    }

    if (context) {
      sections.push("contextCard")
    }

    if (this.shouldRenderOtherWorks()) {
      sections.push("otherWorks")
    }

    return sections
  }

  renderItem = ({ item: section }) => {
    const { artwork } = this.props
    switch (section) {
      case "header":
        return <ArtworkHeader artwork={artwork} />
      case "commercialInformation":
        return <CommercialInformation artwork={artwork} />
      case "aboutWork":
        return <AboutWork artwork={artwork} />
      case "details":
        return <ArtworkDetails artwork={artwork} />
      case "history":
        return <ArtworkHistory artwork={artwork} />
      case "aboutArtist":
        return <AboutArtist artwork={artwork} />
      case "partnerCard":
        return <PartnerCard artwork={artwork} />
      case "contextCard":
        return <ContextCard artwork={artwork} />
      case "otherWorks":
        return <OtherWorks artwork={artwork} />
      default:
        return null
    }
  }

  render() {
    return (
      <Theme>
        <ProvideScreenDimensions>
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
        </ProvideScreenDimensions>
      </Theme>
    )
  }
}

export const ArtworkContainer = createRefetchContainer(
  Artwork,
  {
    artwork: graphql`
      fragment Artwork_artwork on Artwork {
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
        slug
        internalID
        id
        is_acquireable: isAcquireable
        is_offerable: isOfferable
        is_biddable: isBiddable
        is_inquireable: isInquireable
        availability
        ...PartnerCard_artwork
        ...AboutWork_artwork
        ...OtherWorks_artwork
        ...AboutArtist_artwork
        ...ArtworkDetails_artwork
        ...ContextCard_artwork
        ...ArtworkHeader_artwork
        ...CommercialInformation_artwork
        ...ArtworkHistory_artwork
      }
    `,
  },
  graphql`
    query ArtworkRefetchQuery($id: ID!) {
      node(id: $id) {
        ...Artwork_artwork
      }
    }
  `
)

export const ArtworkRenderer: React.SFC<{ artworkID: string; safeAreaInsets: SafeAreaInsets; isVisible: boolean }> = ({
  artworkID,
  ...others
}) => {
  return (
    <RetryErrorBoundary
      render={({ isRetry }) => {
        return (
          <QueryRenderer<ArtworkQuery>
            environment={defaultEnvironment}
            query={graphql`
              query ArtworkQuery($artworkID: String!) {
                artwork(id: $artworkID) {
                  ...Artwork_artwork
                }
              }
            `}
            variables={{
              artworkID,
            }}
            cacheConfig={{
              // Bypass Relay cache on retries.
              ...(isRetry && { force: true }),
            }}
            render={renderWithLoadProgress(ArtworkContainer, others)}
          />
        )
      }}
    />
  )
}
