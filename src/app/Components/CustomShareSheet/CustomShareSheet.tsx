import {
  ActionType,
  ContextModule,
  CustomService,
  OwnerType,
  share,
  Share as ShareType,
} from "@artsy/cohesion"
import Clipboard from "@react-native-clipboard/clipboard"
import {
  CustomShareSheet_ArtworkQuery,
  CustomShareSheet_ArtworkQuery$data,
} from "__generated__/CustomShareSheet_ArtworkQuery.graphql"
import { InstagramStoryViewShot } from "app/Scenes/Artwork/Components/InstagramStoryViewShot"
import { unsafe__getEnvironment } from "app/store/GlobalStore"
import { Schema } from "app/utils/track"
import { useCanOpenURL } from "app/utils/useCanOpenURL"
import { take } from "lodash"
import {
  ChevronIcon,
  Flex,
  InstagramAppIcon,
  LinkIcon,
  MoreIcon,
  ShareIcon,
  Text,
  Touchable,
  WhatsAppAppIcon,
} from "palette"
import React, { useRef } from "react"
import { ScrollView } from "react-native"
import Share from "react-native-share"
import ViewShot from "react-native-view-shot"
import { useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"
import { graphql } from "relay-runtime"
import RNFetchBlob from "rn-fetch-blob"
import { useScreenDimensions } from "shared/hooks"
import { FancyModal } from "../FancyModal/FancyModal"
import { FancyModalHeader } from "../FancyModal/FancyModalHeader"
import { useToast } from "../Toast/toastHook"
import { useCustomShareSheetInternal } from "./atoms"

export const CustomShareSheet = () => {
  const { visible, item, hide } = useCustomShareSheetInternal()
  const showInstagramStoriesItem = useCanOpenURL("instagram://user?username=instagram")
  const showWhatsAppItem = useCanOpenURL("whatsapp://send?phone=+491898")
  const { height: screenHeight } = useScreenDimensions()
  const toast = useToast()
  const shotRef = useRef<ViewShot>(null)
  const { trackEvent } = useTracking()
  const data = useLazyLoadQuery<CustomShareSheet_ArtworkQuery>(artworkQuery, {
    slug: item?.slug ?? "",
    skip: !item,
  })

  if (!data || !data.artwork) {
    return null
  }

  const currentImage = (data.artwork.images ?? [])[item?.currentImageIndex ?? 0]
  const currentImageUrl = (currentImage?.url ?? "").replace(":version", "normalized")
  const smallImageURL = (currentImage?.url ?? "").replace(":version", "small")

  const shareArtworkOnInstagramStory = async () => {
    const base64RawData = await shotRef.current!.capture!()
    const base64Data = `data:image/png;base64,${base64RawData}`

    await Share.shareSingle({
      social: Share.Social.INSTAGRAM_STORIES,
      backgroundImage: base64Data,
    })
    trackEvent(
      share(
        tracks.customShare(
          CustomService.instagram_stories,
          data.artwork!.internalID,
          data.artwork?.slug
        )
      )
    )
    hide()
  }

  const shareArtworkOnWhatsApp = async () => {
    const details = shareContent(data.artwork!)

    await Share.shareSingle({
      social: Share.Social.WHATSAPP,
      message: details.message ?? "",
      url: details.url,
    })
    trackEvent(
      share(
        tracks.customShare(CustomService.whatsapp, data.artwork!.internalID, data.artwork?.slug)
      )
    )
    hide()
  }

  const shareArtworkCopyLink = () => {
    Clipboard.setString(`${unsafe__getEnvironment().webURL}${data.artwork?.href}`)
    trackEvent(
      share(
        tracks.customShare(CustomService.copy_link, data.artwork!.internalID, data.artwork?.slug)
      )
    )
    hide()
    toast.show("Copied to Clipboard", "middle", { Icon: ShareIcon })
  }

  const shareArtwork = async () => {
    trackEvent({
      action_name: Schema.ActionNames.Share,
      action_type: Schema.ActionTypes.Tap,
      context_module: Schema.ContextModules.ArtworkActions,
    })

    const details = shareContent(data.artwork!)

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
      trackEvent(share(tracks.iosShare(res.message, data.artwork!.internalID, data.artwork?.slug)))
    } catch (err) {
      console.log({ err })
    } finally {
      hide()
    }
  }

  return (
    <FancyModal maxHeight={screenHeight / 2} visible={visible} onBackgroundPressed={() => hide()}>
      <FancyModalHeader useXButton onLeftButtonPress={() => hide()}>
        Share
      </FancyModalHeader>
      <ScrollView>
        <InstagramStoryViewShot
          shotRef={shotRef}
          href={currentImageUrl}
          artist={data.artwork.artists![0]?.name!}
          title={data.artwork.title!}
        />

        {showWhatsAppItem ? (
          <CustomShareSheetItem
            title="WhatsApp"
            Icon={<WhatsAppAppIcon />}
            onPress={shareArtworkOnWhatsApp}
          />
        ) : null}
        {showInstagramStoriesItem ? (
          <CustomShareSheetItem
            title="Instagram Stories"
            Icon={<InstagramAppIcon />}
            onPress={shareArtworkOnInstagramStory}
          />
        ) : null}

        <CustomShareSheetItem
          title="Copy link"
          Icon={<LinkIcon />}
          onPress={shareArtworkCopyLink}
        />
        <CustomShareSheetItem title="More" Icon={<MoreIcon />} onPress={shareArtwork} />
      </ScrollView>
    </FancyModal>
  )
}

interface CustomShareSheetItemProps {
  title: string
  Icon: React.ReactNode
  onPress?: () => void
}

const CustomShareSheetItem: React.FC<CustomShareSheetItemProps> = ({ title, Icon, onPress }) => (
  <Touchable onPress={onPress}>
    <Flex width="100%" height={60} flexDirection="row" alignItems="center" px="2">
      {Icon}
      <Text variant="sm" ml="2">
        {title}
      </Text>
      <Flex flex={1} />
      <ChevronIcon />
    </Flex>
  </Touchable>
)

export const shareContent = (
  artwork: NonNullable<CustomShareSheet_ArtworkQuery$data["artwork"]>
) => {
  const { title, href, artists } = artwork
  let computedTitle = ""

  if (artists && artists.length) {
    const names = take(artists, 3).map((artist) => artist?.name ?? "")
    computedTitle = `${title} by ${names.join(", ")} on Artsy`
  } else if (title) {
    computedTitle = `${title} on Artsy`
  }

  return {
    title: computedTitle,
    message: computedTitle,
    url: `${unsafe__getEnvironment().webURL}${href}?utm_content=artwork-share`,
  }
}

const artworkQuery = graphql`
  query CustomShareSheet_ArtworkQuery($slug: String!, $skip: Boolean!) {
    artwork(id: $slug) @skip(if: $skip) {
      slug
      internalID
      href
      images {
        url: imageURL
      }
      title
      artists {
        name
      }
    }
  }
`

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
