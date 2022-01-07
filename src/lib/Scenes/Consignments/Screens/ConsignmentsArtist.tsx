import { ConsignmentsArtistQuery } from "__generated__/ConsignmentsArtistQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { defaultEnvironment as environment } from "lib/relay/createEnvironment"
import NavigatorIOS from "lib/utils/__legacy_do_not_use__navigator-ios-shim"
import { extractNodes } from "lib/utils/extractNodes"
import { throttle } from "lodash"
import React from "react"
import { Dimensions, View, ViewProps } from "react-native"
import { fetchQuery, graphql } from "react-relay"
import { BottomAlignedButton } from "../Components/BottomAlignedButton"
import { SearchResults } from "../Components/SearchResults"
import { ArtistResult, ConsignmentSetup } from "../index"

interface Props extends ConsignmentSetup, ViewProps {
  navigator: NavigatorIOS
  updateWithArtist?: (result: ArtistResult) => void
}

interface State {
  query: string | null
  searching: boolean
  results: ArtistResult[] | null
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
    this.props.updateWithArtist?.(result)
    this.props.navigator.pop()
  }

  textChanged = (text: string) => {
    this.setState({ query: text.trimLeft(), searching: text.length > 0 })
    this.searchForQuery(text)
  }

  // tslint:disable:member-ordering
  searchForQuery = throttle(async (query: string) => {
    const data = await fetchQuery<ConsignmentsArtistQuery>(
      environment,
      graphql`
        query ConsignmentsArtistQuery($query: String!) {
          searchConnection(query: $query, first: 30, entities: [ARTIST], mode: AUTOSUGGEST) {
            edges {
              node {
                ... on Artist {
                  internalID
                  name
                  image {
                    url
                  }
                  targetSupply {
                    isTargetSupply
                  }
                }
              }
            }
          }
        }
      `,
      { query },
      {
        fetchPolicy: "network-only",
      }
    ).toPromise()
    const results = extractNodes(data?.searchConnection) as ArtistResult[]
    this.setState({ results, searching: false })
  }, 1000)

  filteredResults = () => {
    // filter for artists that are marked as target supply
    return this.state.results?.filter((artist) => artist.targetSupply?.isTargetSupply) || null
  }

  render() {
    const isPad = Dimensions.get("window").width > 700

    return (
      <BottomAlignedButton onPress={this.doneTapped} buttonText="Done">
        <FancyModalHeader onLeftButtonPress={this.doneTapped}>Artist name</FancyModalHeader>
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
            results={this.filteredResults()}
            query={this.state.query}
            placeholder="Artist/Designer Name"
            noResultsMessage="Unfortunately we are not accepting consignments for works by"
            onChangeText={this.textChanged}
            searching={this.state.searching}
            resultSelected={this.artistSelected}
          />
        </View>
      </BottomAlignedButton>
    )
  }
}
