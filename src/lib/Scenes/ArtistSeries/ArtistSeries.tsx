import { Box, EntityHeader, Flex, Sans } from "@artsy/palette"
import { ArtistSeries_artistSeries } from "__generated__/ArtistSeries_artistSeries.graphql"
import { ArtistSeriesFollowMutation } from "__generated__/ArtistSeriesFollowMutation.graphql"
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

interface ArtistSeriesProps {
  artistSeries: ArtistSeries_artistSeries
  relay: RelayProp
}

type ArtistToFollowOrUnfollow = NonNullable<NonNullable<ArtistSeriesProps["artistSeries"]["artists"]>[0]>

export const ArtistSeries: React.FC<ArtistSeriesProps> = ({ artistSeries, relay }) => {
  const { width } = useScreenDimensions()
  const isIPad = width > 700
  const maxChars = isIPad ? 200 : 120
  const ref = useRef<View | null>(null)

  const followOrUnfollowArtist = (followArtist: ArtistToFollowOrUnfollow) => {
    return new Promise<void>((resolve, reject) => {
      commitMutation<ArtistSeriesFollowMutation>(relay.environment, {
        mutation: graphql`
          mutation ArtistSeriesFollowMutation($input: FollowArtistInput!) {
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
    <View ref={ref}>
      <Box p={2}>
        <Flex flexDirection="row" justifyContent="center">
          {/* TODO: add image url */}
          <OpaqueImageView width={180} height={180} />
        </Flex>
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
    </View>
  )
}

export const ArtistSeriesFragmentContainer = createFragmentContainer(ArtistSeries, {
  artistSeries: graphql`
    fragment ArtistSeries_artistSeries on ArtistSeries {
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

export const ArtistSeriesQueryRenderer: React.SFC<{ artistSeriesID: string }> = ({ artistSeriesID }) => {
  return (
    <QueryRenderer<ArtistSeriesQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ArtistSeriesQuery($artistSeriesID: ID!) {
          artistSeries(id: $artistSeriesID) {
            ...ArtistSeries_artistSeries
          }
        }
      `}
      cacheConfig={{ force: true }}
      variables={{
        artistSeriesID,
      }}
      render={renderWithLoadProgress(ArtistSeriesFragmentContainer)}
    />
  )
}
