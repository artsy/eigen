import { ActionType, ContextModule, OwnerType, ScreenOwnerType } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import {
  ArtworksInSeriesRail_artwork$data,
  ArtworksInSeriesRail_artwork$key,
} from "__generated__/ArtworksInSeriesRail_artwork.graphql"
import { SmallArtworkRail } from "app/Components/ArtworkRail/SmallArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { isEmpty } from "lodash"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface ArtworksInSeriesRailProps {
  artwork: ArtworksInSeriesRail_artwork$key
}

export const ArtworksInSeriesRail: React.FC<ArtworksInSeriesRailProps> = (props) => {
  const { trackEvent } = useTracking()
  const AREnablePartnerOfferSignals = useFeatureFlag("AREnablePartnerOfferSignals")

  const artwork = useFragment(artworkFragment, props.artwork)

  if (isEmpty(artwork)) {
    return null
  }

  const firstArtistSeries = extractNodes(artwork?.artistSeriesConnection)[0]
  const artworks = extractNodes(firstArtistSeries?.filterArtworksConnection)

  return (
    <Flex>
      <SectionTitle
        title="More from this series"
        titleVariant="md"
        onPress={() => {
          trackEvent(tracks.tappedHeader(artwork, firstArtistSeries))
          navigate(`/artist-series/${firstArtistSeries?.slug}`)
        }}
      />
      <SmallArtworkRail
        artworks={artworks}
        onPress={(item) => {
          if (!!item.href) {
            const partnerOfferAvailable =
              AREnablePartnerOfferSignals && !!item.collectorSignals?.partnerOffer?.isAvailable
            trackEvent(tracks.tappedArtwork(artwork, item, partnerOfferAvailable))
            navigate(item.href)
          }
        }}
        ListHeaderComponent={null}
        ListFooterComponent={null}
      />
    </Flex>
  )
}

const artworkFragment = graphql`
  fragment ArtworksInSeriesRail_artwork on Artwork {
    internalID
    slug
    artistSeriesConnection(first: 1) {
      edges {
        node {
          slug
          internalID
          filterArtworksConnection(first: 20, input: { sort: "-decayed_merch" }) {
            edges {
              node {
                ...SmallArtworkRail_artworks
              }
            }
          }
        }
      }
    }
  }
`

const tracks = {
  tappedHeader: (
    sourceArtwork: ArtworksInSeriesRail_artwork$data,
    destination: { internalID: string; slug: string }
  ) => ({
    action: ActionType.tappedArtworkGroup,
    context_module: ContextModule.moreFromThisSeries,
    context_screen_owner_type: OwnerType.artwork as ScreenOwnerType,
    context_screen_owner_id: sourceArtwork.internalID,
    context_screen_owner_slug: sourceArtwork.slug,
    destination_screen_owner_type: OwnerType.artistSeries,
    destination_screen_owner_id: destination.internalID,
    destination_screen_owner_slug: destination.slug,
    type: "viewAll",
  }),
  tappedArtwork: (
    sourceArtwork: ArtworksInSeriesRail_artwork$data,
    destination: { internalID: string; slug: string },
    withPartnerOffer?: boolean
  ) => ({
    action: ActionType.tappedArtworkGroup,
    context_module: ContextModule.moreFromThisSeries,
    context_screen_owner_type: OwnerType.artwork as ScreenOwnerType,
    context_screen_owner_id: sourceArtwork.internalID,
    context_screen_owner_slug: sourceArtwork.slug,
    destination_screen_owner_type: OwnerType.artwork,
    destination_screen_owner_id: destination.internalID,
    destination_screen_owner_slug: destination.slug,
    type: "thumbnail",
    signal_label: withPartnerOffer ? "Limited-Time Offer" : undefined,
  }),
}
