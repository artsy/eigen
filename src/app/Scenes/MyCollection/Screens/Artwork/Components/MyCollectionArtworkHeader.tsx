import { tappedCollectedArtworkImages } from "@artsy/cohesion"
import { useNavigation } from "@react-navigation/native"
import { MyCollectionArtworkHeader_artwork$key } from "__generated__/MyCollectionArtworkHeader_artwork.graphql"
import { navigate } from "app/navigation/navigate"
import {
  CarouselImageDescriptor,
  ImageCarousel,
  ImageCarouselFragmentContainer,
} from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarousel"
import { LocalImage, retrieveLocalImages } from "app/utils/LocalImageStore"
import { Flex, Join, NoImageIcon, Spacer, Text, useColor } from "palette"
import React, { useEffect, useState } from "react"
import { TouchableOpacity } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { useScreenDimensions } from "shared/hooks"
import {
  imageIsProcessing,
  isImage,
  removeLocalPhotos,
} from "../../ArtworkForm/MyCollectionImageUtil"
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
    images,
    internalID,
    title,
    slug,
    consignmentSubmission,
    submissionId,
  } = artwork
  const [imagesToDisplay, setImagesToDisplay] = useState<
    typeof images | CarouselImageDescriptor[] | null
  >(images)
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
    }))
  }

  const handleImages = async () => {
    const defaultImage = images?.find((i) => i?.isDefault) || (images && images[0])
    const [localVanillaArtworkImages, localSubmissionArtworkImages] = await Promise.all([
      retrieveLocalImages(slug),
      submissionId ? retrieveLocalImages(submissionId) : undefined,
    ])
    if (!isImage(defaultImage) || imageIsProcessing(defaultImage, "normalized")) {
      // fallback to local images for this collection artwork
      const mappedLocalImages = mapLocalImages(
        localVanillaArtworkImages ?? localSubmissionArtworkImages ?? []
      )

      setImagesToDisplay(mappedLocalImages)
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

  const ImagesToDisplayCarousel = isDisplayingLocalImages
    ? ImageCarousel
    : ImageCarouselFragmentContainer

  return (
    <Join separator={<Spacer my={1} />}>
      {/* ImageCarousel */}
      {!!imagesToDisplay ? (
        <ImagesToDisplayCarousel
          images={imagesToDisplay as any}
          cardHeight={dimensions.height / 3.5}
          onImagePressed={() => trackEvent(tracks.tappedCollectedArtworkImages(internalID, slug))}
        />
      ) : (
        <Flex
          testID="Fallback-image-mycollection-header"
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
    images {
      ...ImageCarousel_images
      imageVersions
      isDefault
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
