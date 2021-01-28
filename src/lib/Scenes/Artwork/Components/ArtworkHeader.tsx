import { ArtworkHeader_artwork } from "__generated__/ArtworkHeader_artwork.graphql"
import { Schema } from "lib/utils/track"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import {
  ArtsyLogoBlackIcon,
  Box,
  Flex,
  FlexProps,
  WhatsAppAppIcon,
  InstagramAppIcon,
  LinkIcon,
  MoreIcon,
  Spacer,
  Text,
} from "palette"
import React, { RefObject, useEffect, useRef, useState } from "react"
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
// @ts-ignore
import Color from "color"
import { useEmissionOption } from "lib/store/GlobalStore"
import { CustomShareSheet, CustomShareSheetItem } from "lib/Components/CustomShareSheet"
import Clipboard from "@react-native-community/clipboard"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { ScrollView } from "react-native-gesture-handler"

const extractGradientColors = async (url: string) => {
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

  return { topColor, bottomColor }
}

interface IGStoryViewShotProps {
  shotRef: RefObject<ViewShot>
  href: string
  aspectRatio: number
  artist: string
  title: string
}

const IGStoryViewShot: React.FC<IGStoryViewShotProps> = ({ shotRef, href, aspectRatio, artist, title }) => {
  const { height: screenHeight, width: screenWidth } = useScreenDimensions()
  const [logo, setLogo] = useState<"light" | "dark">("dark")
  const [text, setText] = useState<"light" | "dark">("dark")

  const debugViewShot = false

  const outerStyleProps: FlexProps = debugViewShot
    ? {}
    : {
        position: "absolute",
        left: screenWidth + screenHeight,
        top: screenWidth + screenHeight,
      }

  const innerStyleProps: FlexProps = debugViewShot
    ? {
        borderWidth: 1,
        borderColor: "black",
      }
    : {}

  useEffect(() => {
    const doIt = async () => {
      const { topColor, bottomColor } = await extractGradientColors(href)
      setLogo(Color(topColor).isDark() ? "light" : "dark")
      setText(Color(bottomColor).isDark() ? "light" : "dark")
    }
    doIt()
  }, [])

  return (
    <Flex {...outerStyleProps} alignItems="center">
      <ViewShot ref={shotRef} options={{ format: "png", result: "base64" }}>
        <Flex alignItems="center" {...innerStyleProps} height={400}>
          {logo === "dark" ? <ArtsyLogoBlackIcon /> : <ArtsyLogoBlackIcon fill="white100" />}
          <Spacer mt="2" />
          <OpaqueImageView highPriority imageURL={href} style={{ flex: 1 }} aspectRatio={aspectRatio} />
          <Spacer mt="2" />
          <Text variant="mediumText" color={text === "dark" ? "black100" : "white100"}>
            {artist}
          </Text>
          <Text variant="text" color={text === "dark" ? "black100" : "white100"} opacity={0.6}>
            {title}
          </Text>
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
  const shotRef = useRef<ViewShot>(null)
  const [shareSheetVisible, setShareSheetVisible] = useState(false)

  const currentImage = (artwork.images ?? [])[currentImageIndex]
  const currentImageUrl = (currentImage?.url ?? "").replace(":version", "large")

  const shareArtwork = async () => {
    trackEvent({
      action_name: Schema.ActionNames.Share,
      action_type: Schema.ActionTypes.Tap,
      context_module: Schema.ContextModules.ArtworkActions,
    })

    const { title, href, artists } = artwork
    const details = shareContent(title!, href!, artists)

    const resp = await RNFetchBlob.config({
      fileCache: true,
    }).fetch("GET", currentImageUrl)

    const base64RawData = await resp.base64()
    const base64Data = `data:image/png;base64,${base64RawData}`

    try {
      const res = await Share.open({
        title: details.title,
        urls: [base64Data, details.url],
        message: details.message,
      })
      // placeholder for analytics
      console.log({ res })
      // {"res": {"app": "com.facebook.Messenger.ShareExtension", "message": "com.facebook.Messenger.ShareExtension"}}
    } catch (err) {
      // placeholder for analytics
      console.log({ err })
      // {"err": [Error: User did not share]}
    } finally {
      setShareSheetVisible(false)
    }
  }

  const shareArtworkOnInstagramStory = async () => {
    const { topColor, bottomColor } = await extractGradientColors(currentImageUrl)

    const base64RawData = await shotRef.current!.capture!()
    const base64Data = `data:image/png;base64,${base64RawData}`

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
        <ScrollView>
          <IGStoryViewShot
            shotRef={shotRef}
            href={currentImageUrl}
            aspectRatio={currentImage!.aspectRatio}
            artist={artwork.artists![0]?.name!}
            title={artwork.title!}
          />

          <CustomShareSheetItem
            title="WhatsApp"
            Icon={<WhatsAppAppIcon />}
            onPress={() => shareArtworkOnInstagramStory()}
          />
          <CustomShareSheetItem
            title="Instagram Stories"
            Icon={<InstagramAppIcon />}
            onPress={() => shareArtworkOnInstagramStory()}
          />
          <CustomShareSheetItem title="Copy link" Icon={<LinkIcon />} onPress={() => shareArtworkCopyLink()} />
          <CustomShareSheetItem title="More" Icon={<MoreIcon />} onPress={() => shareArtwork()} />
        </ScrollView>
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
        aspectRatio
      }
      title
      href
      artists {
        name
      }
    }
  `,
})
