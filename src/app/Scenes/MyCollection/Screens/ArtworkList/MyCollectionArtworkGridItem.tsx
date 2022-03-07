import { tappedCollectedArtwork } from "@artsy/cohesion"
import { themeGet } from "@styled-system/theme-get"
import { MyCollectionArtworkGridItem_artwork } from "__generated__/MyCollectionArtworkGridItem_artwork.graphql"
import { MyCollectionArtworkGridItemQuery } from "__generated__/MyCollectionArtworkGridItemQuery.graphql"
import { DEFAULT_SECTION_MARGIN } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { FadeIn } from "app/Components/FadeIn"
import { TrendingIcon } from "app/Icons/TrendingIcon"
import { navigate } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { useFeatureFlag } from "app/store/GlobalStore"
import { isPad } from "app/utils/hardware"
import { useScreenDimensions } from "app/utils/useScreenDimensions"
import { Box, Flex, Text } from "palette"
import React, { useEffect, useState } from "react"
import { View } from "react-native"
import { createFragmentContainer, fetchQuery, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { MyCollectionImageView } from "../../Components/MyCollectionImageView"

interface MyCollectionArtworkGridItemProps {
  artwork: MyCollectionArtworkGridItem_artwork
}

const MyCollectionArtworkGridItem: React.FC<MyCollectionArtworkGridItemProps> = ({ artwork }) => {
  const { trackEvent } = useTracking()
  const [trending, setTrending] = useState(false)
  const imageURL =
    artwork.images?.find((i: any) => i?.isDefault)?.url ||
    (artwork.images && artwork.images[0]?.url)
  const { width } = useScreenDimensions()

  const { artist, artistNames, internalID, medium, slug, title, image, date } = artwork

  // consistent with how sections are derived in InfiniteScrollArtworksGrid
  const screen = useScreenDimensions()
  const isPadHorizontal = isPad() && screen.width > screen.height
  const sectionCount = isPad() ? (isPadHorizontal ? 4 : 3) : 2
  const imageWidth = (screen.width - DEFAULT_SECTION_MARGIN * (sectionCount + 1)) / sectionCount

  const isPOneArtist =
    !!artwork.artists?.find((artst) => Boolean(artst?.targetSupply?.isTargetSupply)) ??
    !!artwork.artist?.targetSupply?.isTargetSupply ??
    false

  const ARShowDemandIndexHints = useFeatureFlag("ARShowDemandIndexHints")

  const fetchDemandRank = async (): Promise<number | null> => {
    if (artist?.internalID && medium) {
      try {
        const res = await fetchQuery<MyCollectionArtworkGridItemQuery>(
          defaultEnvironment,
          graphql`
            query MyCollectionArtworkGridItemQuery($internalID: ID!, $medium: String!) {
              marketPriceInsights(artistId: $internalID, medium: $medium) {
                demandRank
              }
            }
          `,
          { internalID: artist.internalID, medium }
        ).toPromise()

        if (res?.marketPriceInsights?.demandRank) {
          setTrending(Number(res.marketPriceInsights.demandRank * 10) >= 9)
        }
      } catch (e) {
        console.error(e)
        return null
      }
    }
    return null
  }

  useEffect(() => {
    if (isPOneArtist && ARShowDemandIndexHints) {
      fetchDemandRank()
    }
  }, [])

  const showTrendingIcon = ARShowDemandIndexHints && trending

  return (
    <TouchElement
      onPress={() => {
        if (!!artist) {
          trackEvent(tracks.tappedCollectedArtwork(internalID, slug))
          navigate("/my-collection/artwork/" + slug, {
            passProps: {
              medium,
              artistInternalID: artist.internalID,
            },
          })
        } else {
          console.warn("MyCollectionArtworkGridItem: Error: Missing artist.artistID")
        }
      }}
    >
      <View>
        <MyCollectionImageView
          imageWidth={imageWidth}
          imageURL={imageURL ?? undefined}
          aspectRatio={image?.aspectRatio}
          artworkSlug={slug}
        />
        <Box maxWidth={width} mt={1} style={{ flex: 1 }}>
          <Flex flexDirection="row">
            <Flex flexShrink={1}>
              <Text lineHeight="18" weight="regular" variant="xs" numberOfLines={2}>
                {artistNames}
              </Text>
            </Flex>
            {!!showTrendingIcon && (
              <Flex alignSelf="flex-end" mt="2px" pl="3px">
                <FadeIn>
                  <TrendingIcon />
                </FadeIn>
              </Flex>
            )}
          </Flex>
          {!!title ? (
            <Text lineHeight="18" variant="xs" weight="regular" numberOfLines={1} color="black60">
              <Text lineHeight="18" variant="xs" weight="regular" italic>
                {title}
              </Text>
              {date ? `, ${date}` : ""}
            </Text>
          ) : null}
        </Box>
      </View>
    </TouchElement>
  )
}

export const MyCollectionArtworkGridItemFragmentContainer = createFragmentContainer(
  MyCollectionArtworkGridItem,
  {
    artwork: graphql`
      fragment MyCollectionArtworkGridItem_artwork on Artwork {
        internalID
        artist {
          internalID
          targetSupply {
            isTargetSupply
          }
        }
        artists {
          targetSupply {
            isTargetSupply
          }
        }
        images {
          url
          isDefault
        }
        image {
          aspectRatio
        }
        artistNames
        medium
        slug
        title
        date
      }
    `,
  }
)

const TouchElement = styled.TouchableHighlight.attrs(() => ({
  underlayColor: themeGet("colors.white100"),
  activeOpacity: 0.8,
}))``

export const tests = {
  TouchElement,
}

const tracks = {
  tappedCollectedArtwork: (targetID: string, targetSlug: string) => {
    return tappedCollectedArtwork({
      destinationOwnerId: targetID,
      destinationOwnerSlug: targetSlug,
    })
  },
}
