import { CityGuideItinerarySummaryQuery } from "__generated__/CityGuideItinerarySummaryQuery.graphql"
import { CityGuideEventSummaryRow } from "app/Scenes/CityGuide/Components/CityGuideEventSummaryRow"
import { extractNodes } from "app/utils/extractNodes"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { Schema } from "app/utils/track"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"

const SHOW_PAGE_SIZE = 100
const NAMES_IN_SUBTITLE = 3

interface Props {
  citySlug: string
  cityName: string
}

const CityGuideItinerary: React.FC<Props> = ({ citySlug, cityName }) => {
  const { trackEvent } = useTracking<Schema.Entity>()
  const data = useLazyLoadQuery<CityGuideItinerarySummaryQuery>(Query, { citySlug })

  const shows = extractNodes(data.me?.followsAndSaves?.shows)
  const followedFairs = extractNodes(data.city?.fairsConnection).filter(
    (fair) => !!fair.profile?.isFollowed
  )

  const count = followedFairs.length + shows.length

  if (count === 0) {
    return null
  }

  const names = [...followedFairs.map((fair) => fair.name), ...shows.map((show) => show.name)]

  return (
    <CityGuideEventSummaryRow
      title={`Your ${cityName} Itinerary`}
      count={count}
      countLabel="Stop"
      // The show half is capped at one page, so beyond that the true total is unknown.
      countSuffix={shows.length >= SHOW_PAGE_SIZE ? "+" : undefined}
      subtitle={names.filter(Boolean).slice(0, NAMES_IN_SUBTITLE).join(", ") || null}
      imageURL={followedFairs[0]?.image?.url ?? shows[0]?.coverImage?.url ?? null}
      href={`/city-save/${citySlug}`}
      onPress={() => {
        trackEvent({
          action_name: Schema.ActionNames.ViewAll,
          action_type: Schema.ActionTypes.Tap,
          owner_type: Schema.OwnerEntityTypes.CityGuide,
          owner_slug: citySlug,
          context_module: "itinerary",
        })
      }}
    />
  )
}

/**
 * Two halves, one round trip.
 *
 * Shows come from `followsAndSaves`, which filters by city server side but exposes no
 * `totalCount` (`schema.graphql:19965-19975`), so the count comes from counting edges.
 * `dayThreshold: 365` because Gravity defaults `RUNNING_AND_UPCOMING` to 15 days, which would
 * hide a show saved for a trip next month.
 *
 * Fairs come from the city's own fair list filtered on `profile.isFollowed`, which is exact.
 * `followsAndSaves.fairsConnection` takes no `city` argument, so it cannot be used here. There
 * is no way to widen the fair window: the fairs endpoint calls the scope with no argument
 * (`v1/fairs_endpoint.rb:166`).
 *
 * `withSuspense` renders nothing on error, so a failed request leaves the home unchanged
 * rather than showing a broken row.
 */
const Query = graphql`
  query CityGuideItinerarySummaryQuery($citySlug: String!) {
    me {
      followsAndSaves {
        shows: showsConnection(
          first: 100
          status: RUNNING_AND_UPCOMING
          dayThreshold: 365
          city: $citySlug
        ) {
          edges {
            node {
              name
              coverImage {
                url
              }
            }
          }
        }
      }
    }

    city(slug: $citySlug) {
      fairsConnection(first: 100, status: RUNNING_AND_UPCOMING, sort: START_AT_ASC) {
        edges {
          node {
            name
            image {
              url
            }
            profile {
              isFollowed
            }
          }
        }
      }
    }
  }
`

export const CityGuideItinerarySummary = withSuspense({
  Component: CityGuideItinerary,
  LoadingFallback: () => null,
  ErrorFallback: NoFallback,
})
