import { tappedCollectedArtwork } from "@artsy/cohesion"
import { Box, Text, Popover, useColor, TrendingIcon } from "@artsy/palette-mobile"
import { MyCollectionArtworkGridItem_artwork$data } from "__generated__/MyCollectionArtworkGridItem_artwork.graphql"
import { DEFAULT_SECTION_MARGIN } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { MyCollectionImageView } from "app/Scenes/MyCollection/Components/MyCollectionImageView"
import { SubmissionStatus } from "app/Scenes/MyCollection/Components/SubmissionStatus"
import { GlobalStore } from "app/store/GlobalStore"
import { PROGRESSIVE_ONBOARDING_MY_COLLECTION_SELL_THIS_WORK } from "app/store/ProgressiveOnboardingModel"
import { navigate } from "app/system/navigation/navigate"
import { useLocalImage } from "app/utils/LocalImageStore"
import { useScreenDimensions } from "app/utils/hooks"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { TouchableHighlight, View } from "react-native"
import { isTablet } from "react-native-device-info"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

interface MyCollectionArtworkGridItemProps {
  artwork: MyCollectionArtworkGridItem_artwork$data
  displayToolTip?: boolean | null | undefined
}

const MyCollectionArtworkGridItem: React.FC<MyCollectionArtworkGridItemProps> = ({
  artwork,
  displayToolTip,
}) => {
  const color = useColor()
  const { trackEvent } = useTracking()
  const displayImage = artwork.images?.find((i: any) => i?.isDefault) || artwork.images?.[0]
  const { width } = useScreenDimensions()
  const showBlurhash = useFeatureFlag("ARShowBlurhashImagePlaceholder")

  const localImage = useLocalImage(displayImage)

  const {
    artist,
    artistNames,
    internalID,
    medium,
    mediumType,
    slug,
    title,
    image,
    date,
    submissionId,
    consignmentSubmission,
  } = artwork

  // consistent with how sections are derived in InfiniteScrollArtworksGrid
  const screen = useScreenDimensions()
  const sectionCount = isTablet() ? 3 : 2
  const imageWidth = (screen.width - DEFAULT_SECTION_MARGIN * (sectionCount + 1)) / sectionCount

  const isP1Artist = artwork.artist?.targetSupply?.isP1
  const isHighDemand = Number((artwork.marketPriceInsights?.demandRank || 0) * 10) >= 9

  const showHighDemandIcon = isP1Artist && isHighDemand && !consignmentSubmission?.internalID

  const { dismiss } = GlobalStore.actions.progressiveOnboarding
  const { isActive, clearActivePopover } = useSetActivePopover(!!displayToolTip)

  const handleDismissPopover = () => {
    dismiss(PROGRESSIVE_ONBOARDING_MY_COLLECTION_SELL_THIS_WORK)
  }

  return (
    <Popover
      visible={!!displayToolTip && isActive}
      onDismiss={handleDismissPopover}
      onPressOutside={handleDismissPopover}
      onCloseComplete={clearActivePopover}
      placement="top"
      title={
        <Text variant="xs" color="white100" fontWeight="500">
          Interested in Selling This Work?
        </Text>
      }
      content={
        <Text variant="xs" color="white100">
          Submit for sale and let our experts find the best selling option for you.
        </Text>
      }
    >
      <TouchableHighlight
        underlayColor={color("white100")}
        activeOpacity={0.8}
        accessibilityLabel="Go to artwork details"
        accessibilityRole="link"
        onPress={() => {
          if (!!artist) {
            trackEvent(tracks.tappedCollectedArtwork(internalID, slug))
            navigate("/my-collection/artwork/" + slug, {
              passProps: {
                medium,
                category: mediumType?.name,
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
            imageURL={(localImage?.path || displayImage?.url) ?? undefined}
            aspectRatio={localImage?.aspectRatio || image?.aspectRatio}
            artworkSlug={slug}
            artworkSubmissionId={submissionId}
            useRawURL={!!localImage}
            blurhash={showBlurhash ? image?.blurhash : undefined}
          />
          <Box maxWidth={width} mt={1} style={{ flex: 1 }}>
            <Text lineHeight="18px" weight="regular" variant="xs" numberOfLines={2}>
              {artistNames}
            </Text>

            {!!title ? (
              <Text
                lineHeight="18px"
                variant="xs"
                weight="regular"
                numberOfLines={1}
                color="black60"
              >
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

            <SubmissionStatus artwork={artwork} />
          </Box>
        </View>
      </TouchableHighlight>
    </Popover>
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
        submissionId
        title
        date
        marketPriceInsights {
          demandRank
        }
        consignmentSubmission {
          internalID
        }
        ...SubmissionStatus_artwork
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
