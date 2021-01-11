import { Serif } from "palette"
import { stringify } from "qs"
import React from "react"
import { ActivityIndicator, ScrollView, TouchableWithoutFeedback } from "react-native"
import Config from "react-native-config"
import { Flex } from "../Elements/Flex"

import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
import { Container } from "../Components/Containers"
import { Input } from "../Components/Input"
import { Title } from "../Components/Title"

import { StackScreenProps } from "@react-navigation/stack"
import { BidFlowStackProps } from "lib/Containers/BidFlow"
import { isPad } from "lib/utils/hardware"
import { Image } from "../Elements/Image"
import { Country, SearchResult } from "../types"

export interface SelectCountryParamProps {
  country?: Country
  onCountrySelected?: (country: Country) => void
}
interface SelectCountryProps extends StackScreenProps<BidFlowStackProps, "SelectCountryScreen"> {}

interface SelectCountryState {
  query?: string
  isLoading: boolean
  results: SearchResult[]
}

// https://developers.google.com/places/
// https://developers.google.com/places/web-service/details
const fetchFromGoogleMaps = async (path: string, queryParams: { [key: string]: string }) => {
  queryParams.key = Config.GOOGLE_MAPS_API_KEY

  const response = await fetch(`https://maps.googleapis.com${path}?${stringify(queryParams)}`)
  return await response.json()
}

export class SelectCountry extends React.Component<SelectCountryProps, SelectCountryState> {
  constructor(props: SelectCountryProps) {
    super(props)

    this.state = {
      query: props.route.params.country?.longName,
      isLoading: false,
      results: [],
    }
  }

  locationSelected = async (result: SearchResult) => {
    const results = await fetchFromGoogleMaps("/maps/api/place/details/json", { placeid: result.id })
    const country = results.result.address_components.find(
      (comp: any /* STRICTNESS_MIGRATION */) => comp.types[0] === "country"
    )

    this.props.route.params.onCountrySelected?.({
      longName: country.long_name,
      shortName: country.short_name,
    } as Country)
    this.props.navigation.goBack()
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
      .filter((prediction: any /* STRICTNESS_MIGRATION */) => prediction.types[0] === "country")
      .map((prediction: any /* STRICTNESS_MIGRATION */) => ({ id: prediction.place_id, name: prediction.description }))

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
          <TouchableWithoutFeedback onPress={this.props.navigation.goBack}>
            <Image
              position="absolute"
              top={isPad() ? "10px" : "14px"}
              left={isPad() ? "20px" : "10px"}
              source={require("../../../../../images/angle-left.png")}
              style={{ zIndex: 10 }} // Here the style prop is intentionally used to avoid making zIndex too handy.
            />
          </TouchableWithoutFeedback>

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
                ? results.map((result) => (
                    <TouchableWithoutFeedback key={result.id} onPress={() => this.locationSelected(result)}>
                      <Serif size="4" ml={3} mb={3}>
                        {result.name}
                      </Serif>
                    </TouchableWithoutFeedback>
                  ))
                : !!query &&
                  !isLoading && (
                    <Serif size="4" ml={3} color="black30">
                      Could not find “{query}.”
                    </Serif>
                  )}
            </ScrollView>
          </Container>
        </Flex>
      </BiddingThemeProvider>
    )
  }
}
