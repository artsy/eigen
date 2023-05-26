import { OwnerType } from "@artsy/cohesion"
import { Flex, Spacer, Text, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { GalleriesForYouQuery } from "__generated__/GalleriesForYouQuery.graphql"
import { GalleriesForYou_partnersConnection$key } from "__generated__/GalleriesForYou_partnersConnection.graphql"
import { GalleryListItem } from "app/Scenes/GalleriesForYou/Components/GalleryListItem"
import { extractNodes } from "app/utils/extractNodes"
import { PlaceholderBox, ProvidePlaceholderContext } from "app/utils/placeholders"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { times } from "lodash"
import { Suspense } from "react"
import { ActivityIndicator, FlatList } from "react-native"
import { useLazyLoadQuery, usePaginationFragment } from "react-relay"
import { graphql } from "relay-runtime"

export const GalleriesForYou: React.FC = () => {
  const queryData = useLazyLoadQuery<GalleriesForYouQuery>(GalleriesForYouScreenQuery, {})

  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
    GalleriesForYouQuery,
    GalleriesForYou_partnersConnection$key
  >(partnersConnectionFragment, queryData)

  const RefreshControl = useRefreshControl(refetch)

  const partners = extractNodes(data.partnersConnection)

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        // TODO: Add screen name
        context_screen_owner_type: OwnerType.articles,
      })}
    >
      <Flex mb={4}>
        {/* TODO: User Prefetch Flatlist */}
        <FlatList
          data={partners}
          ListHeaderComponent={<GalleriesForYouHeader />}
          refreshControl={RefreshControl}
          renderItem={({ item }) => {
            return <GalleryListItem partner={item} />
          }}
          ItemSeparatorComponent={() => <Spacer y={4} />}
          onEndReached={() => loadNext(galleriesForYouQueryVariables.count)}
          ListFooterComponent={() => (
            // TODO: Fix loading indicator
            <Flex
              alignItems="center"
              justifyContent="center"
              p={4}
              pb={6}
              style={{ opacity: isLoadingNext && hasNext ? 1 : 0 }}
            >
              <ActivityIndicator />
            </Flex>
          )}
        />
      </Flex>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

export const GalleriesForYouScreen: React.FC = () => (
  <Suspense fallback={<GalleriesForYouPlaceholder />}>
    <GalleriesForYou />
  </Suspense>
)

const GalleriesForYouHeader = () => (
  <Flex mx={2} mb={4} mt={6}>
    <Text variant="lg-display">Galleries For You</Text>
    <Text variant="sm">Find galleries in your area with artists you follow.</Text>
  </Flex>
)

const GalleriesForYouPlaceholder = () => {
  const { width } = useScreenDimensions()
  const space = useSpace()

  return (
    <ProvidePlaceholderContext>
      <Flex>
        <GalleriesForYouHeader />

        <Flex mx={2} mt={1}>
          {times(5).map((i) => {
            return (
              <Flex mb={2} key={i}>
                <PlaceholderBox height={(width - space(4)) / 1.33} />
                <Spacer y={1} />
                <PlaceholderBox height={40} />
              </Flex>
            )
          })}
        </Flex>
      </Flex>
    </ProvidePlaceholderContext>
  )
}

const partnersConnectionFragment = graphql`
  fragment GalleriesForYou_partnersConnection on Query
  @refetchable(queryName: "GalleriesForYouRefetchQuery")
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, after: { type: "String" }) {
    partnersConnection(
      first: $count
      after: $after
      eligibleForListing: true
      defaultProfilePublic: true
      sort: RANDOM_SCORE_DESC
      near: "52.53,  13.39"
      type: GALLERY
    ) @connection(key: "GalleriesForYou_partnersConnection") {
      totalCount
      edges {
        node {
          internalID
          ...GalleryListItem_partner
        }
      }
    }
  }
`

export const galleriesForYouQueryVariables = {
  count: 10,
}

const GalleriesForYouScreenQuery = graphql`
  query GalleriesForYouQuery($count: Int, $after: String) {
    ...GalleriesForYou_partnersConnection @arguments(count: $count, after: $after)
  }
`
