import { Box, Flex, Separator, Spinner, Text } from "@artsy/palette-mobile"
import { FlashList, ListRenderItem } from "@shopify/flash-list"
import { CityFairListPaginationQuery } from "__generated__/CityFairListPaginationQuery.graphql"
import { CityFairListQuery } from "__generated__/CityFairListQuery.graphql"
import { CityFairList_viewer$key } from "__generated__/CityFairList_viewer.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { PAGE_SIZE } from "app/Components/constants"
import { TabFairItemRow } from "app/Scenes/City/Components/TabFairItemRow/TabFairItemRow"
import { Fair } from "app/utils/cityGuide/types"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { isCloseToBottom } from "app/utils/isCloseToBottom"
import { Schema } from "app/utils/track"
import { useCallback, useEffect, useState } from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface Props {
  viewer: CityFairList_viewer$key
  citySlug: string
}

const CityFairList: React.FC<Props> = ({ viewer, citySlug }) => {
  const [fetchingNextPage, setFetchingNextPage] = useState(false)
  const { trackEvent } = useTracking()

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    CityFairListPaginationQuery,
    CityFairList_viewer$key
  >(cityFairListFragment, viewer)

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
          console.error("CityFairList.tsx #fetchData", error.message)
        }
        setFetchingNextPage(false)
      },
    })
  }, [hasNext, isLoadingNext, loadNext])

  const fairs = extractNodes(data.city?.fairs)

  const renderItem: ListRenderItem<(typeof fairs)[number]> = useCallback(
    ({ item }) => (
      <Box py={2}>
        <TabFairItemRow item={item as unknown as Fair} />
      </Box>
    ),
    []
  )

  const keyExtractor = useCallback((item: (typeof fairs)[number]) => item.internalID, [])

  const renderListHeader = useCallback(
    () => (
      <Box pt={6} mt={4} mb={2}>
        <Text variant="lg-display">Fairs</Text>
      </Box>
    ),
    []
  )

  const renderListFooter = useCallback(
    () => (fetchingNextPage ? <Spinner style={{ marginTop: 20, marginBottom: 20 }} /> : null),
    [fetchingNextPage]
  )

  return (
    <Box mx={2} flex={1}>
      <FlashList
        data={fairs}
        ListHeaderComponent={renderListHeader}
        ItemSeparatorComponent={Separator}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onScroll={isCloseToBottom(fetchData)}
        ListFooterComponent={renderListFooter}
      />
    </Box>
  )
}

const cityFairListFragment = graphql`
  fragment CityFairList_viewer on Viewer
  @refetchable(queryName: "CityFairListPaginationQuery")
  @argumentDefinitions(
    citySlug: { type: "String!" }
    count: { type: "Int", defaultValue: 20 }
    cursor: { type: "String", defaultValue: "" }
  ) {
    city(slug: $citySlug) {
      fairs: fairsConnection(first: $count, after: $cursor, status: CURRENT, sort: START_AT_ASC)
        @connection(key: "CityFairList_fairs") {
        edges {
          node {
            internalID
            slug
            name
            exhibition_period: exhibitionPeriod(format: SHORT)
            counts {
              partners
            }
            location {
              coordinates {
                lat
                lng
              }
            }
            image {
              image_url: imageURL
              aspect_ratio: aspectRatio
              url
            }
            profile {
              icon {
                internalID
                href
                height
                width
                url(version: "square140")
              }
              id
              slug
              name
            }
            start_at: startAt
            end_at: endAt
          }
        }
      }
    }
  }
`

interface CityFairListProps {
  citySlug: string
}

export const CityFairListScreenQuery = graphql`
  query CityFairListQuery($citySlug: String!) {
    viewer {
      ...CityFairList_viewer @arguments(citySlug: $citySlug)
    }
  }
`

export const CityFairListQueryRenderer: React.FC<CityFairListProps> = withSuspense({
  Component: ({ citySlug }) => {
    const data = useLazyLoadQuery<CityFairListQuery>(CityFairListScreenQuery, { citySlug })

    if (!data.viewer) {
      return null
    }

    return <CityFairList viewer={data.viewer} citySlug={citySlug} />
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
    context_screen: Schema.PageNames.CityGuideFairsList,
    context_screen_owner_type: Schema.OwnerEntityTypes.CityGuide,
    context_screen_owner_slug: citySlug,
    context_screen_owner_id: citySlug,
  }),
}
