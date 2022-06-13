import { tappedCollectedArtwork } from "@artsy/cohesion"
import { themeGet } from "@styled-system/theme-get"
import { MyCollectionArtworkGridItem_artwork$data } from "__generated__/MyCollectionArtworkGridItem_artwork.graphql"
import { DEFAULT_SECTION_MARGIN } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import HighDemandIcon from "app/Icons/HighDemandIcon"
import { navigate } from "app/navigation/navigate"
import { useFeatureFlag } from "app/store/GlobalStore"
import { isPad } from "app/utils/hardware"
import { Box, Flex, Text } from "palette"
import React from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { useScreenDimensions } from "shared/hooks"
import styled from "styled-components/native"
import { MyCollectionImageView } from "../../Components/MyCollectionImageView"

interface MyCollectionArtworkGridItemProps {
  artwork: MyCollectionArtworkGridItem_artwork$data
}

const MyCollectionArtworkGridItem: React.FC<MyCollectionArtworkGridItemProps> = ({ artwork }) => {
  const { trackEvent } = useTracking()
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

  const isP1Artist = artwork.artist?.targetSupply?.isP1
  const isHighDemand = Number((artwork.marketPriceInsights?.demandRank || 0) * 10) >= 9

  const showDemandIndexHints = useFeatureFlag("ARShowMyCollectionDemandIndexHints")

  const showHighDemandIcon = isP1Artist && isHighDemand

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
          <Text lineHeight="18" weight="regular" variant="xs" numberOfLines={2}>
            {artistNames}
            {!!showHighDemandIcon && !!showDemandIndexHints && (
              <Flex testID="test-high-demand-icon">
                <HighDemandIcon style={{ marginLeft: 2, marginBottom: -2 }} />
              </Flex>
            )}
          </Text>
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
            isP1
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
        marketPriceInsights {
          demandRank
        }
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
