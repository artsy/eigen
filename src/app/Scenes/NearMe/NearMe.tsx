import { Flex, Screen } from "@artsy/palette-mobile"
import { NearMeQuery } from "__generated__/NearMeQuery.graphql"
import { CitiesFilterModal } from "app/Scenes/NearMe/CitiesFilterModal"
import { NearMeList } from "app/Scenes/NearMe/NearMeList"
import { NearMeMap } from "app/Scenes/NearMe/NearMeMap"
import { goBack } from "app/system/navigation/navigate"
import { Location, useLocation } from "app/utils/hooks/useLocation"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { isEmpty } from "lodash"
import { Suspense, useState } from "react"
import { ActivityIndicator } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"

interface NearMeProps {
  location: Location | null
}

const NearMe: React.FC<NearMeProps> = ({ location }) => {
  const [isMapViewEnabled, setIsMapViewEnabled] = useState(false)
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)
  const hasLocation = !!location && !isEmpty(location)
  const [selectedCitySlug, setSelectedCitySlug] = useState<string | null>("berlin-germany")

  const queryParams = hasLocation
    ? {
        near: {
          lat: location.lat,
          lng: location.lng,
        },
      }
    : { slug: selectedCitySlug }

  const queryData = useLazyLoadQuery<NearMeQuery>(NearMeScreenQuery, queryParams)

  return (
    <>
      {isMapViewEnabled ? (
        <NearMeMap
          isMapViewEnabled={isMapViewEnabled}
          setIsMapViewEnabled={setIsMapViewEnabled}
          cityQueryData={queryData}
        />
      ) : (
        <NearMeList
          setIsFilterModalVisible={setIsFilterModalVisible}
          isMapViewEnabled={isMapViewEnabled}
          setIsMapViewEnabled={setIsMapViewEnabled}
          cityQueryData={queryData}
          setSelectedCitySlug={setSelectedCitySlug}
        />
      )}
      {!!isFilterModalVisible && (
        <CitiesFilterModal
          setIsFilterModalVisible={setIsFilterModalVisible}
          queryData={queryData}
        />
      )}
    </>
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
  query NearMeQuery($near: Near, $slug: String) {
    # We can use this as a fallback if we don't have location permissions from the app
    # requestLocation @optionalField @include(if: $hasNoLocation) {
    #   coordinates {
    #     lat
    #     lng
    #   }
    # }
    ...CitiesFilterModalFragment
    ...NearMe_showsConnection
    ...NearMe_fairsConnection
  }
`

export const ShowsConnectionFragment = graphql`
  fragment NearMe_showsConnection on Query
  @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, after: { type: "String" }) {
    city(slug: $slug, near: $near) {
      coordinates {
        lat
        lng
      }
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
  }
`

export const FairsConnectionFragment = graphql`
  fragment NearMe_fairsConnection on Query
  @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, after: { type: "String" }) {
    city(slug: $slug, near: $near) {
      coordinates {
        lat
        lng
      }
      fairsConnection(
        first: $count
        after: $after
        status: RUNNING_AND_UPCOMING
        sort: START_AT_ASC
      ) {
        edges {
          node {
            image {
              imageURL
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
  }
`
