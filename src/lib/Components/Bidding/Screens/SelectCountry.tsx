import { Serif } from "@artsy/palette"
import { stringify } from "qs"
import React from "react"
import { ActivityIndicator, NativeModules, ScrollView, TouchableWithoutFeedback } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"

import { Flex } from "../Elements/Flex"

import { BackButton } from "../Components/BackButton"
import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
import { Container } from "../Components/Containers"
import { Input } from "../Components/Input"
import { Title } from "../Components/Title"

import { Country, SearchResult } from "../types"

const { Emission } = NativeModules

interface SelectCountryProps {
  country?: Country
  navigator: NavigatorIOS
  onCountrySelected?: (country: Country) => void
}

interface SelectCountryState {
  query: string
  isLoading: boolean
  results: SearchResult[]
}

// https://developers.google.com/places/
// https://developers.google.com/places/web-service/details
const fetchFromGoogleMaps = async (path: string, queryParams: { [key: string]: string }) => {
  queryParams.key = Emission.googleMapsAPIKey

  const response = await fetch(`https://maps.googleapis.com${path}?${stringify(queryParams)}`)
  return await response.json()
}

export class SelectCountry extends React.Component<SelectCountryProps, SelectCountryState> {
  constructor(props) {
    super(props)

    this.state = {
      query: props.country && props.country.longName,
      isLoading: false,
      results: [],
    }
  }

  locationSelected = async (result: SearchResult) => {
    const results = await fetchFromGoogleMaps("/maps/api/place/details/json", { placeid: result.id })
    const country = results.result.address_components.find(comp => comp.types[0] === "country")

    this.props.onCountrySelected({ longName: country.long_name, shortName: country.short_name } as Country)
    this.props.navigator.pop()
  }

  textChanged = async (text: string) => {
    this.setState({ query: text, isLoading: text.length > 0 })
    this.searchForQuery(text)
  }

  searchForQuery = async (input: string) => {
    const results = await fetchFromGoogleMaps("/maps/api/place/autocomplete/json", {
      language: "en",
      types: "(regions)",
      input,
    })

    const predictions = (results.predictions || [])
      .filter(prediction => prediction.types[0] === "country")
      .map(prediction => ({ id: prediction.place_id, name: prediction.description }))

    this.setState({
      results: predictions,
      isLoading: false,
    })
  }

  componentDidMount() {
    if (this.state.query) {
      this.textChanged(this.state.query)
    }
  }

  render() {
    const { results, isLoading, query } = this.state

    return (
      <BiddingThemeProvider>
        <Flex flex={1}>
          <BackButton navigator={this.props.navigator} />

          <Container mb={0}>
            <Title mt={0}>Select country</Title>

            <Input
              mb={3}
              autoCorrect={false}
              clearButtonMode="while-editing"
              placeholder="Country"
              returnKeyType="search"
              value={query}
              onChangeText={this.textChanged}
              autoFocus={typeof jest === "undefined" /* TODO: https://github.com/facebook/jest/issues/3707 */}
            />

            {!!isLoading && <ActivityIndicator animating={isLoading} />}

            <ScrollView scrollEnabled={results.length > 0} keyboardShouldPersistTaps="always">
              {results.length > 0 && !isLoading
                ? results.map(result => (
                    <TouchableWithoutFeedback key={result.id} onPress={() => this.locationSelected(result)}>
                      <Serif size="4" ml={3} mb={3}>
                        {result.name}
                      </Serif>
                    </TouchableWithoutFeedback>
                  ))
                : query &&
                  !isLoading && (
                    <Serif size="4" ml={3} color="black30">
                      Could not find “{query}
                      .”
                    </Serif>
                  )}
            </ScrollView>
          </Container>
        </Flex>
      </BiddingThemeProvider>
    )
  }
}
