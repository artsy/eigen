import { ActionType, ContextModule, OwnerType, Share } from "@artsy/cohesion"
import { Button, Flex, Input, Spacer, Switch, Text } from "@artsy/palette-mobile"
import { useBottomSheetModal } from "@gorhom/bottom-sheet"
import Clipboard from "@react-native-clipboard/clipboard"
import { captureMessage } from "@sentry/react-native"
import { ArtworkListsBottomSheetSectionTitle } from "app/Components/ArtworkLists/components/ArtworkListsBottomSheetSectionTitle"
import { useArtworkListsBottomOffset } from "app/Components/ArtworkLists/useArtworkListsBottomOffset"
import {
  AutoHeightBottomSheet,
  AutoHeightBottomSheetProps,
} from "app/Components/BottomSheet/AutoHeightBottomSheet"
import { useToast } from "app/Components/Toast/toastHook"
import { HeaderMenuArtworkListEntity } from "app/Scenes/ArtworkList/types"
import { GlobalStore } from "app/store/GlobalStore"
import { FC, useState } from "react"
import { useTracking } from "react-tracking"
import { useShareArtworkList } from "./useShareArtworkList"

const NAME = "ShareArtworkListView"

interface ShareArtworkListViewProps extends Omit<AutoHeightBottomSheetProps, "children"> {
  artworkListEntity: HeaderMenuArtworkListEntity
  onDismiss: () => void
}

export const ShareArtworkListView: FC<ShareArtworkListViewProps> = ({
  artworkListEntity,
  ...rest
}) => {
  const [isShared, setIsShared] = useState(!artworkListEntity.private)
  const [slug, setSlug] = useState(artworkListEntity.slug)
  const bottomOffset = useArtworkListsBottomOffset(2)
  const toast = useToast()
  const { trackEvent } = useTracking()
  const { dismiss } = useBottomSheetModal()
  const [commit, isLoading] = useShareArtworkList()
  const userId = GlobalStore.useAppState((state) => state.auth.userID)

  const url = `https://www.artsy.net/user/${userId}/collection/${
    slug ?? artworkListEntity.internalID
  }`

  const closeView = () => {
    dismiss(NAME)
  }

  const handleToggle = (value: boolean) => {
    setIsShared(value)

    commit({
      variables: {
        input: {
          id: artworkListEntity.internalID,
          private: !value,
        },
      },
      onCompleted: (data) => {
        const response = data.updateCollection?.responseOrError
        if (response?.__typename === "UpdateCollectionSuccess") {
          setSlug(response.collection?.slug ?? null)
        }
      },
      onError: (error) => {
        setIsShared(!value)
        toast.show("Failed to update sharing", "bottom")

        if (__DEV__) {
          console.error(error)
        } else {
          captureMessage(`useShareArtworkList ${error.message}`)
        }
      },
    })
  }

  const handleCopyLink = () => {
    Clipboard.setString(url)
    toast.show("Copied to clipboard", "bottom")

    const event: Share = {
      action: ActionType.share,
      context_module: ContextModule.saves,
      context_owner_type: OwnerType.saves,
      context_owner_id: artworkListEntity.internalID,
      context_owner_slug: slug ?? undefined,
      service: "copy_link",
    }
    trackEvent(event)
  }

  return (
    <AutoHeightBottomSheet name={NAME} {...rest}>
      <Flex mt={1} mx={2} mb={`${bottomOffset}px`}>
        <ArtworkListsBottomSheetSectionTitle>
          Share &ldquo;{artworkListEntity.title}&rdquo;
        </ArtworkListsBottomSheetSectionTitle>

        <Spacer y={2} />

        <Flex flexDirection="row" alignItems="center">
          <Flex flex={1} mr={2}>
            <Text variant="sm" color="mono60">
              Create a shareable link to allow others to view this list
            </Text>
          </Flex>
          <Switch
            accessibilityRole="switch"
            accessibilityLabel="Enable sharing"
            accessibilityState={{ selected: isShared }}
            onValueChange={handleToggle}
            value={isShared}
            disabled={isLoading}
          />
        </Flex>

        <Spacer y={2} />

        <Input value={url} editable={false} disabled={!isShared} />

        <Spacer y={2} />

        <Button block variant="outline" disabled={!isShared || isLoading} onPress={handleCopyLink}>
          Copy link
        </Button>

        <Spacer y={1} />

        <Button block onPress={closeView}>
          Done
        </Button>
      </Flex>
    </AutoHeightBottomSheet>
  )
}
