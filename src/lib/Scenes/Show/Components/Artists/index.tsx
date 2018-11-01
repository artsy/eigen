import React from "react"
import { Sans, Spacer } from "@artsy/palette"
import { createFragmentContainer, graphql, commitMutation, RelayProp } from "react-relay"
import { Artist_show } from "__generated__/Artist_show.graphql"
import { ArtistsFollowArtistMutation } from "__generated__/ArtistsFollowArtistMutation.graphql"
import { InvertedButton } from "lib/Components/Buttons"
import { ArtistListItem } from "./Components/ArtistListItem"
import { take, get } from "lodash"

interface Props {
  show: Artist_show
  relay: RelayProp
}

interface State {
  isExpanded: boolean
  isFollowedChanging: { [id: string]: boolean }
}

export class Artists extends React.Component<Props, State> {
  state = {
    isExpanded: false,
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
        commitMutation<ArtistsFollowArtistMutation>(relay.environment, {
          onCompleted: () => {
            this.setState({
              isFollowedChanging: {
                ...this.state.isFollowedChanging,
                [id]: false,
              },
            })
          },
          mutation: graphql`
            mutation ArtistsFollowArtistMutation($input: FollowArtistInput!) {
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
              __id: __id,
              is_followed: !is_followed,
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
    const { isExpanded, isFollowedChanging } = this.state
    const { show } = this.props

    const artists = get(show, "artists", [])

    return (
      <>
        <Sans size="5">Artists in this show</Sans>
        <Spacer m={1} />
        {(isExpanded ? artists : take(artists, 4)).map((artist, idx, arr) => {
          const { name, id, is_followed } = artist
          return (
            <React.Fragment key={id}>
              <ArtistListItem
                name={name}
                isFollowed={is_followed}
                onPress={() => this.handleFollowArtist(artist)}
                isFollowedChanging={isFollowedChanging[id]}
              />
              {idx < arr.length - 1 && <Spacer m={1} />}
            </React.Fragment>
          )
        })}
        {!isExpanded && (
          <>
            <Spacer m={1} />
            <InvertedButton
              text={`View all ${artists.length} artists`}
              onPress={() => this.setState({ isExpanded: true })}
            />
          </>
        )}
      </>
    )
  }
}

export const ArtistsContainer = createFragmentContainer(
  Artists,
  graphql`
    fragment Artists_show on Show {
      artists {
        __id
        id
        name
        is_followed
      }
    }
  `
)
