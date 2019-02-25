import { Theme } from "@artsy/palette"
import { ArtistListItem_artist } from "__generated__/ArtistListItem_artist.graphql"
import { FairArtists_fair } from "__generated__/FairArtists_fair.graphql"
import { FairArtistsRendererQuery } from "__generated__/FairArtistsRendererQuery.graphql"
import { ArtistsGroupedByName } from "lib/Components/ArtistsGroupedByName"
import { PAGE_SIZE } from "lib/data/constants"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema, screenTrack, track } from "lib/utils/track"
import { groupBy, map, sortBy, toPairs } from "lodash"
import React from "react"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { defaultEnvironment } from "../../../relay/createEnvironment"
import renderWithLoadProgress from "../../../utils/renderWithLoadProgress"

interface Props {
  fair: FairArtists_fair
  relay: RelayPaginationProp
}

interface State {
  groupedArtists: Array<{
    data: ArtistListItem_artist[]
    letter: string
    index: number
  }>
}

@screenTrack<Props>(props => ({
  context_screen: Schema.PageNames.FairAllArtistsPage,
  context_screen_owner_type: Schema.OwnerEntityTypes.Fair,
  context_screen_owner_slug: props.fair.id,
  context_screen_owner_id: props.fair._id,
}))
export class FairArtists extends React.Component<Props, State> {
  state = {
    groupedArtists: [],
  }

  componentDidMount() {
    const {
      fair: { artists },
    } = this.props
    this.groupArtists(artists.edges.map(edge => edge.node))
  }

  componentWillReceiveProps(nextProps) {
    const {
      fair: { artists },
    } = this.props
    const {
      fair: { artists: nextArtists },
    } = nextProps
    if (nextArtists !== artists) {
      this.groupArtists(nextArtists.edges.map(edge => edge.node))
    }
  }

  groupArtists = artists => {
    const artistsNamePairs = toPairs(groupBy(artists, ({ sortable_id }) => sortable_id.charAt(0)))
    // artists should be sorted, but re-sort to make sure we display in A-Z
    const groupedArtists: any = sortBy(
      map(artistsNamePairs, ([letter, artistsForLetter], index) => ({
        data: artistsForLetter,
        letter: letter.toUpperCase(),
        index,
      })),
      ({ letter }) => letter
    )
    this.setState({ groupedArtists })
  }

  fetchNextPage = () => {
    const { relay } = this.props
    if (!relay.hasMore() || relay.isLoading()) {
      return
    }
    relay.loadMore(PAGE_SIZE, _error => {
      // FIXME: Handle error?
    })
  }

  @track((__, _, args) => {
    const slug = args[2]
    const id = args[3]
    return {
      action_name: Schema.ActionNames.ListArtist,
      action_type: Schema.ActionTypes.Tap,
      owner_id: id,
      owner_slug: slug,
      owner_type: Schema.OwnerEntityTypes.Artist,
    } as any
  })
  handleViewArtist(context, href, _slug, _id) {
    SwitchBoard.presentNavigationViewController(context, href)
  }

  render() {
    const { groupedArtists } = this.state
    return (
      <Theme>
        <ArtistsGroupedByName
          viewArtist={this.handleViewArtist.bind(this)}
          data={groupedArtists}
          onEndReached={this.fetchNextPage}
          Component={this}
        />
      </Theme>
    )
  }
}

export const FairArtistsContainer = createPaginationContainer(
  FairArtists,
  {
    fair: graphql`
      fragment FairArtists_fair on Fair
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        id
        _id
        artists(first: $count, after: $cursor) @connection(key: "Fair_artists") {
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
          edges {
            cursor
            node {
              ...ArtistListItem_artist
              sortable_id
              href
              _id
              id
            }
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.fair && props.fair.artists
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        id: props.fair.id,
        count,
        cursor,
      }
    },
    query: graphql`
      query FairArtistsQuery($id: String!, $count: Int!, $cursor: String) {
        fair(id: $id) {
          ...FairArtists_fair @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

export const FairArtistsRenderer: React.SFC<{ fairID: string }> = ({ fairID }) => (
  <QueryRenderer<FairArtistsRendererQuery>
    environment={defaultEnvironment}
    query={graphql`
      query FairArtistsRendererQuery($fairID: String!) {
        fair(id: $fairID) {
          ...FairArtists_fair
        }
      }
    `}
    variables={{ fairID }}
    render={renderWithLoadProgress(FairArtistsContainer)}
  />
)
