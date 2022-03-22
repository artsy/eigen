import { SearchResults } from "../Components/SearchResults"

import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { LocationIcon } from "palette"
import { View, ViewProps } from "react-native"
import { ConsignmentSetup, LocationResult } from "../index"

import { stringify } from "qs"

import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Dimensions } from "react-native"
import Config from "react-native-config"
import { BottomAlignedButton } from "../Components/BottomAlignedButton"

interface Props extends ConsignmentSetup, ViewProps {
  navigator: NavigatorIOS
  updateWithResult?: (city: string, state: string, country: string) => void
}

interface State {
  query: string
  searching: boolean
  results: any | null
}

export default class Location extends React.Component<Props, State> {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  constructor(props) {
    super(props)
    this.state = {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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

    const response = await fetch(
      "https://maps.googleapis.com/maps/api/place/details/json?" + queryString
    )
    const results = await response.json()

    // TODO: Add dedicated error handling to the maps response

    const { address_components } = results.result
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const cityPlace = address_components.find((comp) => comp.types[0] === "locality")
    const statePlace = address_components.find(
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      (comp) => comp.types[0] === "administrative_area_level_1"
    )
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const countryPlace = address_components.find((comp) => comp.types[0] === "country")

    const city = cityPlace && cityPlace.long_name
    const country = countryPlace && countryPlace.long_name
    const state = statePlace && statePlace.long_name

    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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

    const response = await fetch(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json?" + queryString
    )
    const results = await response.json()

    this.setState({
      results: results.predictions && results.predictions.map(this.predictionToResult),
      searching: false,
    })
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  predictionToResult = (prediction) => ({
    id: prediction.place_id,
    name: prediction.description,
  })

  render() {
    const isPad = Dimensions.get("window").width > 700

    return (
      <BottomAlignedButton onPress={this.doneTapped} buttonText="Done">
        <FancyModalHeader onLeftButtonPress={this.doneTapped}>Location</FancyModalHeader>
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
    )
  }
}
