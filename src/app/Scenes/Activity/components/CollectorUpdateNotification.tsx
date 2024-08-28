import { Flex, Text, Touchable } from "@artsy/palette-mobile"
import {
  CollectorUpdateNotification_item$data,
  CollectorUpdateNotification_item$key,
} from "__generated__/CollectorUpdateNotification_item.graphql"
import { CollectorUpdateNotification_notification$key } from "__generated__/CollectorUpdateNotification_notification.graphql"
import { MyCollectionBottomSheetModalArtistsPrompt } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalArtistsPrompt"
import { FC, useState } from "react"
import { graphql, useFragment } from "react-relay"
import { CollectorProfilePrompt } from "./CollectorProfilePrompt"

interface CollectorUpdateNotificationProps {
  notification: CollectorUpdateNotification_notification$key
  item: CollectorUpdateNotification_item$key
}

export const CollectorUpdateNotification: FC<CollectorUpdateNotificationProps> = ({
  notification: _notification,
  item: _item,
}) => {
  const [promptVisible, setPromptVisible] = useState(false)
  const notification = useFragment(NOTIFICATION_FRAGMENT, _notification)
  const item = useFragment(ITEM_FRAGMENT, _item)

  if (!notification || !item) {
    return null
  }

  const handleOnDismiss = () => {
    setPromptVisible(false)
  }

  const itemInfo = getItemInfo(item)

  return (
    <>
      <Touchable onPress={() => setPromptVisible(true)}>
        <Flex flex={1} py={2} pr={2}>
          <Text variant="sm-display" fontWeight={500}>
            {itemInfo.title}
          </Text>
          <Text variant="xs">{itemInfo.body}</Text>

          <Text variant="xs" fontWeight={500}>
            Artsy Message •
            <Text variant="xs" fontWeight="normal">{` ${notification.publishedAt}`}</Text>
          </Text>
        </Flex>
      </Touchable>

      {itemInfo.prompt === "AddArtistsToCollection" ? (
        <MyCollectionBottomSheetModalArtistsPrompt
          title="Tell us about the artists in your collection."
          visible={promptVisible}
          onDismiss={handleOnDismiss}
        />
      ) : (
        <CollectorProfilePrompt me={item.me} visible={promptVisible} onDismiss={handleOnDismiss} />
      )}
    </>
  )
}

const NOTIFICATION_FRAGMENT = graphql`
  fragment CollectorUpdateNotification_notification on Notification {
    publishedAt(format: "RELATIVE") @required(action: NONE)
  }
`

const ITEM_FRAGMENT = graphql`
  fragment CollectorUpdateNotification_item on CollectorProfileUpdatePromptNotificationItem {
    me @required(action: NONE) {
      ...MyProfileEditModal_me

      profession
      location {
        city
      }
      myCollectionInfo @required(action: NONE) {
        artistsCount
        artworksCount
      }
    }
    collectorProfile @required(action: NONE) {
      lastUpdatePromptAt
    }
  }
`

const getItemInfo = (item: NonNullable<CollectorUpdateNotification_item$data>) => {
  const hasEmptyCollection =
    item.me.myCollectionInfo.artworksCount === 0 && item.me.myCollectionInfo.artistsCount === 0

  if (hasEmptyCollection) {
    return {
      title: "Tell us about the artists in your collection.",
      body: "Show off your collection and make a great impression.",
      prompt: "AddArtistsToCollection",
    }
  }

  return {
    title: "Tell us a little bit more about you.",
    body: "By completing your profile, you’re more likely to receive quick responses from galleries.",
    prompt: "CollectorProfile",
  }
}
