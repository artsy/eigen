import { tappedCollectedArtwork } from "@artsy/cohesion"
import { TrendingIcon } from "@artsy/icons/native"
import { Box, Text } from "@artsy/palette-mobile"
import { MyCollectionArtworkGridItem_artwork$data } from "__generated__/MyCollectionArtworkGridItem_artwork.graphql"
import { DEFAULT_SECTION_MARGIN } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { MyCollectionImageView } from "app/Scenes/MyCollection/Components/MyCollectionImageView"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useLocalImage } from "app/utils/LocalImageStore"
import { useScreenDimensions } from "app/utils/hooks"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { getVortexMedium } from "app/utils/marketPriceInsightHelpers"
import { View } from "react-native"
import { isTablet } from "react-native-device-info"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface MyCollectionArtworkGridItemProps {
  artwork: MyCollectionArtworkGridItem_artwork$data
}

const MyCollectionArtworkGridItem: React.FC<MyCollectionArtworkGridItemProps> = ({ artwork }) => {
  const { trackEvent } = useTracking()
  const displayImage = artwork.images?.find((i: any) => i?.isDefault) || artwork.images?.[0]
  const { width } = useScreenDimensions()
  const showBlurhash = useFeatureFlag("ARShowBlurhashImagePlaceholder")

  const localImage = useLocalImage(displayImage)

  const { artist, artistNames, internalID, medium, mediumType, slug, title, image, date } = artwork

  // consistent with how sections are derived in InfiniteScrollArtworksGrid
  const screen = useScreenDimensions()
  const sectionCount = isTablet() ? 3 : 2
  const imageWidth = (screen.width - DEFAULT_SECTION_MARGIN * (sectionCount + 1)) / sectionCount

  const isP1Artist = artwork.artist?.targetSupply?.isP1
  const isHighDemand = Number((artwork.marketPriceInsights?.demandRank || 0) * 10) >= 9

  const showHighDemandIcon = isP1Artist && isHighDemand

  const queryVariables = {
    artistInternalID: artist?.internalID || "",
    medium: getVortexMedium(medium ?? null, mediumType?.name ?? null) || "",
  }

  return (
    <RouterLink
      accessibilityLabel="Go to artwork details"
      accessibilityRole="link"
      to={"/my-collection/artwork/" + slug}
      prefetchVariables={queryVariables}
      navigationProps={queryVariables}
      onPress={() => {
        if (!!artist) {
          trackEvent(tracks.tappedCollectedArtwork(internalID, slug))
        } else {
          console.warn("MyCollectionArtworkGridItem: Error: Missing artist.artistID")
        }
      }}
    >
      <View>
        <MyCollectionImageView
          imageWidth={imageWidth}
          imageURL={(localImage?.path || displayImage?.url) ?? undefined}
          aspectRatio={localImage?.aspectRatio || image?.aspectRatio}
          artworkSlug={slug}
          useRawURL={!!localImage}
          blurhash={showBlurhash ? image?.blurhash : undefined}
        />
        <Box maxWidth={width} mt={1} style={{ flex: 1 }}>
          <Text lineHeight="18px" weight="regular" variant="xs" numberOfLines={2}>
            {artistNames}
          </Text>

          {!!title ? (
            <Text lineHeight="18px" variant="xs" weight="regular" numberOfLines={1} color="mono60">
              <Text lineHeight="18px" variant="xs" weight="regular" italic>
                {title}
              </Text>
              {date ? `, ${date}` : ""}
            </Text>
          ) : null}

          {!!showHighDemandIcon && (
            <Box testID="test-high-demand-signal" alignItems="center" flexDirection="row">
              <TrendingIcon />
              <Text variant="xs" pl="3px" textAlign="center">
                High demand
              </Text>
            </Box>
          )}
        </Box>
      </View>
    </RouterLink>
  )
}

export const MyCollectionArtworkGridItemFragmentContainer = createFragmentContainer(
  MyCollectionArtworkGridItem,
  {
    artwork: graphql`
      fragment MyCollectionArtworkGridItem_artwork on Artwork
      @argumentDefinitions(includeAllImages: { type: "Boolean", defaultValue: false }) {
        internalID
        artist {
          internalID
          targetSupply {
            isP1
          }
        }
        mediumType {
          name
        }
        images(includeAll: $includeAllImages) {
          url(version: ["larger", "large", "medium", "small", "square"])
          isDefault
          internalID
          versions
          blurhash
        }
        image(includeAll: $includeAllImages) {
          internalID
          aspectRatio
          versions
          blurhash
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

const tracks = {
  tappedCollectedArtwork: (targetID: string, targetSlug: string) => {
    return tappedCollectedArtwork({
      destinationOwnerId: targetID,
      destinationOwnerSlug: targetSlug,
    })
  },
}
