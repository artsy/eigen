import { ShowArtistsPreview_show } from "__generated__/ShowArtistsPreview_show.graphql"
import { ArtistListItemContainer as ArtistListItem } from "app/Components/ArtistListItem"
import { CaretButton } from "app/Components/Buttons/CaretButton"
import { navigate } from "app/navigation/navigate"
import { get } from "app/utils/get"
import { Schema, Track, track as _track } from "app/utils/track"
import { compact, take } from "lodash"
import { Sans, Spacer } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  show: ShowArtistsPreview_show
  onViewAllArtistsPressed: () => void
  Component?: any
}

const track: Track<Props> = _track

@track()
export class ShowArtistsPreview extends React.Component<Props> {
  @track((_props, _state, args) => {
    const [, id, internalID] = args
    return {
      action_name: Schema.ActionNames.ArtistName,
      action_type: Schema.ActionTypes.Tap,
      owner_id: internalID,
      owner_slug: id,
      owner_type: Schema.OwnerEntityTypes.Artist,
    } as any
  })
  handlePress(url: string, _slug: string, _internalID: string) {
    navigate(url)
  }

  render() {
    const { show, onViewAllArtistsPressed, Component } = this.props
    const artistsShown = 5
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const artists = get(show, (s) => s.artists, []).concat(
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      get(show, (s) => s.artists_without_artworks, [])
    )
    const items = compact(take(artists, artistsShown))

    return (
      <>
        <Sans size="4t">Artists</Sans>
        <Spacer m={1} />
        {items.map((artist, idx, arr) => {
          const { id } = artist
          return (
            <React.Fragment key={id}>
              <ArtistListItem artist={artist} Component={Component} />
              {idx < arr.length - 1 && <Spacer m={1} />}
            </React.Fragment>
          )
        })}
        {artists.length > artistsShown && (
          <>
            <Spacer m={1} />
            <CaretButton
              text={`View all ${artists.length} artists`}
              onPress={() => onViewAllArtistsPressed()}
            />
          </>
        )}
      </>
    )
  }
}

export const ShowArtistsPreviewContainer = createFragmentContainer(ShowArtistsPreview, {
  show: graphql`
    fragment ShowArtistsPreview_show on Show {
      internalID
      slug
      artists {
        id
        internalID
        slug
        href
        ...ArtistListItem_artist
      }
      artists_without_artworks: artistsWithoutArtworks {
        id
        internalID
        slug
        href
        ...ArtistListItem_artist
      }
    }
  `,
})
