import { OwnerType } from "@artsy/cohesion"
import { Flex, Spacer, Text, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { GalleriesForYouScreenQuery } from "__generated__/GalleriesForYouScreenQuery.graphql"
import { GalleriesForYouScreen_partnersConnection$key } from "__generated__/GalleriesForYouScreen_partnersConnection.graphql"
import {
  MAX_PARTNER_LIST_ITEM_WIDTH,
  PartnerListItem,
} from "app/Scenes/GalleriesForYou/Components/PartnerListItem"
import { extractNodes } from "app/utils/extractNodes"
import { isPad } from "app/utils/hardware"
import { Location, useLocation } from "app/utils/hooks/useLocation"
import { PlaceholderBox, ProvidePlaceholderContext } from "app/utils/placeholders"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useStickyScrollHeader } from "app/utils/useStickyScrollHeader"
import { times } from "lodash"
import { Suspense } from "react"
import { ActivityIndicator, Animated } from "react-native"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

interface GalleriesForYouProps {
  location: Location | null
}
export const GalleriesForYou: React.FC<GalleriesForYouProps> = ({ location }) => {
  const queryData = useLazyLoadQuery<GalleriesForYouScreenQuery>(GalleriesForYouQuery, {
    near: location && `${location?.lat},${location?.lng}`,
    includePartnersNearIpBasedLocation: !location,
  })

  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
    GalleriesForYouScreenQuery,
    GalleriesForYouScreen_partnersConnection$key
  >(partnersConnectionFragment, queryData)

  const RefreshControl = useRefreshControl(refetch)

  const partners = extractNodes(data.partnersConnection)

  const { headerElement, scrollProps } = useStickyScrollHeader({
    header: (
      <Flex flex={1} pl={6} pr={4} pt={0.5}>
        <Text variant="sm" numberOfLines={1} style={{ flexShrink: 1 }}>
          Galleries For You
        </Text>
      </Flex>
    ),
  })

  if (!partners.length) {
    return <NoGalleries />
  }

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.galleriesForYou })}
    >
      <Flex>
        <Animated.FlatList
          data={partners}
          ListHeaderComponent={<GalleriesForYouHeader />}
          refreshControl={RefreshControl}
          onEndReached={() => loadNext(GalleriesForYouQueryVariables.count)}
          renderItem={({ item }) => {
            return <PartnerListItem partner={item} />
          }}
          keyExtractor={(item) => item.internalID}
          ItemSeparatorComponent={() => <Spacer y={4} />}
          ListFooterComponent={() => (
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
          {...scrollProps}
        />

        {headerElement}
      </Flex>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

export const GalleriesForYouScreen: React.FC = () => {
  const { location, isLoading } = useLocation()

  if (isLoading) {
    return <GalleriesForYouPlaceholder />
  }

  return (
    <Suspense fallback={<GalleriesForYouPlaceholder />}>
      <GalleriesForYou location={location} />
    </Suspense>
  )
}

const partnersConnectionFragment = graphql`
  fragment GalleriesForYouScreen_partnersConnection on Query
  @refetchable(queryName: "GalleriesForYouRefetchQuery")
  @argumentDefinitions(
    includePartnersNearIpBasedLocation: { type: "Boolean" }
    near: { type: "String" }
    count: { type: "Int", defaultValue: 10 }
    after: { type: "String" }
  ) {
    partnersConnection(
      first: $count
      after: $after
      eligibleForListing: true
      excludeFollowedPartners: true
      includePartnersNearIpBasedLocation: $includePartnersNearIpBasedLocation
      includePartnersWithFollowedArtists: true
      defaultProfilePublic: true
      sort: DISTANCE
      maxDistance: 6371 # Earth radius in km to get all results (https://en.wikipedia.org/wiki/Earth_radius?useskin=vector#Mean_radius)
      near: $near
      type: GALLERY
    ) @connection(key: "GalleriesForYouScreen_partnersConnection") {
      totalCount
      edges {
        node {
          internalID
          ...PartnerListItem_partner
        }
      }
    }
  }
`

export const GalleriesForYouQueryVariables = {
  count: 10,
}

const GalleriesForYouQuery = graphql`
  query GalleriesForYouScreenQuery(
    $includePartnersNearIpBasedLocation: Boolean
    $near: String
    $count: Int
    $after: String
  ) {
    ...GalleriesForYouScreen_partnersConnection
      @arguments(
        includePartnersNearIpBasedLocation: $includePartnersNearIpBasedLocation
        near: $near
        count: $count
        after: $after
      )
  }
`

const GalleriesForYouHeader: React.FC = () => {
  return (
    <Flex mx={2} mb={4} mt={6}>
      <Text variant="lg-display" mb={0.5}>
        Galleries For You
      </Text>
      <Text variant="xs">Find galleries in your area with artists you follow.</Text>
    </Flex>
  )
}

const GalleriesForYouPlaceholder: React.FC = () => {
  const isTablet = isPad()
  const space = useSpace()

  const { width: screenWidth } = useScreenDimensions()

  const width = (isTablet ? MAX_PARTNER_LIST_ITEM_WIDTH : screenWidth) - 2 * space(2)

  return (
    <ProvidePlaceholderContext>
      <Flex testID="PlaceholderGrid">
        <GalleriesForYouHeader />

        <Flex px={2} mx="auto">
          {times(5).map((i) => {
            return (
              <Flex mb={4} key={i}>
                <PlaceholderBox width={width} height={width / 1.33} />
                <Spacer y={1} />
                <PlaceholderBox width={width} height={60} />
              </Flex>
            )
          })}
        </Flex>
      </Flex>
    </ProvidePlaceholderContext>
  )
}

const NoGalleries: React.FC = () => (
  <Flex>
    <GalleriesForYouHeader />

    <Text mx={2}>Sorry, we couldn’t find any results for you.</Text>
  </Flex>
)
