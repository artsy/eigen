import React from "react"

import ConsignmentBG from "../Components/ConsignmentBG"
import DoneButton from "../Components/DoneButton"
import ArtistSearch from "../Components/SearchResults"

import { ConsignmentSetup, SearchResult } from "../index"

import { Dimensions, Route, View, ViewProperties } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import metaphysics from "../../../metaphysics"

interface ArtistSearchResponse {
  match_artist: SearchResult[]
}

interface Props extends ConsignmentSetup, ViewProperties {
  navigator: NavigatorIOS
  route: Route
  updateWithArtist?: (result: SearchResult) => void
}

interface State {
  query: string
  searching: boolean
  results: any | null
}

export default class Artist extends React.Component<Props, State> {
  constructor(props: Props) {
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

  artistSelected = (result: SearchResult) => {
    this.props.updateWithArtist(result)
    this.props.navigator.pop()
  }

  textChanged = async (text: string) => {
    this.setState({ query: text, searching: text.length > 0 })
    this.searchForQuery(text)
  }

  searchForQuery = async (query: string) => {
    const results = await metaphysics<ArtistSearchResponse>(`
      {
        match_artist(term: "${query}") {
          internalID
          name
          image {
            url
          }
        }
      }
    `)
    this.setState({ results: results.match_artist, searching: false })
  }

  render() {
    const isPad = Dimensions.get("window").width > 700

    return (
      <ConsignmentBG>
        <DoneButton onPress={this.doneTapped}>
          <View
            style={{
              alignContent: "center",
              justifyContent: isPad ? "center" : "flex-end",
              flexGrow: 1,
              marginLeft: 20,
              marginRight: 20,
            }}
          >
            <ArtistSearch
              results={this.state.results}
              query={this.state.query}
              placeholder="Artist/Designer Name"
              noResultsMessage="Unfortunately we are not accepting consignments for works by"
              onChangeText={this.textChanged}
              searching={this.state.searching}
              resultSelected={this.artistSelected}
            />
          </View>
        </DoneButton>
      </ConsignmentBG>
    )
  }
}
