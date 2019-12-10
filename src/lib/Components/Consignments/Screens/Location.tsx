import React from "react"
import { SearchResults } from "../Components/SearchResults"

import { ConsignmentSetup, LocationResult } from "../index"

import { Route, View, ViewProperties } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"

import { stringify } from "qs"

import { Theme } from "@artsy/palette"
import { Dimensions, NativeModules } from "react-native"
import { BottomAlignedButton } from "../Components/BottomAlignedButton"
const { Emission } = NativeModules

interface Props extends ConsignmentSetup, ViewProperties {
  navigator: NavigatorIOS
  route: Route
  updateWithResult?: (city: string, state: string, country: string) => void
}

interface State {
  query: string
  searching: boolean
  results: any | null
}

export default class Location extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      query: null,
      searching: false,
      results: null,
    }
  }

  doneTapped = () => {
    this.props.navigator.pop()
  }

  locationSelected = async (result: LocationResult) => {
    const apiKey = Emission.googleMapsAPIKey
    const queryString = stringify({
      key: apiKey,
      placeid: result.id,
    })

    const response = await fetch("https://maps.googleapis.com/maps/api/place/details/json?" + queryString)
    const results = await response.json()

    // TODO: Add dedicated error handling to the maps response

    const { address_components } = results.result
    const cityPlace = address_components.find(comp => comp.types[0] === "locality")
    const statePlace = address_components.find(comp => comp.types[0] === "administrative_area_level_1")
    const countryPlace = address_components.find(comp => comp.types[0] === "country")

    const city = cityPlace && cityPlace.long_name
    const country = countryPlace && countryPlace.long_name
    const state = statePlace && statePlace.long_name

    this.props.updateWithResult(city, state, country)
    this.props.navigator.pop()
  }

  textChanged = async (text: string) => {
    this.setState({ query: text, searching: text.length > 0 })
    this.searchForQuery(text)
  }

  // https://developers.google.com/places/
  // https://developers.google.com/places/web-service/details
  searchForQuery = async (query: string) => {
    const apiKey = Emission.googleMapsAPIKey
    const queryString = stringify({
      key: apiKey,
      language: "en",
      types: "(cities)",
      input: query,
    })

    const response = await fetch("https://maps.googleapis.com/maps/api/place/autocomplete/json?" + queryString)
    const results = await response.json()

    this.setState({
      results: results.predictions && results.predictions.map(this.predictionToResult),
      searching: false,
    })
  }

  predictionToResult = prediction => ({
    id: prediction.place_id,
    name: prediction.description,
  })

  render() {
    const isPad = Dimensions.get("window").width > 700

    return (
      <Theme>
        <BottomAlignedButton onPress={this.doneTapped} buttonText="Done">
          <View
            style={{
              alignContent: "center",
              justifyContent: isPad ? "center" : "flex-end",
              flexGrow: 1,
              marginLeft: 20,
              marginRight: 20,
            }}
          >
            <SearchResults<LocationResult>
              results={this.state.results}
              query={this.state.query}
              onChangeText={this.textChanged}
              searching={this.state.searching}
              resultSelected={this.locationSelected}
              preImage={require("../../../../../images/consignments/map-pin.png")}
              placeholder="City, Country"
              noResultsMessage="Could not find"
            />
          </View>
        </BottomAlignedButton>
      </Theme>
    )
  }
}
