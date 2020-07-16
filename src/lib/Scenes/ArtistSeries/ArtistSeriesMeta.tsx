import { Box, EntityHeader, Flex, Sans } from "@artsy/palette"
import { ArtistSeriesMeta_artistSeries } from "__generated__/ArtistSeriesMeta_artistSeries.graphql"
import { ArtistSeriesMetaFollowMutation } from "__generated__/ArtistSeriesMetaFollowMutation.graphql"
import { ArtistSeriesQuery } from "__generated__/ArtistSeriesQuery.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { ReadMore } from "lib/Components/ReadMore"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useRef } from "react"
import { TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { commitMutation, createFragmentContainer, graphql, QueryRenderer, RelayProp } from "react-relay"

interface ArtistSeriesMetaProps {
  artistSeries: ArtistSeriesMeta_artistSeries
  relay: RelayProp
}

type ArtistToFollowOrUnfollow = NonNullable<NonNullable<ArtistSeriesMetaProps["artistSeries"]["artists"]>[0]>

export const ArtistSeriesMeta: React.SFC<ArtistSeriesMetaProps> = ({ artistSeries, relay }) => {
  const ref = useRef<View | null>(null)

  const { width } = useScreenDimensions()
  const isIPad = width > 700
  const maxChars = isIPad ? 200 : 120

  const followOrUnfollowArtist = (followArtist: ArtistToFollowOrUnfollow) => {
    return new Promise<void>((resolve, reject) => {
      commitMutation<ArtistSeriesMetaFollowMutation>(relay.environment, {
        mutation: graphql`
          mutation ArtistSeriesMetaFollowMutation($input: FollowArtistInput!) {
            followArtist(input: $input) {
              artist {
                isFollowed
              }
            }
          }
        `,
        variables: {
          input: { artistID: followArtist.internalID, unfollow: followArtist.isFollowed },
        },
        onError: reject,
        onCompleted: (_response, errors) => {
          if (errors && errors.length > 0) {
            reject(new Error(JSON.stringify(errors)))
          } else {
            resolve()
          }
        },
      })
    })
  }

  return (
    <Box ref={ref}>
      <Sans size="8" mt={3} data-test-id="title">
        {artistSeries.title}
      </Sans>
      {(artistSeries?.artists ?? []).length > 0 &&
        artistSeries.artists?.map(
          artist =>
            !!artist?.name && (
              <TouchableOpacity
                key={artist?.id as string}
                onPress={() => {
                  SwitchBoard.presentNavigationViewController(ref.current!, `/artist/${artist.slug}`)
                }}
                style={{ marginVertical: 10 }}
              >
                <EntityHeader
                  smallVariant
                  name={artist?.name}
                  imageUrl={artist?.image?.url as string}
                  FollowButton={
                    <TouchableWithoutFeedback
                      onPress={() => followOrUnfollowArtist(artist)}
                      hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                    >
                      <Sans style={{ textDecorationLine: "underline" }} size="3">
                        {artist.isFollowed ? "Following" : "Follow"}
                      </Sans>
                    </TouchableWithoutFeedback>
                  }
                />
              </TouchableOpacity>
            )
        )}
      <ReadMore data-test-id="description" sans content={artistSeries?.description ?? ""} maxChars={maxChars} />
    </Box>
  )
}

export const ArtistSeriesMetaFragmentContainer = createFragmentContainer(ArtistSeriesMeta, {
  artistSeries: graphql`
    fragment ArtistSeriesMeta_artistSeries on ArtistSeries {
      title
      description
      artists(size: 1) {
        id
        internalID
        name
        slug
        isFollowed
        image {
          url
        }
      }
    }
  `,
})
