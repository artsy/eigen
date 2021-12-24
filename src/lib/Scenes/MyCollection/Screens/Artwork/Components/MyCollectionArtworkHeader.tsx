import { tappedCollectedArtworkImages } from "@artsy/cohesion"
import { MyCollectionArtworkHeader_artwork } from "__generated__/MyCollectionArtworkHeader_artwork.graphql"
import {
  ImageCarousel,
  ImageCarouselFragmentContainer,
} from "lib/Scenes/Artwork/Components/ImageCarousel/ImageCarousel"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { useDevToggle } from "lib/store/GlobalStore"
import { retrieveLocalImages } from "lib/utils/LocalImageStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Spacer, Text, useColor } from "palette"
import React, { useEffect, useState } from "react"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import { useTracking } from "react-tracking"
import { ImageDescriptor } from "../../../../../Scenes/Artwork/Components/ImageCarousel/ImageCarouselContext"
import { hasImagesStillProcessing } from "../../ArtworkForm/MyCollectionImageUtil"

interface MyCollectionArtworkHeaderProps {
  artwork: MyCollectionArtworkHeader_artwork
  relay: RelayRefetchProp
}

export const MyCollectionArtworkHeader: React.FC<MyCollectionArtworkHeaderProps> = (props) => {
  const {
    artwork: { artistNames, date, images, internalID, title, slug },
  } = props

  const [imagesToDisplay, setImagesToDisplay] = useState<typeof images | ImageDescriptor[] | null>(images)
  const [isDisplayingLocalImages, setIsDisplayingLocalImages] = useState(false)

  const dimensions = useScreenDimensions()
  const formattedTitleAndYear = [title, date].filter(Boolean).join(", ")

  const color = useColor()

  const { trackEvent } = useTracking()

  useEffect(() => {
    const defaultImage = images?.find((i) => i?.isDefault) || (images && images[0])
    if (hasImagesStillProcessing(defaultImage, images)) {
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
      {!!imagesToDisplay ? (
        <ImagesToDisplayCarousel
          images={imagesToDisplay as any}
          cardHeight={dimensions.height / 2.5}
          paginationIndicatorType="scrollBar"
          onImagePressed={() => {
            trackEvent(tracks.tappedCollectedArtworkImages(internalID, slug))
          }}
        />
      ) : (
        // TODO:- Display null image container https://artsyproduct.atlassian.net/browse/CX-2200
        <Box testID="Fallback" bg={color("black30")} width={dimensions.width} height={dimensions.height / 2.5} />
      )}
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
