import { Serif, Spacer } from "@artsy/palette"
import { AllArtists_show } from "__generated__/AllArtists_show.graphql"
import { AllArtistsFollowArtistMutation } from "__generated__/AllArtistsFollowArtistMutation.graphql"
import { get } from "lodash"
import React from "react"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"

import { NavigatorIOS, ViewProperties } from "react-native"
import { ArtistListItem } from "../Components/Artists/Components/ArtistListItem"

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  show: AllArtists_show
  relay: RelayProp
}

interface State {
  isFollowedChanging: { [id: string]: boolean }
}

export class AllArtists extends React.Component<Props, State> {
  state = {
    isFollowedChanging: {},
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

  render() {
    const { isFollowedChanging } = this.state
    const { show } = this.props

    const artists = get(show, "artists", [])
    const items: AllArtists_show["artists"] = artists

    return (
      <>
        <Serif size="8">All Artists</Serif>
        <Spacer m={1} />
        {items.map((artist, idx, arr) => {
          const { name, id, is_followed, nationality, birthday, deathday } = artist
          const { url } = artist.image
          return (
            <React.Fragment key={id}>
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
              {idx < arr.length - 1 && <Spacer m={1} />}
            </React.Fragment>
          )
        })}
      </>
    )
  }
}

export const AllArtistsContainer = createFragmentContainer(
  AllArtists,
  graphql`
    fragment AllArtists_show on Show {
      artists {
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
  `
)
