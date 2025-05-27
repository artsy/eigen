import { Flex, Screen, Spinner } from "@artsy/palette-mobile"
import {
  CitySectionListQuery,
  EventStatus,
  PartnerShowPartnerType,
  ShowSorts,
} from "__generated__/CitySectionListQuery.graphql"
import { CitySectionList_viewer$key } from "__generated__/CitySectionList_viewer.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { PAGE_SIZE } from "app/Components/constants"
import { BucketKey } from "app/Scenes/Map/bucketCityResults"
import { Show } from "app/Scenes/Map/types"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { isCloseToBottom } from "app/utils/isCloseToBottom"
import { Schema } from "app/utils/track"
import React, { useEffect, useState } from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { EventList } from "./Components/EventList"

interface Props {
  viewer: CitySectionList_viewer$key
  citySlug: string
  section: BucketKey
  dayThreshold?: number
  status?: EventStatus
}

const CitySectionList: React.FC<Props> = (props) => {
  const { citySlug, section } = props
  const [fetchingNextPage, setFetchingNextPage] = useState(false)
  const { trackEvent } = useTracking()

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment(
    citySectionListFragment,
    props.viewer
  )

  useEffect(() => {
    trackEvent(tracks.trackScreen(section, citySlug))
  }, [trackEvent, citySlug])
  const fetchData = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    setFetchingNextPage(true)
    loadNext(PAGE_SIZE, {
      onComplete: (error) => {
        if (error) {
          console.error("CitySectionList.tsx #fetchData", error.message)
        }
        setFetchingNextPage(false)
      },
    })
  }

  const currentSection = props.section

  const shows = extractNodes(data.city?.shows)
  const name = data.city?.name

  let headerText
  switch (currentSection) {
    case "galleries":
      headerText = "Gallery shows"
      break
    case "museums":
      headerText = "Museum shows"
      break
    case "closing":
      headerText = "Closing soon"
      break
    case "opening":
      headerText = "Opening soon"
      break
  }

  return (
    <EventList
      key={name + currentSection}
      cityName={name as any /* STRICTNESS_MIGRATION */}
      header={headerText}
      bucket={shows as Show[]}
      type={currentSection}
      onScroll={isCloseToBottom(fetchData) as any /* STRICTNESS_MIGRATION */}
      fetchingNextPage={fetchingNextPage}
    />
  )
}

interface CitySectionListProps {
  citySlug: string
  section: BucketKey
}

export const CitySectionListScreenQuery = graphql`
  query CitySectionListQuery(
    $citySlug: String!
    $partnerType: PartnerShowPartnerType
    $status: EventStatus
    $dayThreshold: Int
    $sort: ShowSorts
  ) {
    viewer {
      ...CitySectionList_viewer
        @arguments(
          citySlug: $citySlug
          partnerType: $partnerType
          status: $status
          sort: $sort
          dayThreshold: $dayThreshold
        )
    }
  }
`

const citySectionListFragment = graphql`
  fragment CitySectionList_viewer on Viewer
  @refetchable(queryName: "CitySectionListPaginationQuery")
  @argumentDefinitions(
    citySlug: { type: "String!" }
    count: { type: "Int", defaultValue: 20 }
    cursor: { type: "String", defaultValue: "" }
    partnerType: { type: "PartnerShowPartnerType" }
    status: { type: "EventStatus" }
    dayThreshold: { type: "Int" }
    sort: { type: "ShowSorts", defaultValue: PARTNER_ASC }
  ) {
    city(slug: $citySlug) {
      name
      shows: showsConnection(
        includeStubShows: true
        first: $count
        sort: $sort
        after: $cursor
        partnerType: $partnerType
        status: $status
        dayThreshold: $dayThreshold
      ) @connection(key: "CitySectionList_shows") {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            ...ShowItemRow_show
            id
            slug
            internalID
            isStubShow
            is_followed: isFollowed
            start_at: startAt
            end_at: endAt
            status
            href
            type
            name
            cover_image: coverImage {
              url
            }
            exhibition_period: exhibitionPeriod(format: SHORT)
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

export const CitySectionListQueryRenderer: React.FC<CitySectionListProps> = withSuspense({
  Component: ({ citySlug, section, ...props }) => {
    const variables: {
      citySlug: string
      partnerType?: PartnerShowPartnerType
      status?: EventStatus
      dayThreshold?: number
      sort?: ShowSorts
    } = { citySlug }

    switch (section) {
      case "museums":
        variables.partnerType = "MUSEUM"
        variables.status = "RUNNING"
        variables.sort = "PARTNER_ASC"
        break
      case "galleries":
        variables.partnerType = "GALLERY"
        variables.status = "RUNNING"
        variables.sort = "PARTNER_ASC"
        break
      case "closing":
        variables.status = "CLOSING_SOON"
        variables.sort = "END_AT_ASC"
        variables.dayThreshold = 7
        break
      case "opening":
        variables.status = "UPCOMING"
        variables.sort = "START_AT_ASC"
        variables.dayThreshold = 14
    }

    const data = useLazyLoadQuery<CitySectionListQuery>(CitySectionListScreenQuery, variables)

    if (!data.viewer) {
      return null
    }

    return (
      <Screen>
        <Screen.Header onBack={goBack} />
        <Screen.Body fullwidth>
          <CitySectionList {...props} citySlug={citySlug} section={section} viewer={data.viewer} />
        </Screen.Body>
      </Screen>
    )
  },
  ErrorFallback: (fallbackProps) => {
    return (
      <LoadFailureView
        onRetry={fallbackProps.resetErrorBoundary}
        useSafeArea={false}
        showCloseButton
        error={fallbackProps.error}
        showBackButton={true}
        trackErrorBoundary={false}
      />
    )
  },
  LoadingFallback: () => (
    <Flex flex={1} alignItems="center" justifyContent="center" testID="placeholder">
      <Spinner />
    </Flex>
  ),
})

const tracks = {
  trackScreen: (section: BucketKey, citySlug: string) => {
    let contextScreen

    switch (section) {
      case "opening":
        contextScreen = Schema.PageNames.CityGuideOpeningSoonList
        break
      case "museums":
        contextScreen = Schema.PageNames.CityGuideMuseumsList
        break
      case "closing":
        contextScreen = Schema.PageNames.CityGuideClosingSoonList
        break
      case "galleries":
        contextScreen = Schema.PageNames.CityGuideGalleriesList
        break
    }

    return {
      context_screen: contextScreen,
      context_screen_owner_type: Schema.OwnerEntityTypes.CityGuide,
      context_screen_owner_slug: citySlug,
      context_screen_owner_id: citySlug,
    }
  },
}
