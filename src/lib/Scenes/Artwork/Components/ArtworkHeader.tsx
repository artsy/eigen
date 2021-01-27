import { ArtworkHeader_artwork } from "__generated__/ArtworkHeader_artwork.graphql"
import { Schema } from "lib/utils/track"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Flex, Spacer } from "palette"
import React, { useState } from "react"
// @ts-ignore
import Share from "react-native-share"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import RNFetchBlob from "rn-fetch-blob"
import { ArtworkActionsFragmentContainer as ArtworkActions, shareContent } from "./ArtworkActions"
import { ArtworkTombstoneFragmentContainer as ArtworkTombstone } from "./ArtworkTombstone"
import { ImageCarouselFragmentContainer } from "./ImageCarousel/ImageCarousel"
import ViewShot from "react-native-view-shot"
import { useEmissionOption } from "lib/store/GlobalStore"
import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"

const IGStoryViewShot: React.FC<{ shotRef: any; href: string }> = ({ shotRef, href }) => {
  const { height: screenHeight, width: screenWidth } = useScreenDimensions()


interface ArtworkHeaderProps {
  artwork: ArtworkHeader_artwork
}

export const ArtworkHeader: React.FC<ArtworkHeaderProps> = (props) => {
  const { artwork } = props
  const screenDimensions = useScreenDimensions()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { trackEvent } = useTracking()
  const enableCustomShare = useEmissionOption("AREnableCustomSharesheet")
  const { height: screenHeight } = useScreenDimensions()
  const shotRef = useRef(null)

  const [shareModalVisible, setShareModalVisible] = useState(false)

  const shareArtwork = async () => {
    trackEvent({
      action_name: Schema.ActionNames.Share,
      action_type: Schema.ActionTypes.Tap,
      context_module: Schema.ContextModules.ArtworkActions,
    })

    const { title, href, artists } = artwork
    const details = shareContent(title!, href!, artists)

    const url = ((artwork.images ?? [])[currentImageIndex]?.url ?? "").replace(":version", "large")

    const resp = await RNFetchBlob.config({
      fileCache: true,
    }).fetch("GET", url)

    const base64RawData = await resp.base64()
    const base64Data = `data:image/png;base64,${base64RawData}`

    await Share.open({
      title: details.title,
      urls: [base64Data, details.url],
      message: details.message,

  const shareArtworkOnInstagramStory = async () => {
    const { title, href, artists } = artwork
    const details = shareContent(title!, href!, artists)

    const colors = await ImageColors.getColors(url, { fallback: "#000000" })

    let topColor = "#000000"
    let bottomColor = "#000000"

    if (colors.platform === "ios") {
      topColor = colors.secondary
      bottomColor = colors.primary
    } else if (colors.platform === "android") {
      topColor = colors.darkMuted ?? "#000000"
      bottomColor = colors.lightMuted ?? "#000000"
    }
    })
    setShareSheetVisible(false)
  }

  return (
    <>
      <Box>
        <Spacer mb={2} />
        <ImageCarouselFragmentContainer
          images={artwork.images as any /* STRICTNESS_MIGRATION */}
          cardHeight={screenDimensions.width >= 375 ? 340 : 290}
          onImageIndexChange={(imageIndex) => setCurrentImageIndex(imageIndex)}
        />
        <Flex alignItems="center" mt={2}>
          <ArtworkActions
            artwork={artwork}
            shareOnPress={() => {
              if (enableCustomShare) {
                setShareSheetVisible(true)
              } else {
                shareArtwork()
              }
            }}
          />
        </Flex>
        <Spacer mb={2} />
        <Box px={2}>
          <ArtworkTombstone artwork={artwork} />
        </Box>
      </Box>
      <CustomShareSheet visible={shareSheetVisible} setVisible={setShareSheetVisible}>
        <IGStoryViewShot shotRef={shotRef} href={currentImageUrl} />

        <CustomShareSheetItem title="Instagram Stories" Icon={<ChevronIcon />} onPress={() => {}} />
      </CustomShareSheet>
    </>
  )
}

export const ArtworkHeaderFragmentContainer = createFragmentContainer(ArtworkHeader, {
  artwork: graphql`
    fragment ArtworkHeader_artwork on Artwork {
      ...ArtworkActions_artwork
      ...ArtworkTombstone_artwork
      images {
        ...ImageCarousel_images
        url: imageURL
        imageVersions
      }
      title
      href
      artists {
        name
      }
    }
  `,
})
