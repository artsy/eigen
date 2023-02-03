import { tappedCollectedArtworkImages } from "@artsy/cohesion"
import { Spacer } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { MyCollectionArtworkHeader_artwork$key } from "__generated__/MyCollectionArtworkHeader_artwork.graphql"
import {
  ImageCarousel,
  ImageCarouselFragmentContainer,
} from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarousel"
import {
  imageIsProcessing,
  isImage,
  removeLocalPhotos,
} from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionImageUtil"
import { navigate } from "app/system/navigation/navigate"
import { LocalImage, retrieveLocalImages } from "app/utils/LocalImageStore"
import { Flex, Join, NoImageIcon, Text, useColor } from "palette"
import React, { useEffect, useState } from "react"
import { TouchableOpacity } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { useScreenDimensions } from "shared/hooks"
import { MyCollectionArtworkSubmissionStatus } from "./MyCollectionArtworkSubmissionStatus"

const NO_ARTIST_NAMES_TEXT = "-"

interface MyCollectionArtworkHeaderProps {
  artwork: MyCollectionArtworkHeader_artwork$key
}

export const MyCollectionArtworkHeader: React.FC<MyCollectionArtworkHeaderProps> = (props) => {
  const artwork = useFragment(myCollectionArtworkHeaderFragment, props.artwork)
  const {
    artistNames,
    date,
    imageMeta,
    figures,
    internalID,
    title,
    slug,
    consignmentSubmission,
    submissionId,
  } = artwork
  const [imagesToDisplay, setImagesToDisplay] = useState<typeof artwork.figures>(figures)
  const [isDisplayingLocalImages, setIsDisplayingLocalImages] = useState(false)

  const dimensions = useScreenDimensions()

  const color = useColor()

  const { trackEvent } = useTracking()

  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = navigation?.addListener("focus", () => {
      handleImages()
    })
    return unsubscribe
  }, [navigation])

  useEffect(() => {
    handleImages()
  }, [submissionId])

  const mapLocalImages = (localImages: LocalImage[]) => {
    return localImages.map((localImage) => ({
      url: localImage.path,
      width: localImage.width,
      height: localImage.height,
      deepZoom: null,
      largeImageURL: localImage.path,
    }))
  }

  const handleImages = async () => {
    const defaultImage = imageMeta?.find((i) => i?.isDefault) || (figures && figures[0])
    const [localVanillaArtworkImages, localSubmissionArtworkImages] = await Promise.all([
      retrieveLocalImages(slug),
      submissionId ? retrieveLocalImages(submissionId) : undefined,
    ])
    if (!isImage(defaultImage) || imageIsProcessing(defaultImage, "normalized")) {
      // fallback to local images for this collection artwork
      const mappedLocalImages = mapLocalImages(
        localVanillaArtworkImages ?? localSubmissionArtworkImages ?? []
      )

      setImagesToDisplay(mappedLocalImages as any)
      setIsDisplayingLocalImages(
        !!localVanillaArtworkImages?.length || !!localSubmissionArtworkImages?.length
      )
      return
    }

    // TODO:- Handle case where images exist and user adds new images and
    // new images are not yet avalable from Gemini. How Do You handle this????

    // if there are no constraints, clear localPhotos from AsyncStorage
    removeLocalPhotos(slug)
  }

  const hasImages = imagesToDisplay?.length > 0

  return (
    <Join separator={<Spacer y={1} />}>
      {hasImages ? (
        <>
          {!!isDisplayingLocalImages ? (
            <ImageCarousel
              staticImages={imagesToDisplay as any}
              cardHeight={dimensions.height / 3.5}
              onImagePressed={() =>
                trackEvent(tracks.tappedCollectedArtworkImages(internalID, slug))
              }
            />
          ) : (
            <ImageCarouselFragmentContainer
              figures={imagesToDisplay}
              cardHeight={dimensions.height / 3.5}
              onImagePressed={() =>
                trackEvent(tracks.tappedCollectedArtworkImages(internalID, slug))
              }
            />
          )}
        </>
      ) : (
        <Flex
          testID="MyCollectionArtworkHeaderFallback"
          bg={color("black5")}
          height={dimensions.height / 3.5}
          justifyContent="center"
          mx={20}
        >
          <NoImageIcon fill="black60" mx="auto" />
        </Flex>
      )}

      {/* Image Meta */}

      <Flex px={2}>
        {artwork?.artist?.isPersonalArtist ? (
          <Text variant="lg-display">{artistNames ?? NO_ARTIST_NAMES_TEXT}</Text>
        ) : (
          <TouchableOpacity onPress={() => navigate(artwork?.artist?.href!)}>
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

      {!!consignmentSubmission?.displayText && (
        <Flex px={2} mt={2}>
          <MyCollectionArtworkSubmissionStatus displayText={consignmentSubmission?.displayText} />
        </Flex>
      )}

      {/* Extra Bottom Space */}
      <></>
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
    figures {
      ...ImageCarousel_figures
    }
    imageMeta: figures {
      ... on Image {
        imageVersions
        isDefault
      }
    }
    internalID
    slug
    title
    consignmentSubmission {
      displayText
    }
    submissionId
  }
`

const tracks = {
  tappedCollectedArtworkImages: (internalID: string, slug: string) => {
    return tappedCollectedArtworkImages({ contextOwnerId: internalID, contextOwnerSlug: slug })
  },
}
