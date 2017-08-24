import * as React from "react"

import Search from "../Components/ArtistSearchResults"
import ConsignmentBG from "../Components/ConsignmentBG"
import DoneButton from "../Components/DoneButton"

import { ConsignmentSetup, SearchResult } from "../index"

import { debounce } from "lodash"
import { NavigatorIOS, Route, ScrollView, View, ViewProperties } from "react-native"
import metaphysics from "../../../metaphysics"

import { stringify } from "qs"

import { NativeModules } from "react-native"
const { Emission } = NativeModules

interface ArtistSearchResponse {
  match_artist: SearchResult[]
}

interface Props extends ConsignmentSetup, ViewProperties {
  navigator: NavigatorIOS
  route: Route
  updateWithResult?: (result: SearchResult) => void
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

  locationSelected = (result: SearchResult) => {
    this.props.navigator.pop()
    this.props.updateWithResult(result)
  }

  textChanged = async (text: string) => {
    this.setState({ query: text, searching: text.length > 0 })
    this.searchForQuery(text)
  }

  searchForQuery = async (query: string) => {
    // The 2nd is a throw-away key on a throw-away account
    const apiKey = Emission.googleMapsAPIKey || "AIzaSyBJRIy_zCXQ7XYt9Ubn8bpUIEAxEOKUmx8"
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
    return (
      <ConsignmentBG>
        <DoneButton onPress={this.doneTapped}>
          <View
            style={{ alignContent: "center", justifyContent: "flex-end", flexGrow: 1, marginLeft: 20, marginRight: 20 }}
          >
            <Search
              results={this.state.results}
              query={this.state.query}
              onChangeText={this.textChanged}
              searching={this.state.searching}
              resultSelected={this.locationSelected}
              placeholder="Artist/Designer Name"
              noResultsMessage="Unfortunately we are not accepting consignments for works by"
            />
          </View>
        </DoneButton>
      </ConsignmentBG>
    )
  }
}
