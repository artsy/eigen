import { tappedCollectedArtworkImages } from "@artsy/cohesion"
import { MyCollectionArtworkHeader_artwork } from "__generated__/MyCollectionArtworkHeader_artwork.graphql"
import { navigate } from "lib/navigation/navigate"
import { Size } from "lib/Scenes/Artwork/Components/ImageCarousel/geometry"
import {
  ImageCarousel,
  ImageCarouselFragmentContainer,
} from "lib/Scenes/Artwork/Components/ImageCarousel/ImageCarousel"
import { MyCollectionImageView } from "lib/Scenes/MyCollection/Components/MyCollectionImageView"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { useDevToggle } from "lib/store/GlobalStore"
import { retrieveLocalImages } from "lib/utils/LocalImageStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Button, Flex, Spacer, Text } from "palette"
import React from "react"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import { useTracking } from "react-tracking"
import useInterval from "react-use/lib/useInterval"
import { ImageDescriptor } from "../../../../../Scenes/Artwork/Components/ImageCarousel/ImageCarouselContext"
import {
  getBoundingBox,
  getImageMeasurements,
  hasImagesStillProcessing,
  imageIsProcessing,
  isImage,
} from "../../ArtworkForm/MyCollectionImageUtil"

interface MyCollectionArtworkHeaderProps {
  artwork: MyCollectionArtworkHeader_artwork
  relay: RelayRefetchProp
}

export const MyCollectionArtworkHeader: React.FC<MyCollectionArtworkHeaderProps> = (props) => {
  const {
    artwork: { artistNames, date, images, internalID, title, slug },
    relay,
  } = props
  const dimensions = useScreenDimensions()
  const formattedTitleAndYear = [title, date].filter(Boolean).join(", ")

  const defaultImage = images?.find((i) => i?.isDefault) || (images && images[0])

  const showLocalImages = useDevToggle("DTMyCollectionShowLocalImages")

  const { trackEvent } = useTracking()

  useInterval(() => {
    if (!isImage(defaultImage) || hasImagesStillProcessing(defaultImage, images)) {
      relay.refetch(
        {
          artworkID: slug,
        },
        null,
        null,
        { force: true }
      )
    }
  }, 1000)

  let imagesToDisplay: typeof images | ImageDescriptor[] = images
  let isDisplayingLocalImages = false
  if (hasImagesStillProcessing(defaultImage, images)) {
    // fallback to local images for this collection artwork
    retrieveLocalImages(slug).then((localImages) => {
      if (localImages?.length) {
        isDisplayingLocalImages = true
      }
      imagesToDisplay =
        localImages?.map((art) => ({
          url: art.path,
          width: art.width,
          height: art.height,
          deepZoom: null,
        })) ?? null
    })
  }
  // const renderMainImageView = () => {
  //   const maxImageHeight = dimensions.height / 2.5
  //   const imageSize: Size = {
  //     height: defaultImage?.height ?? maxImageHeight,
  //     width: defaultImage?.width ?? dimensions.width,
  //   }
  //   const boundingBox = getBoundingBox(imageSize, maxImageHeight, dimensions)
  //   const { cumulativeScrollOffset, ...styles } = getImageMeasurements(imageSize, boundingBox)

  //   // remove all vertical margins for pics taken in landscape mode
  //   boundingBox.height = boundingBox.height - (styles.marginBottom + styles.marginTop)

  //   const imageURL = !imageIsProcessing(defaultImage as any, "normalized") ? defaultImage?.imageURL : undefined
  //   const normalizedURL = imageURL?.replace(":version", "normalized")

  //   return (
  //     <Flex bg="black5" alignItems="center">
  //       <MyCollectionImageView
  //         artworkSlug={slug}
  //         imageURL={normalizedURL}
  //         imageHeight={styles.height}
  //         imageWidth={styles.width}
  //         aspectRatio={styles.width / styles.height}
  //         mode="details"
  //       />
  //     </Flex>
  //   )
  // }

  const ImagesToDisplayCarousel = isDisplayingLocalImages ? ImageCarousel : ImageCarouselFragmentContainer

  return (
    <>
      <ScreenMargin>
        <Text variant="lg">{artistNames}</Text>
        <Text variant="md" color="black60">
          {formattedTitleAndYear}
        </Text>
      </ScreenMargin>
      <Spacer my={1} />
      {
        !!imagesToDisplay ? (
          <ImagesToDisplayCarousel
            images={imagesToDisplay as any}
            cardHeight={dimensions.height / 2.5}
            paginationIndicatorType="scrollBar"
            onImagePressed={() => {
              trackEvent(tracks.tappedCollectedArtworkImages(internalID, slug))
            }}
          />
        ) : null // TODO:- Display null image container https://artsyproduct.atlassian.net/browse/CX-2200
      }
    </>
  )
}

export const MyCollectionArtworkHeaderRefetchContainer = createRefetchContainer(
  MyCollectionArtworkHeader,
  {
    artwork: graphql`
      fragment MyCollectionArtworkHeader_artwork on Artwork {
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
      }
    `,
  },
  graphql`
    query MyCollectionArtworkHeaderRefetchQuery($artworkID: String!) {
      artwork(id: $artworkID) {
        ...MyCollectionArtworkHeader_artwork
      }
    }
  `
)

const tracks = {
  tappedCollectedArtworkImages: (internalID: string, slug: string) => {
    return tappedCollectedArtworkImages({ contextOwnerId: internalID, contextOwnerSlug: slug })
  },
}
