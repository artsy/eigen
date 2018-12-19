import { Flex } from "@artsy/palette"
import Mapbox from "@mapbox/react-native-mapbox-gl"
import { LocationMap_location } from "__generated__/LocationMap_location.graphql"
import React from "react"
import { NativeModules } from "react-native"
import styled from "styled-components/native"
import { FiltersBar } from "./Components/FiltersBar"
const Emission = NativeModules.Emission || {}

Mapbox.setAccessToken(Emission.mapBoxAPIClientKey)

const Map = styled(Mapbox.MapView)`
  height: 100%;
`

export enum PartnerType {
  gallery = "Gallery",
  museum = "Museum",
  fair = "Fair",
}

interface Props {
  location: LocationMap_location
  partnerType: PartnerType
  partnerName?: string
}

export class GlobalMap extends React.Component<Props> {
  render() {
    const { lat, lng } = { lat: 40.770424, lng: -73.981233 }

    return (
      <Flex mb={0.5}>
        <FiltersBar tabs={["All", "Saved", "Fairs", "Galleries", "Museums"]} />
        <Map
          key={lng}
          styleURL={Mapbox.StyleURL.Light}
          centerCoordinate={[lng, lat]}
          zoomLevel={14}
          logoEnabled={false}
          scrollEnabled={false}
          attributionEnabled={false}
        />
      </Flex>
    )
  }
}
