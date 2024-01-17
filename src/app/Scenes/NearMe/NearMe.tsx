import { Flex, Screen } from "@artsy/palette-mobile"
import { NearMeQuery } from "__generated__/NearMeQuery.graphql"
import { NearMeList } from "app/Scenes/NearMe/NearMeList"
import { NearMeMap } from "app/Scenes/NearMe/NearMeMap"
import { goBack } from "app/system/navigation/navigate"
import { Location, useLocation } from "app/utils/hooks/useLocation"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { Suspense, useState } from "react"
import { ActivityIndicator } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"

interface NearMeProps {
  location: Location | null
}

export const NearMe: React.FC<NearMeProps> = ({ location }) => {
  const [isMapViewEnabled, setIsMapViewEnabled] = useState(false)

  const queryParams = {
    near: location && `${location?.lat},${location?.lng}`,
    // slug: "new-york-ny-usa",
  }

  const queryData = useLazyLoadQuery<NearMeQuery>(NearMeScreenQuery, {})

  // const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
  // GalleriesForYouScreenQuery,
  // GalleriesForYouScreen_partnersConnection$key
  // >(partnersConnectionFragment, queryData)

  return isMapViewEnabled ? (
    <NearMeMap
      isMapViewEnabled={isMapViewEnabled}
      setIsMapViewEnabled={setIsMapViewEnabled}
      cityQueryData={queryData.city}
    />
  ) : (
    <NearMeList
      isMapViewEnabled={isMapViewEnabled}
      setIsMapViewEnabled={setIsMapViewEnabled}
      cityQueryData={queryData.city}
    />
  )
}

export const NearMeScreen: React.FC = () => {
  const { location, isLoading } = useLocation()

  if (isLoading) {
    return <NearMePlaceholder />
  }

  return (
    <Suspense fallback={<NearMePlaceholder />}>
      <NearMe location={location} />
    </Suspense>
  )
}

const NearMePlaceholder: React.FC = () => {
  return (
    <ProvidePlaceholderContext>
      <Screen testID="PlaceholderGrid">
        <Screen.Header onBack={goBack} />
        <Screen.Body fullwidth>
          <Flex flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator size="large" />
          </Flex>
        </Screen.Body>
      </Screen>
    </ProvidePlaceholderContext>
  )
}

const NearMeScreenQuery = graphql`
  query NearMeQuery {
    # city(near: $near) @optionalField @include(if: $hasLocation) {
    #   ...NearMe_showsConnection
    #   ...NearMe_fairsConnection
    # }
    city(slug: "new-york-ny-usa") {
      ...NearMe_showsConnection
      ...NearMe_fairsConnection
    }
  }
`

export const ShowsConnectionFragment = graphql`
  fragment NearMe_showsConnection on City
  @argumentDefinitions(count: { type: "Int", defaultValue: 100 }, after: { type: "String" }) {
    showsConnection(first: $count, after: $after, status: RUNNING, sort: START_AT_ASC) {
      edges {
        node {
          metaImage {
            url(version: "large")
            aspectRatio
          }
          id
          slug
          name
          location {
            address
            coordinates {
              lat
              lng
            }
          }
        }
      }
    }
  }
`

export const FairsConnectionFragment = graphql`
  fragment NearMe_fairsConnection on City
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, after: { type: "String" }) {
    fairsConnection(first: $count, after: $after, status: RUNNING, sort: START_AT_ASC) {
      edges {
        node {
          id
          slug
          name
        }
      }
    }
  }
`
