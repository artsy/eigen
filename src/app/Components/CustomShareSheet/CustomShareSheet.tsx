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
import { useCustomShareSheet } from "app/Components/CustomShareSheet/CustomShareSheetContext"
import { CustomShareSheetItem } from "app/Components/CustomShareSheet/CustomShareSheetItem"
import { shareContent } from "app/Components/CustomShareSheet/helpers"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { useToast } from "app/Components/Toast/toastHook"
import { InstagramStoryViewShot } from "app/Scenes/Artwork/Components/InstagramStoryViewShot"
import { unsafe__getEnvironment } from "app/store/GlobalStore"
import { Schema } from "app/utils/track"
import { useCanOpenURL } from "app/utils/useCanOpenURL"
import { useRef } from "react"
import { ScrollView } from "react-native"
import Config from "react-native-config"
import Share from "react-native-share"
import ViewShot from "react-native-view-shot"
import { useTracking } from "react-tracking"
import RNFetchBlob from "rn-fetch-blob"

export const CustomShareSheet = () => {
  const { isVisible, item: data, hideShareSheet } = useCustomShareSheet()
  const showInstagramStoriesItem =
    useCanOpenURL("instagram://user?username=instagram") && data?.type !== "sale"
  const showWhatsAppItem = useCanOpenURL("whatsapp://send?phone=+491898")
  const { height: screenHeight } = useScreenDimensions()
  const toast = useToast()
  const shotRef = useRef<ViewShot>(null)
  const { trackEvent } = useTracking()

  if (!data) {
    return null
  }

  const currentImage = (data.images ?? [])[data?.currentImageIndex ?? 0]
  const currentImageUrl = (data?.currentImage ?? currentImage?.url ?? "").replace(
    ":version",
    "normalized"
  )
  const smallImageURL = (currentImage?.url ?? "").replace(":version", "small")

  const shareOnInstagramStory = async () => {
    const base64RawData = await shotRef.current!.capture!()
    const base64Data = `data:image/png;base64,${base64RawData}`

    await Share.shareSingle({
      appId: Config.ARTSY_FACEBOOK_APP_ID,
      social: Share.Social.INSTAGRAM_STORIES,
      backgroundImage: base64Data,
    })
    trackEvent(
      share(tracks.customShare(CustomService.instagram_stories, data!.internalID, data?.slug))
    )
    hideShareSheet()
  }

  const shareOnWhatsApp = async () => {
    const details = shareContent(data)

    await Share.shareSingle({
      social: Share.Social.WHATSAPP,
      message: details.message ?? "",
      url: details.url,
    })
    trackEvent(share(tracks.customShare(CustomService.whatsapp, data.internalID, data.slug)))

    hideShareSheet()
  }

  const handleCopyLink = () => {
    Clipboard.setString(`${unsafe__getEnvironment().webURL}${data.href}`)
    trackEvent(share(tracks.customShare(CustomService.copy_link, data.internalID, data.slug)))
    hideShareSheet()
    toast.show("Copied to Clipboard", "middle", { Icon: ShareIcon })
  }

  // User presses the more button and is presented with a native list of options
  const handleMorePress = async () => {
    // this is not getting called on sale, do we want to track this there?
    if (data.type === "artwork") {
      trackEvent({
        action_name: Schema.ActionNames.Share,
        action_type: Schema.ActionTypes.Tap,
        context_module: Schema.ContextModules.ArtworkActions,
      })
    }

    const details = shareContent(data)

    const resp = await RNFetchBlob.config({
      fileCache: true,
    }).fetch("GET", smallImageURL)

    const base64RawData = await resp.base64()
    const base64Data = `data:image/png;base64,${base64RawData}`

    try {
      const res = await Share.open({
        title: details.title ?? "",
        url: base64Data,
        message: details.message + "\n" + details.url,
      })
      trackEvent(share(tracks.iosShare(res.message, data!.internalID, data.slug)))
    } catch (err) {
      console.log({ err })
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
            artist={data.artists![0]?.name!}
            title={data.title!}
          />
        )}

        {showWhatsAppItem ? (
          <CustomShareSheetItem
            title="WhatsApp"
            Icon={<WhatsAppAppIcon />}
            onPress={shareOnWhatsApp}
          />
        ) : null}
        {showInstagramStoriesItem ? (
          <CustomShareSheetItem
            title="Instagram Stories"
            Icon={<InstagramAppIcon />}
            onPress={shareOnInstagramStory}
          />
        ) : null}

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
