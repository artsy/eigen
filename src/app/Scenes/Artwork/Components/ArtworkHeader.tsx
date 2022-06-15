import { ContextModule, CustomService, OwnerType, share } from "@artsy/cohesion"
import Clipboard from "@react-native-community/clipboard"
import { ArtworkHeader_artwork$data } from "__generated__/ArtworkHeader_artwork.graphql"
import { CustomShareSheet, CustomShareSheetItem } from "app/Components/CustomShareSheet"
import { useToast } from "app/Components/Toast/toastHook"
import { unsafe__getEnvironment, useDevToggle } from "app/store/GlobalStore"
import { Schema } from "app/utils/track"
import { useCanOpenURL } from "app/utils/useCanOpenURL"
import {
  Box,
  Flex,
  InstagramAppIcon,
  LinkIcon,
  MoreIcon,
  ShareIcon,
  Spacer,
  WhatsAppAppIcon,
} from "palette"
import React, { useRef, useState } from "react"
import { Button, Modal } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import Share from "react-native-share"
import ViewShot from "react-native-view-shot"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { useScreenDimensions } from "shared/hooks"
import { ArtworkActionsFragmentContainer as ArtworkActions, shareContent } from "./ArtworkActions"
import { ArtworkTombstoneFragmentContainer as ArtworkTombstone } from "./ArtworkTombstone"
import { ImageCarouselFragmentContainer } from "./ImageCarousel/ImageCarousel"
import { InstagramStoryViewShot } from "./InstagramStoryViewShot"

interface ArtworkHeaderProps {
  artwork: ArtworkHeader_artwork$data
}

export const ArtworkHeader: React.FC<ArtworkHeaderProps> = (props) => {
  const { artwork } = props
  const screenDimensions = useScreenDimensions()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { trackEvent } = useTracking()
  const debugInstagramShot = useDevToggle("DTShowInstagramShot")
  const [showInstagramShot, setShowInstagramShot] = useState(false)
  const shotRef = useRef<ViewShot>(null)
  const [shareSheetVisible, setShareSheetVisible] = useState(false)
  const toast = useToast()

  const showWhatsAppItem = useCanOpenURL("whatsapp://send?phone=+491898")
  const showInstagramStoriesItem = useCanOpenURL("instagram://user?username=instagram")

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

    const base64RawData = await shotRef.current!.capture!()
    const base64Data = `data:image/png;base64,${base64RawData}`

    try {
      const res = await Share.open({
        title: details.title ?? "",
        url: base64Data,
        message: details.message + "\n" + details.url,
      })
      trackEvent(share(tracks.iosShare(res.message, artwork.internalID, artwork.slug)))
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
      message: details.message ?? "",
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
      backgroundImage: base64Data,
    })
    trackEvent(
      share(tracks.customShare(CustomService.instagram_stories, artwork.internalID, artwork.slug))
    )
    setShareSheetVisible(false)
  }

  const shareArtworkCopyLink = async () => {
    Clipboard.setString(`${unsafe__getEnvironment().webURL}${artwork.href!}`)
    trackEvent(share(tracks.customShare(CustomService.copy_link, artwork.internalID, artwork.slug)))
    setShareSheetVisible(false)
    toast.show("Copied to Clipboard", "middle", { Icon: ShareIcon })
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

        {debugInstagramShot ? (
          <Button title="debug instagram shot" onPress={() => setShowInstagramShot(true)} />
        ) : null}

        <Flex alignItems="center" mt={2}>
          <ArtworkActions
            artwork={artwork}
            shareOnPress={() => {
              setShareSheetVisible(true)
            }}
          />
        </Flex>
        <Spacer mb={4} />
        <Box px={2}>
          <ArtworkTombstone artwork={artwork} />
        </Box>
      </Box>
      <CustomShareSheet visible={shareSheetVisible} setVisible={setShareSheetVisible}>
        <ScrollView>
          <InstagramStoryViewShot
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
          <CustomShareSheetItem
            title="Copy link"
            Icon={<LinkIcon />}
            onPress={() => shareArtworkCopyLink()}
          />
          <CustomShareSheetItem title="More" Icon={<MoreIcon />} onPress={() => shareArtwork()} />
        </ScrollView>
      </CustomShareSheet>

      {debugInstagramShot && showInstagramShot ? (
        <Modal visible={showInstagramShot} onRequestClose={() => setShowInstagramShot(false)}>
          <InstagramStoryViewShot
            // @ts-ignore
            shotRef={undefined}
            href={currentImageUrl}
            artist={artwork.artists![0]?.name!}
            title={artwork.title!}
          />
          <Flex position="absolute" top={100} left={0}>
            <Button title="close instagram shot" onPress={() => setShowInstagramShot(false)} />
          </Flex>
        </Modal>
      ) : null}
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
