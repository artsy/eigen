import { Flex, Spinner } from "@artsy/palette-mobile"
import { CitySavedListPaginationQuery } from "__generated__/CitySavedListPaginationQuery.graphql"
import { CitySavedListQuery } from "__generated__/CitySavedListQuery.graphql"
import { CitySavedList_me$key } from "__generated__/CitySavedList_me.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { PAGE_SIZE } from "app/Components/constants"
import { Show } from "app/utils/cityGuide/types"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { isCloseToBottom } from "app/utils/isCloseToBottom"
import { Schema } from "app/utils/track"
import { useCallback, useEffect, useState } from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { EventList } from "./Components/EventList"

interface Props {
  me: CitySavedList_me$key
  cityName: string
  citySlug: string
}

const CitySavedList: React.FC<Props> = ({ me, cityName, citySlug }) => {
  const [fetchingNextPage, setFetchingNextPage] = useState(false)
  const { trackEvent } = useTracking()

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    CitySavedListPaginationQuery,
    CitySavedList_me$key
  >(citySavedListFragment, me)

  useEffect(() => {
    trackEvent(tracks.trackScreen(citySlug))
  }, [trackEvent, citySlug])

  const fetchData = useCallback(() => {
    if (!hasNext || isLoadingNext) {
      return
    }

    setFetchingNextPage(true)
    loadNext(PAGE_SIZE, {
      onComplete: (error) => {
        if (error) {
          console.error("CitySavedList.tsx #fetchData", error.message)
        }
        setFetchingNextPage(false)
      },
    })
  }, [hasNext, isLoadingNext, loadNext])

  const shows = extractNodes(data.followsAndSaves?.shows) as unknown as Show[]

  return (
    <EventList
      header="Saved shows"
      cityName={cityName}
      bucket={shows}
      type="saved"
      onScroll={isCloseToBottom(fetchData)}
      fetchingNextPage={fetchingNextPage}
    />
  )
}

const citySavedListFragment = graphql`
  fragment CitySavedList_me on Me
  @refetchable(queryName: "CitySavedListPaginationQuery")
  @argumentDefinitions(
    citySlug: { type: "String!" }
    count: { type: "Int", defaultValue: 20 }
    cursor: { type: "String", defaultValue: "" }
  ) {
    followsAndSaves {
      shows: showsConnection(
        first: $count
        status: RUNNING_AND_UPCOMING
        city: $citySlug
        after: $cursor
      ) @connection(key: "CitySavedList_shows") {
        edges {
          node {
            slug
            internalID
            id
            name
            isStubShow
            status
            href
            is_followed: isFollowed
            exhibition_period: exhibitionPeriod(format: SHORT)
            cover_image: coverImage {
              url
            }
            location {
              coordinates {
                lat
                lng
              }
            }
            type
            start_at: startAt
            end_at: endAt
            partner {
              ... on Partner {
                name
                type
                profile {
                  image {
                    url(version: "square")
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

interface CitySavedListProps {
  citySlug: string
}

export const CitySavedListScreenQuery = graphql`
  query CitySavedListQuery($citySlug: String!) {
    me {
      ...CitySavedList_me @arguments(citySlug: $citySlug)
    }
    city(slug: $citySlug) {
      name
    }
  }
`

export const CitySavedListQueryRenderer: React.FC<CitySavedListProps> = withSuspense({
  Component: ({ citySlug }) => {
    const data = useLazyLoadQuery<CitySavedListQuery>(CitySavedListScreenQuery, { citySlug })

    if (!data.me || !data.city) {
      return null
    }

    return <CitySavedList me={data.me} cityName={data.city.name ?? ""} citySlug={citySlug} />
  },
  ErrorFallback: (fallbackProps) => (
    <LoadFailureView
      onRetry={fallbackProps.resetErrorBoundary}
      useSafeArea={false}
      showCloseButton
      error={fallbackProps.error}
      showBackButton
      trackErrorBoundary={false}
    />
  ),
  LoadingFallback: () => (
    <Flex flex={1} alignItems="center" justifyContent="center" testID="placeholder">
      <Spinner />
    </Flex>
  ),
})

const tracks = {
  trackScreen: (citySlug: string) => ({
    context_screen: Schema.PageNames.CityGuideSavedList,
    context_screen_owner_type: Schema.OwnerEntityTypes.CityGuide,
    context_screen_owner_slug: citySlug,
    context_screen_owner_id: citySlug,
  }),
}
