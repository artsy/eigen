import { ItineraryStopEntityResolversFairQuery } from "__generated__/ItineraryStopEntityResolversFairQuery.graphql"
import { ItineraryStopEntityResolversPartnerQuery } from "__generated__/ItineraryStopEntityResolversPartnerQuery.graphql"
import { ItineraryStopEntityResolversShowQuery } from "__generated__/ItineraryStopEntityResolversShowQuery.graphql"
import { useReportItineraryStopEntity } from "app/Scenes/CityGuide/Screens/Itinerary/hooks/ItineraryStopEntities"
import {
  ItinerarySaveTarget,
  ItineraryStop,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { Suspense, useEffect } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { graphql, useLazyLoadQuery } from "react-relay"

interface ResolverProps {
  stopId: string
  saveTarget: ItinerarySaveTarget
}

/**
 * Renders nothing. Its only job is to resolve one stop's entity and report it upward.
 *
 * `useLazyLoadQuery` subscribes to the store, so after a follow mutation this re-renders with
 * the new `isFollowed`, the effect fires again, and the reported entity updates. That is how
 * rows reflect a bulk add immediately.
 */
const ShowResolver: React.FC<ResolverProps> = ({ stopId, saveTarget }) => {
  const data = useLazyLoadQuery<ItineraryStopEntityResolversShowQuery>(ShowQuery, {
    slug: saveTarget.slug,
  })
  const { report, reportFailure } = useReportItineraryStopEntity()
  const show = data?.show

  useEffect(() => {
    // A resolved query with no entity is a settled failure, not a pending lookup. Without this
    // the provider would wait forever on a slug that no longer exists.
    if (!show) {
      reportFailure(stopId)
      return
    }

    report({
      stopId,
      id: show.id,
      internalID: show.internalID,
      isFollowed: !!show.isFollowed,
      type: "SHOW",
    })
    // `show` in full, not its members: the body dereferences it, so
    // react-hooks/exhaustive-deps demands the object. The provider's `report` bails out when
    // nothing changed, so a new object identity each render cannot loop.
  }, [stopId, show, report, reportFailure])

  return null
}

/** Fairs follow through fair.profile, the same path partners use. */
const FairResolver: React.FC<ResolverProps> = ({ stopId, saveTarget }) => {
  const data = useLazyLoadQuery<ItineraryStopEntityResolversFairQuery>(FairQuery, {
    slug: saveTarget.slug,
  })
  const { report, reportFailure } = useReportItineraryStopEntity()
  const profile = data?.fair?.profile

  useEffect(() => {
    if (!profile) {
      reportFailure(stopId)
      return
    }

    report({
      stopId,
      id: profile.id,
      internalID: profile.internalID,
      isFollowed: !!profile.isFollowed,
      type: "FAIR",
    })
  }, [stopId, profile, report, reportFailure])

  return null
}

/** Galleries and museums are both Partners; following either is a profile follow. */
const PartnerResolver: React.FC<ResolverProps> = ({ stopId, saveTarget }) => {
  const data = useLazyLoadQuery<ItineraryStopEntityResolversPartnerQuery>(PartnerQuery, {
    slug: saveTarget.slug,
  })
  const { report, reportFailure } = useReportItineraryStopEntity()
  const profile = data?.partner?.profile

  useEffect(() => {
    if (!profile) {
      reportFailure(stopId)
      return
    }

    report({
      stopId,
      id: profile.id,
      internalID: profile.internalID,
      isFollowed: !!profile.isFollowed,
      type: "PARTNER",
    })
  }, [stopId, profile, report, reportFailure])

  return null
}

const RESOLVERS: Record<ItinerarySaveTarget["type"], React.FC<ResolverProps>> = {
  SHOW: ShowResolver,
  FAIR: FairResolver,
  PARTNER: PartnerResolver,
}

/** Reports a failed lookup from inside an error boundary's fallback. */
const ResolverFailed: React.FC<{ stopId: string }> = ({ stopId }) => {
  const { reportFailure } = useReportItineraryStopEntity()

  useEffect(() => {
    reportFailure(stopId)
  }, [stopId, reportFailure])

  return null
}

/**
 * One resolver per saveable stop, each independently suspended and independently fallible, so
 * one slow or missing entity cannot blank the screen or stop the others reporting.
 */
export const ItineraryStopEntityResolvers: React.FC<{ stops: ItineraryStop[] }> = ({ stops }) => (
  <>
    {stops.map((stop) => {
      if (!stop.saveTarget) {
        return null
      }

      const Resolver = RESOLVERS[stop.saveTarget.type]

      return (
        <ErrorBoundary key={stop.id} fallbackRender={() => <ResolverFailed stopId={stop.id} />}>
          <Suspense fallback={null}>
            <Resolver stopId={stop.id} saveTarget={stop.saveTarget} />
          </Suspense>
        </ErrorBoundary>
      )
    })}
  </>
)

const ShowQuery = graphql`
  # includeAllShows: true is required, not optional. It defaults to false — "Include shows
  # that are no longer running/active" — so without it a mock built from currently running
  # shows silently loses its save controls as those shows close.
  query ItineraryStopEntityResolversShowQuery($slug: String!) {
    show(id: $slug, includeAllShows: true) {
      id
      internalID
      isFollowed
    }
  }
`

const FairQuery = graphql`
  query ItineraryStopEntityResolversFairQuery($slug: String!) {
    fair(id: $slug) {
      profile {
        id
        internalID
        isFollowed
      }
    }
  }
`

const PartnerQuery = graphql`
  query ItineraryStopEntityResolversPartnerQuery($slug: String!) {
    partner(id: $slug) {
      profile {
        id
        internalID
        isFollowed
      }
    }
  }
`
