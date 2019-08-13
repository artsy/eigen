import React from "react"
import { Dimensions, Route, View, ViewProperties } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import { fetchQuery, graphql } from "react-relay"

import { ConsignmentsArtistQuery, ConsignmentsArtistQueryResponse } from "__generated__/ConsignmentsArtistQuery.graphql"
import { defaultEnvironment as environment } from "lib/relay/createEnvironment"
import ConsignmentBG from "../Components/ConsignmentBG"
import DoneButton from "../Components/DoneButton"
import { SearchResults } from "../Components/SearchResults"
import { ArtistResult, ConsignmentSetup } from "../index"

interface Props extends ConsignmentSetup, ViewProperties {
  navigator: NavigatorIOS
  route: Route
  updateWithArtist?: (result: ArtistResult) => void
}

interface State {
  query: string
  searching: boolean
  results: ConsignmentsArtistQueryResponse["matchArtist"] | null
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

  artistSelected = (result: ArtistResult) => {
    this.props.updateWithArtist(result)
    this.props.navigator.pop()
  }

  textChanged = async (text: string) => {
    this.setState({ query: text, searching: text.length > 0 })
    this.searchForQuery(text)
  }

  // TODO: Add throttling
  searchForQuery = async (query: string) => {
    const results = await fetchQuery<ConsignmentsArtistQuery>(
      environment,
      graphql`
        query ConsignmentsArtistQuery($query: String!) {
          matchArtist(term: $query) {
            internalID
            name
            image {
              url
            }
          }
        }
      `,
      { query },
      { force: true }
    )
    this.setState({ results: results.matchArtist, searching: false })
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
            <SearchResults
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
