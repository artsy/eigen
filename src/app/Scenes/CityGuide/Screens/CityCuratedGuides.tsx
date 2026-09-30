import { OwnerType } from "@artsy/cohesion"
import { Flex, Screen, Spinner, Text, useSpace } from "@artsy/palette-mobile"
import { CityCuratedGuidesQuery } from "__generated__/CityCuratedGuidesQuery.graphql"
import { CityCuratedGuides_query$key } from "__generated__/CityCuratedGuides_query.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { FeaturedGuideItem, GuideRow } from "app/Scenes/CityGuide/Components/CityGuideGuideListItem"
import { toGuideRows } from "app/Scenes/CityGuide/utils/toGuideRows"
import { goBack } from "app/system/navigation/navigate"
import { SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useCallback, useMemo } from "react"
import { ListRenderItem } from "react-native"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

const PAGE_SIZE = 20

const CityCuratedGuides: React.FC<{ citySlug: string }> = ({ citySlug }) => {
  const space = useSpace()
  const query = useLazyLoadQuery<CityCuratedGuidesQuery>(Query, { citySlug })
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    CityCuratedGuidesQuery,
    CityCuratedGuides_query$key
  >(fragment, query)
  const rows = toGuideRows(data.itinerariesConnection)
  const guides = [...rows.filter((row) => row.featured), ...rows.filter((row) => !row.featured)]
  const contentContainerStyle = useMemo(
    () => ({ paddingHorizontal: space(2), paddingBottom: space(4), paddingTop: space(2) }),
    [space]
  )
  const renderItem: ListRenderItem<GuideRow> = useCallback(
    ({ item }) => <FeaturedGuideItem item={item} citySlug={citySlug} />,
    [citySlug]
  )

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.cityGuideCuratedGuides,
        context_screen_owner_slug: citySlug,
      })}
    >
      <Screen>
        <Screen.Header onBack={goBack} title="City Guides" />

        <Screen.Body fullwidth backgroundColor="mono100">
          <Screen.FlatList
            testID="city-curated-guides-list"
            data={guides}
            keyExtractor={(item) => item.id}
            contentContainerStyle={contentContainerStyle}
            ItemSeparatorComponent={() => <Flex height={space(2)} />}
            ListEmptyComponent={
              <Text variant="sm" color="mono10">
                There are no curated guides for this city yet.
              </Text>
            }
            onEndReached={() => {
              if (hasNext && !isLoadingNext) loadNext(PAGE_SIZE)
            }}
            onEndReachedThreshold={0.2}
            ListFooterComponent={
              isLoadingNext ? (
                <Flex py={2}>
                  <Spinner color="mono0" />
                </Flex>
              ) : null
            }
            renderItem={renderItem}
          />
        </Screen.Body>
      </Screen>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

const Query = graphql`
  query CityCuratedGuidesQuery($citySlug: String!) @relay_test_operation {
    ...CityCuratedGuides_query @arguments(citySlug: $citySlug)
  }
`

const fragment = graphql`
  fragment CityCuratedGuides_query on Query
  @refetchable(queryName: "CityCuratedGuidesPaginationQuery")
  @argumentDefinitions(
    citySlug: { type: "String!" }
    count: { type: "Int", defaultValue: 20 }
    cursor: { type: "String" }
  ) {
    itinerariesConnection(citySlug: $citySlug, first: $count, after: $cursor, isCurated: true)
      @connection(key: "CityCuratedGuides_itinerariesConnection") {
      edges {
        node {
          internalID
          slug
          title
          subtitle
          authorName
          featured
          visibility
          heroImage {
            url(version: "small")
            featuredUrl: url(version: "large")
          }
        }
      }
    }
  }
`

export const CityCuratedGuidesScreen = withSuspense({
  Component: CityCuratedGuides,
  LoadingFallback: SpinnerFallback,
  ErrorFallback: (props) => (
    <LoadFailureView error={props.error} onRetry={props.resetErrorBoundary} />
  ),
})
