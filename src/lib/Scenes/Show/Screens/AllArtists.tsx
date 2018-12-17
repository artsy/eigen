import { Theme } from "@artsy/palette"
import { AllArtists_show } from "__generated__/AllArtists_show.graphql"
import { ArtistListItem_artist } from "__generated__/ArtistListItem_artist.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { ArtistsGroupedByName } from "lib/Components/ArtistsGroupedByName"
import { get } from "lodash"
import { NavigatorIOS, ViewProperties } from "react-native"

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  show: AllArtists_show
}

interface State {
  data: Array<{
    artists: ArtistListItem_artist[]
    letter: string
  }>
}

export class AllArtists extends React.Component<Props, State> {
  state = {
    data: [],
  }

  componentDidMount() {
    const { show } = this.props
    const artistsGroupedByName = get(show, "artists_grouped_by_name", []) as any

    console.log("artistsGroupedByName", artistsGroupedByName, show)

    this.setState({ data: artistsGroupedByName.map(({ letter, items }, index) => ({ letter, data: items, index })) })
  }

  render() {
    return (
      <Theme>
        <ArtistsGroupedByName data={this.state.data} />
      </Theme>
    )
  }
}

export const AllArtistsContainer = createFragmentContainer(
  AllArtists,
  graphql`
    fragment AllArtists_show on Show {
      artists_grouped_by_name {
        letter
        items {
          ...ArtistListItem_artist
        }
      }
    }
  `
)
