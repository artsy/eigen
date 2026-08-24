import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { EventArtworkRailQuery } from "__generated__/EventArtworkRailQuery.graphql"
import {
  EventArtworkRail_show$data,
  EventArtworkRail_show$key,
} from "__generated__/EventArtworkRail_show.graphql"
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

interface EventArtworkRailProps {
  show: EventArtworkRail_show$key
}

export const EventArtworkRail: React.FC<EventArtworkRailProps> = memo(({ show: showProp }) => {
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
  fragment EventArtworkRail_show on Show {
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
  query EventArtworkRailQuery($id: String!) {
    show(id: $id) {
      ...EventArtworkRail_show
    }
  }
`

export const EventArtworkRailQueryRenderer: React.FC<{ showID: string }> = withSuspense({
  Component: ({ showID }) => {
    const data = useLazyLoadQuery<EventArtworkRailQuery>(eventArtworkRailQuery, { id: showID })

    if (!data.show) {
      return null
    }

    return <EventArtworkRail show={data.show} />
  },
  LoadingFallback: () => <ArtworkRailPlaceholder />,
  ErrorFallback: NoFallback,
})

const tracks = {
  tappedArtwork: (
    show: EventArtworkRail_show$data,
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
