import { OwnerType } from "@artsy/cohesion"
import { Flex, Screen, Spacer, Text, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { GalleriesForYouScreenQuery } from "__generated__/GalleriesForYouScreenQuery.graphql"
import { GalleriesForYouScreen_partnersConnection$key } from "__generated__/GalleriesForYouScreen_partnersConnection.graphql"
import {
  MAX_PARTNER_LIST_ITEM_WIDTH,
  PartnerListItem,
} from "app/Scenes/GalleriesForYou/Components/PartnerListItem"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { Location, useLocation } from "app/utils/hooks/useLocation"
import { PlaceholderBox, ProvidePlaceholderContext } from "app/utils/placeholders"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { times } from "lodash"
import { Suspense, useEffect, useState } from "react"
import { ActivityIndicator } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

interface GalleriesForYouProps {
  location: Location | null
}

export const GalleriesForYou: React.FC<GalleriesForYouProps> = ({ location }) => {
  const visualizeLocation = useDevToggle("DTLocationDetectionVisialiser")

  const queryParams = {
    near: location && `${location?.lat},${location?.lng}`,
    includePartnersNearIpBasedLocation: !location,
    includePartnersWithFollowedArtists: true,
  }

  const queryData = useLazyLoadQuery<GalleriesForYouScreenQuery>(GalleriesForYouQuery, queryParams)

  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
    GalleriesForYouScreenQuery,
    GalleriesForYouScreen_partnersConnection$key
  >(partnersConnectionFragment, queryData)

  const ipLocation = queryData.requestLocation?.coordinates

  const userLocation = location || { lat: ipLocation?.lat!, lng: ipLocation?.lng! }

  const RefreshControl = useRefreshControl(refetch)

  const partners = extractNodes(data.partnersConnection)

  // Refetch in case the user doesn't follow artists and there are no results
  // This will show results even in case the user doesn't follow any artists
  const [hasRefetched, setHasRefetched] = useState(false)

  useEffect(() => {
    if (partners.length || hasRefetched) return

    refetch({
      ...queryParams,
      includePartnersWithFollowedArtists: false,
    })

    setHasRefetched(true)
  }, [partners])

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.galleriesForYou })}
    >
      <Screen>
        <Screen.AnimatedHeader title="Galleries for You" onBack={goBack} />
        <Screen.Body fullwidth>
          {!!visualizeLocation && (
            <Text ml={6} color="red">
              Location: {location ? JSON.stringify(location) : "Using IP-based location"}
            </Text>
          )}

          <Screen.FlatList
            data={partners}
            ListHeaderComponent={<GalleriesForYouHeader />}
            refreshControl={RefreshControl}
            onEndReached={() => loadNext(GalleriesForYouQueryVariables.count)}
            renderItem={({ item }) => {
              return <PartnerListItem partner={item} userLocation={userLocation} />
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
            ListEmptyComponent={() => <NoGalleries />}
          />
        </Screen.Body>
      </Screen>
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
    includePartnersWithFollowedArtists: { type: "Boolean" }
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
      includePartnersWithFollowedArtists: $includePartnersWithFollowedArtists
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

export const GalleriesForYouQuery = graphql`
  query GalleriesForYouScreenQuery(
    $includePartnersNearIpBasedLocation: Boolean!
    $includePartnersWithFollowedArtists: Boolean
    $near: String
    $count: Int
    $after: String
  ) {
    requestLocation @optionalField @include(if: $includePartnersNearIpBasedLocation) {
      coordinates {
        lat
        lng
      }
    }
    ...GalleriesForYouScreen_partnersConnection
      @arguments(
        includePartnersNearIpBasedLocation: $includePartnersNearIpBasedLocation
        includePartnersWithFollowedArtists: $includePartnersWithFollowedArtists
        near: $near
        count: $count
        after: $after
      )
  }
`

const GalleriesForYouHeader: React.FC = () => {
  return (
    <Flex mx={2} mb={4}>
      <Text variant="lg-display" mb={0.5}>
        Galleries for You
      </Text>
      <Text variant="xs">Find galleries in your area with artists you follow.</Text>
    </Flex>
  )
}

const GalleriesForYouPlaceholder: React.FC = () => {
  const space = useSpace()

  const { width: screenWidth } = useScreenDimensions()

  const width = (isTablet() ? MAX_PARTNER_LIST_ITEM_WIDTH : screenWidth) - 2 * space(2)

  return (
    <ProvidePlaceholderContext>
      <Screen testID="PlaceholderGrid">
        <Screen.Header onBack={goBack} />
        <Screen.Body fullwidth>
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
        </Screen.Body>
      </Screen>
    </ProvidePlaceholderContext>
  )
}

const NoGalleries: React.FC = () => <Text mx={2}>Sorry, we couldn’t find any results for you.</Text>
