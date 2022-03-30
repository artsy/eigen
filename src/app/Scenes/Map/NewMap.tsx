import MapboxGL from "@react-native-mapbox-gl/maps"
import { Dimensions, StyleSheet, View } from "react-native"
import Config from "react-native-config"
import { ArtsyMapStyleURL } from "./GlobalMap"

MapboxGL.setAccessToken(Config.MAPBOX_API_CLIENT_KEY)

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  container: {
    width: "100%",
    height: Dimensions.get("window").height,
  },
  map: {
    flex: 1,
  },
})

export const NewMapScreen = () => {
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView styleURL={ArtsyMapStyleURL} style={styles.map} compassEnabled={false} />
      </View>
    </View>
  )
}
