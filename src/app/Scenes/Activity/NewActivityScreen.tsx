import { MoreIcon, Screen, Separator, Touchable } from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { ActivityContainer } from "app/Scenes/Activity/ActivityContainer"
import { ActivityScreenStore } from "app/Scenes/Activity/ActivityScreenStore"
import { NewActivityHeader } from "app/Scenes/Activity/components/NewActivityHeader"
import { useMarkAllNotificationsAsRead } from "app/Scenes/Activity/hooks/useMarkAllNotificationsAsRead"
import { goBack, navigate } from "app/system/navigation/navigate"

// TODO: Remove New from the name once we remove the old Activity screen
export const NewActivityContent: React.FC = () => {
  const type = ActivityScreenStore.useStoreState((state) => state.type)
  const { showActionSheetWithOptions } = useActionSheet()
  const { markAllNotificationsAsRead } = useMarkAllNotificationsAsRead()

  return (
    <Screen>
      <Screen.AnimatedHeader
        onBack={goBack}
        title="Activity"
        rightElements={
          <Touchable
            onPress={() => {
              showActionSheetWithOptions(
                {
                  options: ["Mark all as read", "Edit Alerts", "Edit Follows", "Cancel"],
                  cancelButtonIndex: 3,
                  useModal: true,
                },
                (buttonIndex) => {
                  switch (buttonIndex) {
                    case 0:
                      markAllNotificationsAsRead()
                      break
                    case 1:
                      navigate("settings/alerts")
                      break
                    case 2:
                      navigate("favorites")
                      break
                  }
                }
              )
            }}
          >
            <MoreIcon fill="black100" accessibilityLabel="Notifications menu" />
          </Touchable>
        }
      />
      <Screen.StickySubHeader
        title="Activity"
        separatorComponent={<Separator borderColor="black5" />}
      >
        <NewActivityHeader />
      </Screen.StickySubHeader>
      <ActivityContainer type={type} />
    </Screen>
  )
}

export const NewActivityScreen: React.FC = () => {
  return (
    <ActivityScreenStore.Provider>
      <NewActivityContent />
    </ActivityScreenStore.Provider>
  )
}
