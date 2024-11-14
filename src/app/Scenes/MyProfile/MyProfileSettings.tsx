import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Button, Flex, Separator, Spacer, Text, useColor, useSpace } from "@artsy/palette-mobile"
import { MenuItem } from "app/Components/MenuItem"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { presentEmailComposer } from "app/NativeModules/presentEmailComposer"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Fragment } from "react"
import { Alert, ScrollView } from "react-native"
import { useTracking } from "react-tracking"

export const MyProfileSettings: React.FC = () => {
  const color = useColor()
  const space = useSpace()
  const enableNewNavigation = useFeatureFlag("AREnableNewNavigation")

  const tracking = useTracking()
  const separatorColor = color("black5")

  const Wrapper = enableNewNavigation
    ? Fragment
    : ({ children }: { children: React.ReactNode }) => (
        <PageWithSimpleHeader title="Profile">{children}</PageWithSimpleHeader>
      )
  return (
    <Wrapper>
      <ScrollView contentContainerStyle={{ paddingTop: space(2) }}>
        <Text variant="xs" color="black60" px={2}>
          Settings
        </Text>
        <Spacer y={2} />
        <MenuItem title="Edit Profile" onPress={() => navigate("my-profile/edit")} />
        <Separator my={1} borderColor={separatorColor} />
        <MenuItem title="Account Settings" onPress={() => navigate("my-account")} />
        <Separator my={1} borderColor={separatorColor} />
        <MenuItem title="Payment" onPress={() => navigate("my-profile/payment")} />
        <Separator my={1} borderColor={separatorColor} />

        <MenuItem
          title="Push Notifications"
          onPress={() => navigate("my-profile/push-notifications")}
        />
        <Separator my={1} borderColor={separatorColor} />

        <MenuItem
          title="Send Feedback"
          onPress={() => presentEmailComposer("support@artsy.net", "Feedback from the Artsy app")}
        />
        <Separator my={1} borderColor={separatorColor} />

        <MenuItem title="Personal Data Request" onPress={() => navigate("privacy-request")} />
        <Separator my={1} borderColor={separatorColor} />

        <MenuItem
          title="Recently Viewed"
          onPress={() => {
            tracking.trackEvent(tracks.trackMenuTap("my-profile/recently-viewed"))
            navigate("recently-viewed")
          }}
        />
        <Separator my={1} borderColor={separatorColor} />

        <MenuItem title="About" onPress={() => navigate("about")} />
        <Separator my={1} borderColor={separatorColor} />

        <Spacer y={2} />
        <Text variant="xs" color="black60" px={2}>
          Transactions
        </Text>

        <MenuItem title="Order History" onPress={() => navigate("/orders")} />
        <Separator my={1} borderColor={separatorColor} />

        <Flex flexDirection="row" alignItems="center" justifyContent="center" py="7.5px" px={2}>
          <Button variant="fillDark" haptic onPress={confirmLogout} block>
            Log Out
          </Button>
        </Flex>
        <Spacer y={1} />
      </ScrollView>
    </Wrapper>
  )
}

export function confirmLogout() {
  Alert.alert("Log out?", "Are you sure you want to log out?", [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "Log out",
      style: "destructive",
      onPress: () => GlobalStore.actions.auth.signOut(),
    },
  ])
}

const tracks = {
  trackMenuTap: (href: string) => ({
    action_type: ActionType.tappeMenuItem,
    payload: href,
    context_module: ContextModule.account,
    context_screen_owner_type: OwnerType.settings,
  }),
}
