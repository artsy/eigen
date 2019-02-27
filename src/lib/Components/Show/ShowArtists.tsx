import { Theme } from "@artsy/palette"
import { ArtistListItem_artist } from "__generated__/ArtistListItem_artist.graphql"
import { ShowArtists_show } from "__generated__/ShowArtists_show.graphql"
import { ArtistsGroupedByName } from "lib/Components/ArtistsGroupedByName"
import { PAGE_SIZE } from "lib/data/constants"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { groupBy, map, sortBy, toPairs } from "lodash"
import React from "react"
import { ViewProperties } from "react-native"
import { createFragmentContainer, graphql, RelayPaginationProp } from "react-relay"

interface Props extends ViewProperties {
  show: ShowArtists_show
  relay: RelayPaginationProp
}

interface State {
  groupedArtists: Array<{
    artists: ArtistListItem_artist[]
    letter: string
    index: number
  }>
}

export class ShowArtists extends React.Component<Props, State> {
  state = {
    groupedArtists: [],
  }

  componentDidMount() {
    const {
      show: { artists_grouped_by_name },
    } = this.props

    this.groupArtists(artists_grouped_by_name)
    // const artistsGroupedByName = get(show, "artists_grouped_by_name", []) as any

    // this.setState({ groupedArtists: artistsGroupedByName.map(({ letter, items }, index) => ({ letter, data: items, index })) })
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

  componentWillReceiveProps(nextProps) {
    const {
      show: { artists_grouped_by_name },
    } = this.props
    const {
      show: { artists_grouped_by_name: nextArtists },
    } = nextProps
    if (nextArtists !== artists_grouped_by_name) {
      this.groupArtists(nextArtists)
    }
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

  handleViewArtist = (context, href, _slug, _id) => {
    SwitchBoard.presentNavigationViewController(context, href)
  }

  render() {
    return (
      <Theme>
        <ArtistsGroupedByName
          viewArtist={this.handleViewArtist}
          data={this.state.data}
          onEndReached={this.fetchNextPage}
          Component={this}
        />
      </Theme>
    )
  }
}

export const ShowArtistsContainer = createFragmentContainer(
  ShowArtists,
  graphql`
    fragment ShowArtists_show on Show {
      artists_grouped_by_name {
        letter
        items {
          ...ArtistListItem_artist
          sortable_id
          href
          _id
          id
        }
      }
    }
  `
)
