import { tappedCollectedArtworkImages } from "@artsy/cohesion"
import { MyCollectionArtworkHeader_artwork } from "__generated__/MyCollectionArtworkHeader_artwork.graphql"
import {
  ImageCarousel,
  ImageCarouselFragmentContainer,
} from "lib/Scenes/Artwork/Components/ImageCarousel/ImageCarousel"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { Image } from "lib/Scenes/MyCollection/State/MyCollectionArtworkModel"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Spacer, Text } from "palette"
import React from "react"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import { useTracking } from "react-tracking"
import useInterval from "react-use/lib/useInterval"

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

  const isImage = (toCheck: any): toCheck is Image => !!toCheck

  const imageIsProcessing = (image: Image | null, soughtVersion: string) => {
    if (!image) {
      return false
    }

    const isProcessing = !image.imageVersions?.includes(soughtVersion)
    return isProcessing
  }

  const hasImagesStillProcessing = (mainImage: any, imagesToCheck: MyCollectionArtworkHeader_artwork["images"]) => {
    if (!isImage(mainImage) || imageIsProcessing(mainImage, "normalized")) {
      return true
    }

    if (!imagesToCheck) {
      return false
    }

    const concreteImages = imagesToCheck as unknown as Array<Omit<Image, " $fragmentRefs">> as Image[]
    const stillProcessing = concreteImages.some((image) => imageIsProcessing(image, "normalized"))
    return stillProcessing
  }

  const imagesToDisplay = images
  const isDisplayingLocalImages = false
  if (hasImagesStillProcessing(defaultImage, images)) {
    // fallback to local images for this collection artwork
    // TODO:- imagesToDisplay: ImageDescriptor[]
    // const localCopy = MyCollectionLocalImageStore.get(internalID)
    // imagesToDisplay =
    //   localCopy?.images?.map((art) => ({
    //     url: art.url,
    //     width: art.width,
    //     height: art.height,
    //     deepZoom: null,
    //   })) ?? null
    // if (imagesToDisplay) {
    //   isDisplayingLocalImages = true
    // }
  }

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
