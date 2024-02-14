import {
  ActionType,
  ContextModule,
  CustomService,
  OwnerType,
  share,
  Share as ShareType,
} from "@artsy/cohesion"
import {
  InstagramAppIcon,
  LinkIcon,
  MoreIcon,
  ShareIcon,
  useScreenDimensions,
  WhatsAppAppIcon,
} from "@artsy/palette-mobile"
import Clipboard from "@react-native-clipboard/clipboard"
import { captureMessage } from "@sentry/react-native"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { useShareSheet } from "app/Components/ShareSheet/ShareSheetContext"
import { CustomShareSheetItem } from "app/Components/ShareSheet/ShareSheetItem"
import {
  getBase64Data,
  getImageBase64,
  getShareImages,
  shareContent,
} from "app/Components/ShareSheet/helpers"
import { useToast } from "app/Components/Toast/toastHook"
import { InstagramStoryViewShot } from "app/Scenes/Artwork/Components/InstagramStoryViewShot"
import { GlobalStore } from "app/store/GlobalStore"
import { useCanOpenURL } from "app/utils/useCanOpenURL"
import { useRef } from "react"
import { InteractionManager, ScrollView } from "react-native"
import Config from "react-native-config"
import Share from "react-native-share"
import ViewShot from "react-native-view-shot"
import { useTracking } from "react-tracking"

export const ShareSheet = () => {
  const { isVisible, item: data, hideShareSheet } = useShareSheet()
  const isArtwork = data?.type === "artwork"
  const showInstagramStoriesItem =
    useCanOpenURL("instagram://user?username=instagram") && data?.type !== "sale"
  const showWhatsAppItem = useCanOpenURL("whatsapp://send?phone=+491898")
  const { height: screenHeight } = useScreenDimensions()
  const toast = useToast()
  const shotRef = useRef<ViewShot>(null)
  const { trackEvent } = useTracking()
  const webURL = GlobalStore.useAppState((s) => s.devicePrefs.environment.strings.webURL)

  if (!data) {
    return null
  }

  const { currentImageUrl } = getShareImages(data)

  const shareOnInstagramStory = async () => {
    if (!shotRef.current) {
      return
    }

    const base64Data = await getBase64Data(shotRef.current)

    // first hide the share sheet
    hideShareSheet()

    if (isArtwork) {
      // track if the user shares the artwork
      trackEvent(
        share(tracks.customShare(CustomService.instagram_stories, data?.internalID, data?.slug))
      )
    }

    // run the share after the analytics and hideShareSheet interactions are done
    InteractionManager.runAfterInteractions(async () => {
      try {
        await Share.shareSingle({
          appId: Config.ARTSY_FACEBOOK_APP_ID,
          social: Share.Social.INSTAGRAM_STORIES,
          backgroundImage: base64Data,
        })
      } catch (err) {
        captureMessage("Error sharing to Instagram Stories")
      }
    })
  }

  const shareOnWhatsApp = async () => {
    const details = shareContent(data)

    await Share.shareSingle({
      social: Share.Social.WHATSAPP,
      message: details.message ?? "",
      url: details.url,
    })
    isArtwork &&
      trackEvent(share(tracks.customShare(CustomService.whatsapp, data.internalID, data.slug)))

    hideShareSheet()
  }

  const handleCopyLink = () => {
    Clipboard.setString(`${webURL}${data.href}`)
    isArtwork &&
      trackEvent(share(tracks.customShare(CustomService.copy_link, data.internalID, data.slug)))
    hideShareSheet()
    toast.show("Copied to Clipboard", "middle", { Icon: ShareIcon })
  }

  // User presses the more button and is presented with a native list of options
  const handleMorePress = async () => {
    const details = shareContent(data)

    const shareOptions = {
      title: details.title ?? "",
      message: details.message + "\n" + details.url,
    }

    let base64Data = ""
    if (data.type !== "sale") {
      base64Data = await getImageBase64(currentImageUrl)
    }

    try {
      const res = await Share.open({
        ...shareOptions,
        ...(!!base64Data && { url: base64Data }),
      })

      if (isArtwork) {
        trackEvent(share(tracks.iosShare(res.message, data?.internalID, data.slug)))
      }
    } catch (err) {
      // User dismissed without sharing
      console.log(err)
    } finally {
      hideShareSheet()
    }
  }

  return (
    <FancyModal
      maxHeight={screenHeight / 2}
      visible={isVisible}
      onBackgroundPressed={() => hideShareSheet()}
    >
      <FancyModalHeader useXButton onLeftButtonPress={() => hideShareSheet()}>
        Share
      </FancyModalHeader>
      <ScrollView>
        {data.type !== "sale" && (
          <InstagramStoryViewShot
            shotRef={shotRef}
            href={currentImageUrl}
            artist={data.artists?.[0]?.name ?? ""}
            title={data?.title}
          />
        )}

        {!!showWhatsAppItem && (
          <CustomShareSheetItem
            title="WhatsApp"
            Icon={<WhatsAppAppIcon />}
            onPress={shareOnWhatsApp}
          />
        )}
        {!!showInstagramStoriesItem && (
          <CustomShareSheetItem
            title="Instagram Stories"
            Icon={<InstagramAppIcon />}
            onPress={shareOnInstagramStory}
          />
        )}

        <CustomShareSheetItem title="Copy link" Icon={<LinkIcon />} onPress={handleCopyLink} />
        <CustomShareSheetItem title="More" Icon={<MoreIcon />} onPress={handleMorePress} />
      </ScrollView>
    </FancyModal>
  )
}

export const tracks = {
  customShare: (service: string, id: string, slug?: string): ShareType => ({
    action: ActionType.share,
    context_module: ContextModule.artworkImage,
    context_owner_type: OwnerType.artwork,
    context_owner_id: id,
    context_owner_slug: slug,
    service,
  }),
  iosShare: (app: string, id: string, slug?: string): ShareType => ({
    action: ActionType.share,
    context_module: ContextModule.artworkImage,
    context_owner_type: OwnerType.artwork,
    context_owner_id: id,
    context_owner_slug: slug,
    service: app,
  }),
}
