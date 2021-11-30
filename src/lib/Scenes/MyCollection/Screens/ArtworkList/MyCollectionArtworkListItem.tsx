import { tappedCollectedArtwork } from "@artsy/cohesion"
import { themeGet } from "@styled-system/theme-get"
import { MyCollectionArtworkListItem_artwork } from "__generated__/MyCollectionArtworkListItem_artwork.graphql"
import { DEFAULT_SECTION_MARGIN } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { isPad } from "lib/utils/hardware"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Text, useColor } from "palette"
import React from "react"
import { Image as RNImage, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"

interface MyCollectionArtworkListItemProps {
  artwork: MyCollectionArtworkListItem_artwork
}

const MyCollectionArtworkListItem: React.FC<MyCollectionArtworkListItemProps> = ({ artwork }) => {
  const color = useColor()
  const { trackEvent } = useTracking()
  const imageURL = artwork.images?.find((i: any) => i?.isDefault)?.url || (artwork.images && artwork.images[0]?.url)
  const { width } = useScreenDimensions()

  const { artist, artistNames, internalID, medium, slug, title, image, date } = artwork

  const lastUploadedPhoto = {
    path: "some-photo",
  }

  // consistent with how sections are derived in InfiniteScrollArtworksGrid
  const screen = useScreenDimensions()
  const isPadHorizontal = isPad() && screen.width > screen.height
  const sectionCount = isPad() ? (isPadHorizontal ? 4 : 3) : 2
  const imageWidth = (screen.width - DEFAULT_SECTION_MARGIN * (sectionCount + 1)) / sectionCount

  const renderImage = () => {
    if (!!imageURL) {
      return (
        <OpaqueImageView
          testID="Image"
          imageURL={imageURL.replace(":version", "square")}
          aspectRatio={image?.aspectRatio ?? 1}
        />
      )
    } else if (lastUploadedPhoto) {
      return (
        <RNImage
          testID="Image"
          style={{ width: imageWidth, height: 120, resizeMode: "cover" }}
          source={{ uri: lastUploadedPhoto.path }}
        />
      )
    } else {
      return <Box testID="Image" bg={color("black30")} width={imageWidth} height={120} />
    }
  }

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
          console.warn("MyCollectionArtworkListItem: Error: Missing artist.artistID")
        }
      }}
    >
      <View>
        {renderImage()}
        <Box maxWidth={width} mt={1} style={{ flex: 1 }}>
          <Text lineHeight="18" weight="regular" variant="xs" numberOfLines={1}>
            {artistNames}
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

export const MyCollectionArtworkListItemFragmentContainer = createFragmentContainer(MyCollectionArtworkListItem, {
  artwork: graphql`
    fragment MyCollectionArtworkListItem_artwork on Artwork {
      internalID
      artist {
        internalID
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
    }
  `,
})

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
