import { MoreIcon } from "@artsy/icons/native"
import { DEFAULT_HIT_SLOP, Screen, Touchable } from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { ActivityContent, ActivityContentPlaceholder } from "app/Scenes/Activity/ActivityContent"
import { ActivityScreenStore } from "app/Scenes/Activity/ActivityScreenStore"
import { ActivityHeader } from "app/Scenes/Activity/components/ActivityHeader"
import { useMarkAllNotificationsAsRead } from "app/Scenes/Activity/hooks/useMarkAllNotificationsAsRead"
import { goBack, navigate } from "app/system/navigation/navigate"
import { useAndroidActionSheetStyles } from "app/utils/hooks/useAndroidActionSheetStyles"
import { Suspense } from "react"

export const Activity: React.FC = () => {
  const type = ActivityScreenStore.useStoreState((state) => state.type)
  const { showActionSheetWithOptions } = useActionSheet()
  const androidCustomSheetStyles = useAndroidActionSheetStyles()
  const { markAllNotificationsAsRead } = useMarkAllNotificationsAsRead()

  return (
    <Screen>
      <Screen.AnimatedHeader
        onBack={goBack}
        title="Activity"
        rightElements={
          <Touchable
            accessibilityRole="button"
            hitSlop={DEFAULT_HIT_SLOP}
            onPress={() => {
              showActionSheetWithOptions(
                {
                  options: ["Mark all as read", "Edit Alerts", "Edit Follows", "Cancel"],
                  cancelButtonIndex: 3,
                  useModal: true,
                  ...androidCustomSheetStyles,
                },
                (buttonIndex) => {
                  switch (buttonIndex) {
                    case 0:
                      markAllNotificationsAsRead()
                      break
                    case 1:
                      navigate("favorites/alerts", {
                        showInTabName: "favorites",
                      })
                      break
                    case 2:
                      navigate("favorites/follows", {
                        showInTabName: "favorites",
                      })
                      break
                  }
                }
              )
            }}
          >
            <MoreIcon fill="mono100" accessibilityLabel="Notifications menu" top="2px" />
          </Touchable>
        }
      />

      <Screen.StickySubHeader title="Activity" largeTitle separatorComponent={null}>
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
