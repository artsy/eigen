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
  WhatsAppAppIcon,
} from "@artsy/icons/native"
import { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet"
import Clipboard from "@react-native-clipboard/clipboard"
import { captureException, captureMessage } from "@sentry/react-native"
import { AutomountedBottomSheetModal } from "app/Components/BottomSheet/AutomountedBottomSheetModal"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { useShareSheet } from "app/Components/ShareSheet/ShareSheetContext"
import { CustomShareSheetItem } from "app/Components/ShareSheet/ShareSheetItem"
import { getShareImages, shareContent } from "app/Components/ShareSheet/helpers"
import { useToast } from "app/Components/Toast/toastHook"
import { InstagramStoryViewShot } from "app/Scenes/Artwork/Components/InstagramStoryViewShot"
import { SNAP_POINTS } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalArtistsPrompt"
import { GlobalStore } from "app/store/GlobalStore"
import { useCanOpenURL } from "app/utils/useCanOpenURL"
import { useRef, useState } from "react"
import Keys from "react-native-keys"
import Share, { Social } from "react-native-share"
import ViewShot from "react-native-view-shot"
import { useTracking } from "react-tracking"

export const ShareSheet = () => {
  const { isVisible, item: data, hideShareSheet } = useShareSheet()
  const isArtwork = data?.type === "artwork"
  const showWhatsAppItem = useCanOpenURL("whatsapp://send?phone=+491898")
  const toast = useToast()
  const shotRef = useRef<ViewShot>(null)
  const [isImageReady, setIsImageReady] = useState(false)
  const showInstagramStoriesItem =
    useCanOpenURL("instagram://user?username=instagram") && data?.type !== "sale"
  const { trackEvent } = useTracking()
  const webURL = GlobalStore.useAppState((s) => s.devicePrefs.environment.strings.webURL)

  if (!data) {
    return null
  }

  const { currentImageUrl } = getShareImages(data)

  const shareOnInstagramStory = async () => {
    const MAX_RETRIES = 2
    let base64Data: string | undefined

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        // Step 1: Validate ref is available
        if (!shotRef?.current?.capture || typeof shotRef.current.capture !== "function") {
          const error = new Error("ViewShot ref or capture function not available")
          if (attempt === MAX_RETRIES) {
            captureMessage("Instagram story share failed: ViewShot ref unavailable")
            console.error(error)
            throw error
          }
          // Retry after delay
          await new Promise((resolve) => setTimeout(resolve, 300))
          continue
        }

        // Step 2: Add delay before capture to ensure rendering is complete (especially important for first attempt)
        if (attempt > 0) {
          await new Promise((resolve) => setTimeout(resolve, 500))
        }

        // Step 3: Capture the screenshot
        base64Data = await shotRef.current.capture()

        // Step 4: Validate base64Data
        if (!base64Data) {
          const error = new Error("ViewShot capture returned empty base64")
          if (attempt === MAX_RETRIES) {
            console.error(error)
            captureMessage("Instagram story share failed: empty base64 after retries")
            throw error
          }
          // Retry after delay
          await new Promise((resolve) => setTimeout(resolve, 500))
          continue
        }

        // Success - break out of retry loop
        break
      } catch (error) {
        if (attempt === MAX_RETRIES) {
          throw error
        }
        // Continue to next retry
      }
    }

    try {
      if (!base64Data) {
        throw new Error("base64Data is not available after retry attempts")
      }
      // Step 5: Process the base64 and remove any line breaks https://github.com/react-native-share/react-native-share/issues/1506#issuecomment-2486205386
      const processedBase64Image = base64Data.replace(/(\r\n|\n|\r)/gm, "")

      // Step 6: If isArtwork, track event share
      if (isArtwork) {
        trackEvent(
          share(tracks.customShare(CustomService.instagram_stories, data?.internalID, data?.slug))
        )
      }

      // Step 7: Share to Instagram Stories
      try {
        await Share.shareSingle({
          appId: Keys.secureFor("ARTSY_FACEBOOK_APP_ID"),
          social: Social.InstagramStories,
          backgroundImage: `data:image/png;base64,${processedBase64Image}`,
        })
      } catch (error) {
        console.error("Failed to open Instagram story:", error)

        captureMessage("Instagram story share: native share dialog failed")
      } finally {
        hideShareSheet()
      }

      console.log("Share on Instagram story completed successfully")
    } catch (error) {
      console.error("Failed to share on Instagram story:", error)
      captureException(error)
    }
  }

  const shareOnWhatsApp = async () => {
    const details = shareContent(data)

    await Share.shareSingle({
      social: Social.Whatsapp,
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
  // note that we do not share the base64 image here since it is not supported
  // from most of the apps.
  const handleMorePress = async () => {
    const details = shareContent(data)

    const shareOptions = {
      title: details.title ?? "",
      message: details.message + "\n" + details.url,
    }

    try {
      const res = await Share.open({
        ...shareOptions,
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
    <AutomountedBottomSheetModal
      visible={isVisible}
      onDismiss={hideShareSheet}
      enableDynamicSizing
      snapPoints={SNAP_POINTS}
    >
      <BottomSheetView style={{ flex: 1 }}>
        <NavigationHeader useXButton onLeftButtonPress={() => hideShareSheet()}>
          Share
        </NavigationHeader>
        <BottomSheetScrollView>
          {data.type !== "sale" && data.type !== "default" && (
            <InstagramStoryViewShot
              shotRef={shotRef}
              href={currentImageUrl}
              artist={data.artists?.[0]?.name ?? ""}
              title={data?.title}
              onImageLoad={() => setIsImageReady(true)}
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
              disabled={!isImageReady}
              title="Instagram Stories"
              Icon={<InstagramAppIcon />}
              onPress={shareOnInstagramStory}
            />
          )}

          <CustomShareSheetItem title="Copy link" Icon={<LinkIcon />} onPress={handleCopyLink} />
          <CustomShareSheetItem title="More" Icon={<MoreIcon />} onPress={handleMorePress} />
        </BottomSheetScrollView>
      </BottomSheetView>
    </AutomountedBottomSheetModal>
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
