import { ActionType, ContextModule, OwnerType, TappedCompleteYourProfile } from "@artsy/cohesion"
import { Flex, Text, Touchable } from "@artsy/palette-mobile"
import { CollectorUpdateNotification_item$key } from "__generated__/CollectorUpdateNotification_item.graphql"
import { CollectorUpdateNotification_notification$key } from "__generated__/CollectorUpdateNotification_notification.graphql"
import { MyCollectionBottomSheetModalArtistsPrompt } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalArtistsPrompt"
import { FC, useState } from "react"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { CollectorProfilePrompt } from "./CollectorProfilePrompt"

interface CollectorUpdateNotificationProps {
  notification: CollectorUpdateNotification_notification$key
  item: CollectorUpdateNotification_item$key
  onPress: () => void
}

export const CollectorUpdateNotification: FC<CollectorUpdateNotificationProps> = ({
  notification: _notification,
  item: _item,
  onPress,
}) => {
  const [promptVisible, setPromptVisible] = useState(false)
  const { trackEvent } = useTracking()
  const notification = useFragment(NOTIFICATION_FRAGMENT, _notification)
  const item = useFragment(ITEM_FRAGMENT, _item)

  if (!notification || !item) {
    return null
  }

  const hasEmptyCollection =
    item.me.myCollectionInfo.artworksCount === 0 && !item.me.userInterestsConnection?.totalCount
  const itemInfo = hasEmptyCollection ? addArtistsToCollectiontInfo : collectorProfileInfo

  const handleOnPress = () => {
    if (itemInfo.prompt === "CollectorProfile") {
      trackEvent(tracks.tappedCompleteYourProfile())
    }
    setPromptVisible(true)
    onPress()
  }

  return (
    <>
      <Touchable accessibilityRole="button" onPress={handleOnPress}>
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
          onDismiss={() => setPromptVisible(false)}
        />
      ) : (
        <CollectorProfilePrompt
          me={item.me}
          visible={promptVisible}
          onDismiss={() => setPromptVisible(false)}
        />
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

      myCollectionInfo @required(action: NONE) {
        artworksCount
      }
      userInterestsConnection(first: 1, interestType: ARTIST) {
        totalCount
      }
    }
  }
`

const addArtistsToCollectiontInfo = {
  title: "Tell us about the artists in your collection.",
  body: "Show off your collection and make a great impression.",
  prompt: "AddArtistsToCollection",
}

const collectorProfileInfo = {
  title: "Tell us a little bit more about you.",
  body: "By completing your profile, you’re more likely to receive quick responses from galleries.",
  prompt: "CollectorProfile",
}

const tracks = {
  tappedCompleteYourProfile: (): TappedCompleteYourProfile => ({
    action: ActionType.tappedCompleteYourProfile,
    context_module: ContextModule.activity,
    context_screen_owner_type: OwnerType.profile,
  }),
}
