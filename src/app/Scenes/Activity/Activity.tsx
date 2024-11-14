import { DEFAULT_HIT_SLOP, MoreIcon, Screen, Separator, Touchable } from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { ActivityContent, ActivityContentPlaceholder } from "app/Scenes/Activity/ActivityContent"
import { ActivityScreenStore } from "app/Scenes/Activity/ActivityScreenStore"
import { ActivityHeader } from "app/Scenes/Activity/components/ActivityHeader"
import { useMarkAllNotificationsAsRead } from "app/Scenes/Activity/hooks/useMarkAllNotificationsAsRead"
import { goBack, navigate } from "app/system/navigation/navigate"
import { Suspense } from "react"

export const Activity: React.FC = () => {
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
            hitSlop={DEFAULT_HIT_SLOP}
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
                      navigate("favorites/alerts", {
                        showInTabName: "profile",
                      })
                      break
                    case 2:
                      navigate("favorites", {
                        showInTabName: "profile",
                      })
                      break
                  }
                }
              )
            }}
          >
            <MoreIcon fill="black100" accessibilityLabel="Notifications menu" top="2px" />
          </Touchable>
        }
      />

      <Screen.StickySubHeader
        title="Activity"
        separatorComponent={<Separator borderColor="black5" />}
      >
        <Suspense fallback={null}>
          <ActivityHeader />
        </Suspense>
      </Screen.StickySubHeader>

      <Suspense fallback={<ActivityContentPlaceholder />}>
        <ActivityContent type={type} />
      </Suspense>
    </Screen>
  )
}
