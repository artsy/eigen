import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, SkeletonText, Spacer } from "@artsy/palette-mobile"
import { FairExhibitorRailQuery } from "__generated__/FairExhibitorRailQuery.graphql"
import {
  FairExhibitorRail_show$data,
  FairExhibitorRail_show$key,
} from "__generated__/FairExhibitorRail_show.graphql"
import { ArtworkRail, ArtworkRailPlaceholder } from "app/Components/ArtworkRail/ArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import {
  CollectorSignals,
  getArtworkSignalTrackingFields,
} from "app/utils/getArtworkSignalTrackingFields"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { memo } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"

interface FairExhibitorRailProps {
  show: FairExhibitorRail_show$key
}

export const FairExhibitorRail: React.FC<FairExhibitorRailProps> = memo(({ show: showProp }) => {
  const show = useFragment(fairExhibitorRailFragment, showProp)

  const { trackEvent } = useTracking()

  const artworks = extractNodes(show?.artworksConnection)

  const count = show?.counts?.artworks ?? 0
  const partnerName = show?.partner?.name ?? ""
  const viewAllUrl = show?.href

  return (
    <>
      <Flex px={2}>
        <SectionTitle
          title={partnerName}
          subtitle={`${count} works`}
          href={viewAllUrl}
          onPress={() => {
            if (!viewAllUrl) return

            trackEvent(tracks.tappedShow(show))
          }}
        />
      </Flex>
      <ArtworkRail
        artworks={artworks}
        onPress={(artwork, position) => {
          trackEvent(
            tracks.tappedArtwork(
              show,
              artwork?.internalID ?? "",
              artwork?.slug ?? "",
              position,
              artwork.collectorSignals
            )
          )
        }}
        onMorePress={() => {
          if (!viewAllUrl) return

          trackEvent(tracks.tappedShow(show))
          navigate(viewAllUrl)
        }}
        showSaveIcon
      />
    </>
  )
})

const fairExhibitorRailFragment = graphql`
  fragment FairExhibitorRail_show on Show {
    internalID
    slug
    href
    partner {
      ... on Partner {
        name
      }
      ... on ExternalPartner {
        name
      }
    }
    counts {
      artworks
    }
    fair {
      internalID
      slug
    }
    artworksConnection(first: 10) {
      edges {
        node {
          ...ArtworkRail_artworks
        }
      }
    }
  }
`

const fairExhibitorRailQuery = graphql`
  query FairExhibitorRailQuery($id: String!) {
    show(id: $id) {
      ...FairExhibitorRail_show
    }
  }
`
export const FairExhibitorRailQueryRenderer: React.FC<{ showID: string }> = withSuspense({
  Component: ({ showID }) => {
    const data = useLazyLoadQuery<FairExhibitorRailQuery>(fairExhibitorRailQuery, { id: showID })

    if (!data.show) {
      return null
    }

    return <FairExhibitorRail show={data.show} />
  },
  LoadingFallback: () => <FairExhibitorRailPlaceholder />,
  ErrorFallback: NoFallback,
})

const FairExhibitorRailPlaceholder: React.FC = () => {
  return (
    <Flex mx={2}>
      <SkeletonText variant="sm-display">Arwtworks Rail</SkeletonText>

      <Spacer y={0.5} />

      <SkeletonText variant="xs">X works</SkeletonText>

      <Spacer y={2} />

      <ArtworkRailPlaceholder />
    </Flex>
  )
}

const tracks = {
  tappedArtwork: (
    show: FairExhibitorRail_show$data,
    artworkID: string,
    artworkSlug: string,
    position: number,
    collectorSignals: CollectorSignals
  ) => ({
    action: ActionType.tappedArtworkGroup,
    context_module: ContextModule.galleryBoothRail,
    context_screen_owner_type: OwnerType.fair,
    context_screen_owner_id: show.fair?.internalID ?? "",
    context_screen_owner_slug: show.fair?.slug ?? "",
    destination_screen_owner_type: OwnerType.artwork,
    destination_screen_owner_id: artworkID,
    destination_screen_owner_slug: artworkSlug,
    horizontal_slide_position: position,
    type: "thumbnail",
    ...getArtworkSignalTrackingFields(collectorSignals),
  }),
  tappedShow: (show: FairExhibitorRail_show$data) => ({
    action: ActionType.tappedArtworkGroup,
    context_module: ContextModule.galleryBoothRail,
    context_screen_owner_type: OwnerType.fair,
    context_screen_owner_id: show.fair?.internalID ?? "",
    context_screen_owner_slug: show.fair?.slug ?? "",
    destination_screen_owner_type: OwnerType.show,
    destination_screen_owner_id: show.internalID,
    destination_screen_owner_slug: show.slug,
    type: "viewAll",
  }),
}
