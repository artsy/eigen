import { ArtworkHeader_artwork } from "__generated__/ArtworkHeader_artwork.graphql"
import { Schema } from "lib/utils/track"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Flex, FlexProps, InstagramAppIcon, LinkIcon, MoreIcon, Spacer, Text } from "palette"
import React, { useRef, useState } from "react"
import ImageColors from "react-native-image-colors"
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
import { Image } from "react-native"
import { CustomShareSheet, CustomShareSheetItem } from "lib/Components/CustomShareSheet"
import Clipboard from "@react-native-community/clipboard"

const IGStoryViewShot: React.FC<{ shotRef: any; href: string }> = ({ shotRef, href }) => {
  const { height: screenHeight, width: screenWidth } = useScreenDimensions()

    ? {}
    : {
        position: "absolute",
        left: screenWidth + screenHeight,
        top: screenWidth + screenHeight,
  return (
    <Flex {...outerStyleProps}>
      <ViewShot ref={shotRef} options={{ format: "png", result: "base64" }} style={{ backgroundColor: "orange" }}>
        </Flex>
      </ViewShot>
    </Flex>
  )
}

interface ArtworkHeaderProps {
  artwork: ArtworkHeader_artwork
}

export const ArtworkHeader: React.FC<ArtworkHeaderProps> = (props) => {
  const { artwork } = props
  const screenDimensions = useScreenDimensions()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { trackEvent } = useTracking()
  const enableCustomShare = useEmissionOption("AREnableCustomSharesheet")
  const shotRef = useRef(null)
  const [shareSheetVisible, setShareSheetVisible] = useState(false)

  const currentImageUrl = ((artwork.images ?? [])[currentImageIndex]?.url ?? "").replace(":version", "large")

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

    try {
      const res = await Share.open({
        title: details.title,
        urls: [base64Data, details.url],
        message: details.message,
      })
      console.log({ res })
      // {"res": {"app": "com.facebook.Messenger.ShareExtension", "message": "com.facebook.Messenger.ShareExtension"}}
    } catch (err) {
      // didnt use  the ios share . analytics?
      console.log({ err })
      //  {"err": [Error: User did not share]}
    } finally {
      setShareSheetVisible(false)
    }
  }

  const shareArtworkOnInstagramStory = async () => {
    const base64RawData = await shotRef.current.capture()

    const url = ((artwork.images ?? [])[currentImageIndex]?.url ?? "").replace(":version", "large")

    const base64Data = `data:image/png;base64,${base64RawData}`
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

    await Share.shareSingle({
      social: Share.Social.INSTAGRAM_STORIES,
      method: Share.InstagramStories.SHARE_STICKER_IMAGE,
      backgroundTopColor: topColor,
      backgroundBottomColor: bottomColor,
      stickerImage: base64Data,
    })
    setShareSheetVisible(false)
  }

  const shareArtworkCopyLink = async () => {
    Clipboard.setString(`https://artsy.net${artwork.href!}`)
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

        <CustomShareSheetItem
          title="Instagram Stories"
          Icon={<InstagramAppIcon />}
          onPress={() => shareArtworkOnInstagramStory()}
        />
        <CustomShareSheetItem title="Copy link" Icon={<LinkIcon />} onPress={() => shareArtworkCopyLink()} />
        <CustomShareSheetItem title="More" Icon={<MoreIcon />} onPress={() => shareArtwork()} />
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
