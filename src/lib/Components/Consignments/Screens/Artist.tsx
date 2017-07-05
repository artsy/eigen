import * as React from "react"

import ArtistSearch from "../Components/ArtistSearchResults"
import DoneButton from "../Components/BottomAlignedButton"
import ConsignmentBG from "../Components/ConsignmentBG"

import { ArtistResult, ConsignmentSetup } from "../index"

import { debounce } from "lodash"
import { NavigatorIOS, Route, ScrollView, View, ViewProperties } from "react-native"
import metaphysics from "../../../metaphysics"

interface ArtistSearchResponse {
  match_artist: ArtistResult[]
}

interface Props extends ConsignmentSetup {
  navigator: NavigatorIOS
  route: Route
  updateWithResult?: (result: ArtistResult) => void
}

interface State {
  query: string
  searching: boolean
  results: any | null
}

export default class Artist extends React.Component<Props, State> {
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

  artistSelected = (result: ArtistResult) => {
    this.props.navigator.pop()
    this.props.updateWithResult(result)
  }

  textChanged = async (text: string) => {
    this.setState({ query: text, searching: text.length > 0 })
    this.searchForQuery(text)
  }

  searchForQuery = async (query: string) => {
    const results = await metaphysics<ArtistSearchResponse>(`
      {
        match_artist(term: "${query}") {
          id
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
    // This might become a higher order component for reuse, if used more elsewhere
    const doneButtonStyles = {
      backgroundColor: "black",
      marginBottom: 20,
      paddingTop: 18,
      height: 56,
    }

    return (
      <ConsignmentBG>
        <DoneButton onPress={this.doneTapped} bodyStyle={doneButtonStyles} buttonText="DONE">
          <View
            style={{ alignContent: "center", justifyContent: "flex-end", flexGrow: 1, marginLeft: 20, marginRight: 20 }}
          >
            <ArtistSearch
              results={this.state.results}
              query={this.state.query}
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
