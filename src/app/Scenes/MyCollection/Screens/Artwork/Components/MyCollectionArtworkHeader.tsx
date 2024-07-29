import { tappedCollectedArtworkImages } from "@artsy/cohesion"
import { useColor, Spacer, Flex, NoImageIcon, Text, Join } from "@artsy/palette-mobile"
import { MyCollectionArtworkHeader_artwork$key } from "__generated__/MyCollectionArtworkHeader_artwork.graphql"
import { ImageCarouselFragmentContainer } from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarousel"
import { navigate } from "app/system/navigation/navigate"
import { useScreenDimensions } from "app/utils/hooks"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { TouchableOpacity } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { MyCollectionArtworkSubmissionStatus } from "./MyCollectionArtworkSubmissionStatus"

const NO_ARTIST_NAMES_TEXT = "-"

interface MyCollectionArtworkHeaderProps {
  artwork: MyCollectionArtworkHeader_artwork$key
}

export const MyCollectionArtworkHeader: React.FC<MyCollectionArtworkHeaderProps> = (props) => {
  const enableSubmitArtworkTier2Information = useFeatureFlag(
    "AREnableSubmitArtworkTier2Information"
  )
  const artwork = useFragment(myCollectionArtworkHeaderFragment, props.artwork)
  const { artistNames, date, internalID, title, slug, consignmentSubmission } = artwork

  const dimensions = useScreenDimensions()

  const color = useColor()

  const { trackEvent } = useTracking()

  const hasImages = artwork?.figures?.length > 0
  const displaySubmissionStateSection =
    consignmentSubmission?.state && consignmentSubmission?.state !== "DRAFT"

  const displaySubmissionStateSectionTier2 =
    consignmentSubmission?.state && consignmentSubmission?.state !== "REJECTED" // TODO: Add more states to aviod displaying submissions in unsupprted statusess

  const displaySubmissionStateSectionInHeader = enableSubmitArtworkTier2Information
    ? displaySubmissionStateSectionTier2
    : displaySubmissionStateSection

  return (
    <Join separator={<Spacer y={2} />}>
      {hasImages ? (
        <ImageCarouselFragmentContainer
          figures={artwork?.figures}
          cardHeight={dimensions.height / 2}
          onImagePressed={() => trackEvent(tracks.tappedCollectedArtworkImages(internalID, slug))}
        />
      ) : (
        <Flex
          testID="MyCollectionArtworkHeaderFallback"
          bg={color("black5")}
          height={dimensions.height / 2}
          justifyContent="center"
          mx={2}
        >
          <NoImageIcon fill="black60" mx="auto" />
        </Flex>
      )}

      {/* Image Meta */}

      <Flex px={2}>
        {artwork?.artist?.isPersonalArtist ? (
          <Text variant="lg-display">{artistNames ?? NO_ARTIST_NAMES_TEXT}</Text>
        ) : (
          <TouchableOpacity
            onPress={() => {
              if (artwork?.artist?.href) {
                navigate(artwork.artist.href)
              }
            }}
          >
            <Text variant="lg-display">{artistNames ?? NO_ARTIST_NAMES_TEXT}</Text>
          </TouchableOpacity>
        )}
        <Text variant="lg-display" color="black60">
          <Text variant="lg-display" color="black60" italic>
            {title}
          </Text>
          {!!date && `, ${date}`}
        </Text>
      </Flex>

      {!!displaySubmissionStateSectionInHeader && (
        <Flex px={2}>
          <MyCollectionArtworkSubmissionStatus artwork={artwork} />
        </Flex>
      )}
    </Join>
  )
}

const myCollectionArtworkHeaderFragment = graphql`
  fragment MyCollectionArtworkHeader_artwork on Artwork {
    artist {
      href
      isPersonalArtist
    }
    artistNames
    date
    figures(includeAll: true) {
      ...ImageCarousel_figures
    }
    internalID
    slug
    title
    consignmentSubmission {
      state
    }
    submissionId
    ...MyCollectionArtworkSubmissionStatus_submissionState
  }
`

const tracks = {
  tappedCollectedArtworkImages: (internalID: string, slug: string) => {
    return tappedCollectedArtworkImages({ contextOwnerId: internalID, contextOwnerSlug: slug })
  },
}
