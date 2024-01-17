import { Screen, Text } from "@artsy/palette-mobile"
import { NearMeQuery$data } from "__generated__/NearMeQuery.graphql"
import { NearMe_showsConnection$key } from "__generated__/NearMe_showsConnection.graphql"
import { ShowsConnectionFragment } from "app/Scenes/NearMe/NearMe"
import { goBack, navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { TouchableOpacity } from "react-native"
import MapView, { Callout, Marker } from "react-native-maps"
import { useFragment } from "react-relay"

interface NearMeMapProps {
  isMapViewEnabled: boolean
  setIsMapViewEnabled: (isMapViewEnabled: boolean) => void
  cityQueryData: NearMeQuery$data["city"]
}

export const NearMeMap: React.FC<NearMeMapProps> = ({
  isMapViewEnabled,
  setIsMapViewEnabled,
  cityQueryData,
}) => {
  const data = useFragment<NearMe_showsConnection$key>(ShowsConnectionFragment, cityQueryData)

  const shows = extractNodes(data?.showsConnection)
  const hasShows = shows.length > 0

  return (
    <Screen>
      <Screen.Header
        title="Map"
        rightElements={
          isMapViewEnabled ? (
            <TouchableOpacity onPress={() => setIsMapViewEnabled(false)}>
              <Text>List</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setIsMapViewEnabled(true)}>
              <Text>Map</Text>
            </TouchableOpacity>
          )
        }
        onBack={goBack}
      />
      <Screen.Body fullwidth>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 52.52, // Berlin latitude
            longitude: 13.405, // Berlin longitude
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation
        >
          {!!hasShows &&
            shows.map((show) => (
              <Marker
                key={show?.id}
                coordinate={{
                  latitude: show?.location?.coordinates?.lat ?? 0,
                  longitude: show?.location?.coordinates?.lng ?? 0,
                }}
              >
                <Callout onPress={() => navigate(`/show/${show?.slug}`)}>
                  <Text>{show?.name}</Text>
                  <Text>{show?.location?.address}</Text>
                </Callout>
              </Marker>
            ))}
        </MapView>
      </Screen.Body>
    </Screen>
  )
}
