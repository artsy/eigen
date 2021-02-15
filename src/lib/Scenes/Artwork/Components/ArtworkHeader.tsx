import { ContextModule, CustomService, OwnerType, share } from "@artsy/cohesion"
import Clipboard from "@react-native-community/clipboard"
import { ArtworkHeader_artwork } from "__generated__/ArtworkHeader_artwork.graphql"
import { CustomShareSheet, CustomShareSheetItem } from "lib/Components/CustomShareSheet"
import { useToast } from "lib/Components/Toast/toastHook"
import { getCurrentEmissionState, useFeatureFlag } from "lib/store/GlobalStore"
import { Schema } from "lib/utils/track"
import { useCanOpenURL } from "lib/utils/useCanOpenURL"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Flex, InstagramAppIcon, LinkIcon, MoreIcon, ShareIcon, Spacer, WhatsAppAppIcon } from "palette"
import React, { useRef, useState } from "react"
import { ScrollView } from "react-native-gesture-handler"
// @ts-ignore
import Share from "react-native-share"
import ViewShot from "react-native-view-shot"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import RNFetchBlob from "rn-fetch-blob"
import { ArtworkActionsFragmentContainer as ArtworkActions, shareContent } from "./ArtworkActions"
import { ArtworkTombstoneFragmentContainer as ArtworkTombstone } from "./ArtworkTombstone"
import { IGStoryViewShot } from "./IGStoryViewShot"
import { ImageCarouselFragmentContainer } from "./ImageCarousel/ImageCarousel"

interface ArtworkHeaderProps {
  artwork: ArtworkHeader_artwork
}

export const ArtworkHeader: React.FC<ArtworkHeaderProps> = (props) => {
  const { artwork } = props
  const screenDimensions = useScreenDimensions()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { trackEvent } = useTracking()
  const enableCustomShare = useFeatureFlag("AREnableCustomSharesheet")
  const shotRef = useRef<ViewShot>(null)
  const [shareSheetVisible, setShareSheetVisible] = useState(false)
  const toast = useToast()
  const showWhatsAppItem = useCanOpenURL("whatsapp://test")
  const showInstagramStoriesItem = useCanOpenURL("instagram-stories://test")

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
      trackEvent(share(tracks.iosShare(res.app, artwork.internalID, artwork.slug)))
    } catch (err) {
      console.log({ err })
    } finally {
      setShareSheetVisible(false)
    }
  }

  const shareArtworkOnWhatsApp = async () => {
    const { title, href, artists } = artwork
    const details = shareContent(title!, href!, artists)

    await Share.shareSingle({
      social: Share.Social.WHATSAPP,
      message: details.message,
      url: details.url,
    })
    trackEvent(share(tracks.customShare(CustomService.whatsapp, artwork.internalID, artwork.slug)))
    setShareSheetVisible(false)
  }

  const shareArtworkOnInstagramStory = async () => {
    const base64RawData = await shotRef.current!.capture!()
    const base64Data = `data:image/png;base64,${base64RawData}`

    await Share.shareSingle({
      social: Share.Social.INSTAGRAM_STORIES,
      method: Share.InstagramStories.SHARE_BACKGROUND_IMAGE,
      backgroundTopColor: "#ffffff",
      backgroundBottomColor: "#ffffff",
      backgroundImage: base64Data,
    })
    trackEvent(share(tracks.customShare(CustomService.instagram_stories, artwork.internalID, artwork.slug)))
    setShareSheetVisible(false)
  }

  const shareArtworkCopyLink = async () => {
    Clipboard.setString(`${getCurrentEmissionState().webURL}${artwork.href!}`)
    trackEvent(share(tracks.customShare(CustomService.copy_link, artwork.internalID, artwork.slug)))
    setShareSheetVisible(false)
    toast.show("Copied to Clipboard", "middle", { Icon: ShareIcon })
  }

  return (
    <>
      <Box>
        <Spacer mb="2" />
        <ImageCarouselFragmentContainer
          images={artwork.images as any /* STRICTNESS_MIGRATION */}
          cardHeight={screenDimensions.width >= 375 ? 340 : 290}
          onImageIndexChange={(imageIndex) => setCurrentImageIndex(imageIndex)}
        />
        <Flex alignItems="center" mt="2">
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
        <Spacer mb="2" />
        <Box px="2">
          <ArtworkTombstone artwork={artwork} />
        </Box>
      </Box>
      <CustomShareSheet visible={shareSheetVisible} setVisible={setShareSheetVisible}>
        <ScrollView>
          <IGStoryViewShot
            shotRef={shotRef}
            href={currentImageUrl}
            artist={artwork.artists![0]?.name!}
            title={artwork.title!}
          />

          {showWhatsAppItem ? (
            <CustomShareSheetItem
              title="WhatsApp"
              Icon={<WhatsAppAppIcon />}
              onPress={() => shareArtworkOnWhatsApp()}
            />
          ) : null}
          {showInstagramStoriesItem ? (
            <CustomShareSheetItem
              title="Instagram Stories"
              Icon={<InstagramAppIcon />}
              onPress={() => shareArtworkOnInstagramStory()}
            />
          ) : null}
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
      }
      title
      href
      internalID
      slug
      artists {
        name
      }
    }
  `,
})

export const tracks = {
  customShare: (service: string, id: string, slug?: string) => ({
    context_module: ContextModule.artworkImage,
    context_owner_type: OwnerType.artwork,
    context_owner_id: id,
    context_owner_slug: slug,
    service,
  }),
  iosShare: (app: string, id: string, slug?: string) => ({
    context_module: ContextModule.artworkImage,
    context_owner_type: OwnerType.artwork,
    context_owner_id: id,
    context_owner_slug: slug,
    service: app,
  }),
}
