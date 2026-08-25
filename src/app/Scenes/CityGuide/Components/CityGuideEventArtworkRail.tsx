import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { CityGuideEventArtworkRailQuery } from "__generated__/CityGuideEventArtworkRailQuery.graphql"
import {
  CityGuideEventArtworkRail_show$data,
  CityGuideEventArtworkRail_show$key,
} from "__generated__/CityGuideEventArtworkRail_show.graphql"
import { ArtworkRail, ArtworkRailPlaceholder } from "app/Components/ArtworkRail/ArtworkRail"
import { extractNodes } from "app/utils/extractNodes"
import {
  CollectorSignals,
  getArtworkSignalTrackingFields,
} from "app/utils/getArtworkSignalTrackingFields"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { memo } from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"

interface CityGuideEventArtworkRailProps {
  show: CityGuideEventArtworkRail_show$key
}

export const CityGuideEventArtworkRail: React.FC<CityGuideEventArtworkRailProps> = memo(({ show: showProp }) => {
  const show = useFragment(eventArtworkRailFragment, showProp)
  const { trackEvent } = useTracking()

  const artworks = extractNodes(show?.artworksConnection)

  if (!artworks.length) {
    return null
  }

  return (
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
      showSaveIcon
      moreHref={show?.href ?? null}
    />
  )
})

const eventArtworkRailFragment = graphql`
  fragment CityGuideEventArtworkRail_show on Show {
    internalID
    slug
    href
    artworksConnection(first: 10) {
      edges {
        node {
          ...ArtworkRail_artworks
        }
      }
    }
  }
`

const eventArtworkRailQuery = graphql`
  query CityGuideEventArtworkRailQuery($id: String!) {
    show(id: $id) {
      ...CityGuideEventArtworkRail_show
    }
  }
`

export const CityGuideEventArtworkRailQueryRenderer: React.FC<{ showID: string }> = withSuspense({
  Component: ({ showID }) => {
    const data = useLazyLoadQuery<CityGuideEventArtworkRailQuery>(eventArtworkRailQuery, { id: showID })

    if (!data.show) {
      return null
    }

    return <CityGuideEventArtworkRail show={data.show} />
  },
  LoadingFallback: () => <ArtworkRailPlaceholder />,
  ErrorFallback: NoFallback,
})

const tracks = {
  tappedArtwork: (
    show: CityGuideEventArtworkRail_show$data,
    artworkID: string,
    artworkSlug: string,
    position: number,
    collectorSignals: CollectorSignals
  ) => ({
    action: ActionType.tappedArtworkGroup,
    context_module: ContextModule.otherWorksFromShowRail,
    context_screen_owner_type: OwnerType.show,
    context_screen_owner_id: show.internalID,
    context_screen_owner_slug: show.slug,
    destination_screen_owner_type: OwnerType.artwork,
    destination_screen_owner_id: artworkID,
    destination_screen_owner_slug: artworkSlug,
    horizontal_slide_position: position,
    type: "thumbnail",
    ...getArtworkSignalTrackingFields(collectorSignals),
  }),
}
