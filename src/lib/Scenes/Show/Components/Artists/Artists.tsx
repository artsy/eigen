import { Sans, Serif, Spacer } from "@artsy/palette"
import { Artists_show } from "__generated__/Artists_show.graphql"
import { ArtistListItemContainer as ArtistListItem } from "lib/Components/ArtistListItem"
import { get, take } from "lodash"
import React from "react"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  show: Artists_show
  onViewAllArtistsPressed: () => void
}

export const Artists: React.SFC<Props> = ({ show, onViewAllArtistsPressed }) => {
  const artistsShown = 5

  const artists = get(show, "artists", [])
  const items: Artists_show["artists"] = take(artists, artistsShown)

  return (
    <>
      <Serif size="5">Artists</Serif>
      <Spacer m={1} />
      {items.map((artist, idx, arr) => {
        return (
          <React.Fragment key={artist.id}>
            <ArtistListItem artist={artist} />
            {idx < arr.length - 1 && <Spacer m={1} />}
          </React.Fragment>
        )
      })}
      {artists.length > artistsShown && (
        <>
          <Spacer m={1} />
          <TouchableOpacity onPress={() => onViewAllArtistsPressed()}>
            <Sans size="3" my={2} weight="medium">
              View all artists
            </Sans>
          </TouchableOpacity>
        </>
      )}
    </>
  )
}

export const ArtistsContainer = createFragmentContainer(
  Artists,
  graphql`
    fragment Artists_show on Show {
      artists {
        id
        ...ArtistListItem_artist
      }
    }
  `
)
