import { tappedCollectedArtworkImages } from "@artsy/cohesion"
import { NewMyCollectionArtworkHeader_artwork$key } from "__generated__/NewMyCollectionArtworkHeader_artwork.graphql"
import {
  CarouselImageDescriptor,
  ImageCarousel,
  ImageCarouselFragmentContainer,
} from "lib/Scenes/Artwork/Components/ImageCarousel/ImageCarousel"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { retrieveLocalImages } from "lib/utils/LocalImageStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Flex, Join, NoImageIcon, Spacer, Text, useColor } from "palette"
import React, { useEffect, useState } from "react"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { imageIsProcessing, isImage } from "../../ArtworkForm/MyCollectionImageUtil"
import { MyCollectionArtworkSubmissionStatus } from "../Components/MyCollectionArtworkSubmissionStatus"

interface MyCollectionArtworkHeaderProps {
  artwork: NewMyCollectionArtworkHeader_artwork$key
}

export const MyCollectionArtworkHeader: React.FC<MyCollectionArtworkHeaderProps> = (props) => {
  const artwork = useFragment<NewMyCollectionArtworkHeader_artwork$key>(
    myCollectionArtworkHeaderFragment,
    props.artwork
  )
  const { artistNames, date, images, internalID, title, slug, consignmentSubmission } = artwork
  const allowSubmissionStatusInMyCollection = useFeatureFlag("ARShowConsignmentsInMyCollection")

  const [imagesToDisplay, setImagesToDisplay] = useState<
    typeof images | CarouselImageDescriptor[] | null
  >(images)
  const [isDisplayingLocalImages, setIsDisplayingLocalImages] = useState(false)

  const dimensions = useScreenDimensions()
  const formattedTitleAndYear = [title, date].filter(Boolean).join(", ")

  const color = useColor()

  const { trackEvent } = useTracking()

  useEffect(() => {
    const defaultImage = images?.find((i) => i?.isDefault) || (images && images[0])
    if (!isImage(defaultImage) || imageIsProcessing(defaultImage, "normalized")) {
      // fallback to local images for this collection artwork
      retrieveLocalImages(slug).then((localImages) => {
        const mappedLocalImages =
          localImages?.map((localImage) => ({
            url: localImage.path,
            width: localImage.width,
            height: localImage.height,
            deepZoom: null,
          })) ?? null
        setImagesToDisplay(mappedLocalImages)
        setIsDisplayingLocalImages(!!localImages?.length)
      })
    }
  }, [])

  const ImagesToDisplayCarousel = isDisplayingLocalImages
    ? ImageCarousel
    : ImageCarouselFragmentContainer

  return (
    <Join separator={<Spacer my={1} />}>
      {/* ImageCarousel */}
      {!!imagesToDisplay ? (
        <ImagesToDisplayCarousel
          images={imagesToDisplay as any}
          cardHeight={dimensions.height / 2.5}
          paginationIndicatorType="scrollBar"
          onImagePressed={() => trackEvent(tracks.tappedCollectedArtworkImages(internalID, slug))}
        />
      ) : (
        <Flex
          testID="Fallback-image-mycollection-header"
          bg={color("black5")}
          height={dimensions.height / 2.5}
          justifyContent="center"
          mx={20}
        >
          <NoImageIcon fill="black60" mx="auto" />
        </Flex>
      )}

      {/* Image Meta */}
      <Flex px={2}>
        <Text variant="lg">{artistNames}</Text>
        <Text variant="lg" color="black60" italic mb={2}>
          {formattedTitleAndYear}
        </Text>
      </Flex>

      {!!consignmentSubmission?.displayText && !!allowSubmissionStatusInMyCollection && (
        <Flex px={2}>
          <MyCollectionArtworkSubmissionStatus displayText={consignmentSubmission?.displayText} />
        </Flex>
      )}

      {/* Extra Bottom Space */}
      <></>
    </Join>
  )
}

const myCollectionArtworkHeaderFragment = graphql`
  fragment NewMyCollectionArtworkHeader_artwork on Artwork {
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
  }
`

const tracks = {
  tappedCollectedArtworkImages: (internalID: string, slug: string) => {
    return tappedCollectedArtworkImages({ contextOwnerId: internalID, contextOwnerSlug: slug })
  },
}
