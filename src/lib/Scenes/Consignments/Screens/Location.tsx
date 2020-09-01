import React from "react"
import { SearchResults } from "../Components/SearchResults"

import { LocationIcon } from "palette"
import { Route, View, ViewProperties } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import { ConsignmentSetup, LocationResult } from "../index"

// @ts-ignore STRICTNESS_MIGRATION
import { stringify } from "qs"

import { Theme } from "palette"
import { Dimensions } from "react-native"
import Config from "react-native-config"
import { BottomAlignedButton } from "../Components/BottomAlignedButton"

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
  // @ts-ignore STRICTNESS_MIGRATION
  constructor(props) {
    super(props)
    this.state = {
      // @ts-ignore STRICTNESS_MIGRATION
      query: null,
      searching: false,
      results: null,
    }
  }

  doneTapped = () => {
    this.props.navigator.pop()
  }

  locationSelected = async (result: LocationResult) => {
    const apiKey = Config.GOOGLE_MAPS_API_KEY
    const queryString = stringify({
      key: apiKey,
      placeid: result.id,
    })

    const response = await fetch("https://maps.googleapis.com/maps/api/place/details/json?" + queryString)
    const results = await response.json()

    // TODO: Add dedicated error handling to the maps response

    const { address_components } = results.result
    // @ts-ignore STRICTNESS_MIGRATION
    const cityPlace = address_components.find(comp => comp.types[0] === "locality")
    // @ts-ignore STRICTNESS_MIGRATION
    const statePlace = address_components.find(comp => comp.types[0] === "administrative_area_level_1")
    // @ts-ignore STRICTNESS_MIGRATION
    const countryPlace = address_components.find(comp => comp.types[0] === "country")

    const city = cityPlace && cityPlace.long_name
    const country = countryPlace && countryPlace.long_name
    const state = statePlace && statePlace.long_name

    // @ts-ignore STRICTNESS_MIGRATION
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
    const apiKey = Config.GOOGLE_MAPS_API_KEY
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

  // @ts-ignore STRICTNESS_MIGRATION
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
              LocationIcon={LocationIcon}
              placeholder="City, Country"
              noResultsMessage="Could not find"
            />
          </View>
        </BottomAlignedButton>
      </Theme>
    )
  }
}
