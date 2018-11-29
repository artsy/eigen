import { Box, Sans, Separator, Serif } from "@artsy/palette"
import { AllArtists_show } from "__generated__/AllArtists_show.graphql"
import { AllArtistsFollowArtistMutation } from "__generated__/AllArtistsFollowArtistMutation.graphql"
import { get } from "lodash"
import React from "react"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"

import { NavigatorIOS, SectionList, ViewProperties } from "react-native"
import { ArtistListItem } from "../Components/Artists/Components/ArtistListItem"

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  show: AllArtists_show
  relay: RelayProp
}

interface State {
  isFollowedChanging: { [id: string]: boolean }
  sections: Array<{
    items: any
    letter: string
    index: number
  }>
}

export class AllArtists extends React.Component<Props, State> {
  state = {
    isFollowedChanging: {},
    sections: [],
  }

  handleFollowArtist = ({ id, __id, is_followed }) => {
    const { relay } = this.props
    const { isFollowedChanging } = this.state

    this.setState(
      {
        isFollowedChanging: {
          ...isFollowedChanging,
          [id]: true,
        },
      },
      () => {
        commitMutation<AllArtistsFollowArtistMutation>(relay.environment, {
          onCompleted: () => {
            this.setState({
              isFollowedChanging: {
                ...this.state.isFollowedChanging,
                [id]: false,
              },
            })
          },
          mutation: graphql`
            mutation AllArtistsFollowArtistMutation($input: FollowArtistInput!) {
              followArtist(input: $input) {
                artist {
                  __id
                  is_followed
                }
              }
            }
          `,
          variables: {
            input: {
              artist_id: id,
              unfollow: is_followed,
            },
          },
          optimisticResponse: {
            followArtist: {
              artist: {
                __id,
                is_followed: !is_followed,
              },
            },
          },
          updater: store => {
            store.get(__id).setValue(!is_followed, "is_followed")
          },
        })
      }
    )
  }

  componentDidMount() {
    const { show } = this.props
    const artistsGroupedByName = get(show, "artists_grouped_by_name", []) as any
    // console.log("artistsGroupedByName ", artistsGroupedByName)
    const sections = []

    artistsGroupedByName.forEach((group, index) => {
      sections.push({
        title: group.letter,
        data: group.items,
        index,
      })
    })

    // const groups: AllArtists_show["artists_grouped_by_name"] = artistsGroupedByName

    this.setState({ sections }, () => console.log("this.state.sections", this.state.sections))
  }

  renderItem = artist => {
    const { isFollowedChanging } = this.state
    const { name, id, is_followed, nationality, birthday, deathday } = artist
    const { url } = artist.image

    return (
      <Box mb={2}>
        <ArtistListItem
          name={name}
          nationality={nationality}
          birthday={birthday}
          deathday={deathday}
          isFollowed={is_followed}
          url={url}
          onPress={() => this.handleFollowArtist(artist)}
          isFollowedChanging={isFollowedChanging[id]}
        />
      </Box>
    )
  }

  render() {
    return (
      <SectionList
        renderItem={({ item }) => <Box px={2}>{this.renderItem(item)}</Box>}
        ListHeaderComponent={() => {
          return (
            <Box px={2} mb={2} pt={85}>
              <Serif size="8">All Artists</Serif>
            </Box>
          )
        }}
        renderSectionHeader={({ section: { title } }) => (
          <Box px={2} mb={2}>
            <Sans size="4">{title}</Sans>
          </Box>
        )}
        renderSectionFooter={({ section }) => {
          if (section.index < this.state.sections.length - 1) {
            return (
              <Box px={2} pb={2}>
                <Separator />
              </Box>
            )
          }
        }}
        sections={this.state.sections}
        keyExtractor={(item, index) => item + index}
      />
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
          __id
          id
          name
          is_followed
          nationality
          birthday
          deathday
          image {
            url
          }
        }
      }
    }
  `
)
