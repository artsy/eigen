import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import {
  Button,
  Flex,
  Join,
  LinkText,
  Screen,
  Separator,
  Spacer,
  Text,
  Touchable,
  useColor,
  useSpace,
} from "@artsy/palette-mobile"
import { MenuItem } from "app/Components/MenuItem"
import { presentEmailComposer } from "app/NativeModules/presentEmailComposer"
import { MyProfileHeader } from "app/Scenes/MyProfile/Components/MyProfileHeader"
import { GlobalStore } from "app/store/GlobalStore"
import { useSetDevMode } from "app/system/devTools/useSetDevMode"
import { navigate } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Alert, ScrollView } from "react-native"
import DeviceInfo from "react-native-device-info"
import { useTracking } from "react-tracking"

export const MyProfileSettings: React.FC = () => {
  const supportsDarkMode = useFeatureFlag("ARDarkModeSupport")
  const enableRedesignedSettings = useFeatureFlag("AREnableRedesignedSettings")
  const color = useColor()
  const space = useSpace()
  const appVersion = DeviceInfo.getVersion()
  const { updateTapCount } = useSetDevMode()
  const { value: userIsDev } = GlobalStore.useAppState((store) => store.artsyPrefs.userIsDev)
  const tracking = useTracking()
  const separatorColor = color("black5")

  if (enableRedesignedSettings) {
    return (
      <Screen.ScrollView>
        <MyProfileHeader />

        <Text variant="lg-display" px={2} mt={4}>
          Profile
        </Text>
        <Join separator={<Spacer y={4} />}>
          <>
            <Text variant="xs" color="black60" px={2} mt={2}>
              Transactions
            </Text>
            <Spacer y={1} />
            <MenuItem title="Your Orders" href="/orders" />
          </>

          <>
            <Text variant="xs" color="black60" px={2}>
              Account
            </Text>
            <Spacer y={1} />
            <MenuItem title="Login and security" href="my-profile/edit" />
            <MenuItem title="Payments" href="my-profile/payment" />
            <MenuItem title="Notifications" href="my-profile/push-notifications" />
            <MenuItem
              title="Preferences"
              // Jira ticket: ONYX-1642
              href="my-profile/preferences"
            />
          </>

          <>
            <Text variant="xs" color="black60" px={2}>
              Support
            </Text>
            <Spacer y={1} />

            <MenuItem
              title="Help Center"
              onPress={() => {
                navigate("help.artsy.net")
              }}
            />

            <MenuItem
              title="Send Feedback"
              onPress={() =>
                presentEmailComposer("support@artsy.net", "Feedback from the Artsy app")
              }
            />
          </>

          <>
            <Text variant="xs" color="black60" px={2}>
              Legal
            </Text>
            <Spacer y={1} />
            <MenuItem
              title="Terms and Conditions"
              onPress={() => {
                // TODO: add new route
                // Jira ONYX - 1642
                navigate("my-profile/terms-and-conditions")
              }}
            />

            <MenuItem
              title="Privacy"
              onPress={() => {
                navigate("my-profile/terms-and-conditions")
              }}
            />
          </>

          <Flex justifyContent="center" px={2} pb={2}>
            <LinkText onPress={confirmLogout} variant="sm">
              Log Out
            </LinkText>
            <Spacer y={4} />
            <Touchable onPress={() => updateTapCount((count) => count + 1)}>
              <Text variant="xs" color={userIsDev ? "devpurple" : "black60"}>
                Version: {appVersion}
              </Text>
            </Touchable>
          </Flex>
        </Join>
      </Screen.ScrollView>
    )
  }
  return (
    <ScrollView
      contentContainerStyle={{ paddingTop: space(2), backgroundColor: color("background") }}
    >
      <Text variant="xs" color="black60" px={2}>
        Settings
      </Text>
      <Spacer y={2} />
      <MenuItem title="Edit Profile" href="my-profile/edit" />
      <Separator my={1} borderColor={separatorColor} />
      <MenuItem title="Account Settings" href="my-account" />
      <Separator my={1} borderColor={separatorColor} />
      <MenuItem title="Payment" href="my-profile/payment" />
      <Separator my={1} borderColor={separatorColor} />

      <MenuItem title="Push Notifications" href="my-profile/push-notifications" />
      <Separator my={1} borderColor={separatorColor} />

      <MenuItem
        title="Send Feedback"
        onPress={() => presentEmailComposer("support@artsy.net", "Feedback from the Artsy app")}
      />
      <Separator my={1} borderColor={separatorColor} />

      <MenuItem title="Personal Data Request" href="privacy-request" />
      <Separator my={1} borderColor={separatorColor} />

      <MenuItem
        title="Recently Viewed"
        href="recently-viewed"
        onPress={() => {
          tracking.trackEvent(tracks.trackMenuTap("my-profile/recently-viewed"))
        }}
      />
      {!!supportsDarkMode && (
        <>
          <Separator my={1} borderColor={separatorColor} />

          <MenuItem
            title="Dark Mode"
            href="/settings/dark-mode"
            onPress={() => {
              tracking.trackEvent(tracks.trackMenuTap("settings/dark-mode"))
            }}
          />
        </>
      )}

      <Separator my={1} borderColor={separatorColor} />

      <MenuItem title="About" href="about" />
      <Separator my={1} borderColor={separatorColor} />

      <Spacer y={2} />
      <Text variant="xs" color="black60" px={2}>
        Transactions
      </Text>

      <MenuItem title="Order History" href="/orders" />
      <Separator my={1} borderColor={separatorColor} />

      <Flex flexDirection="row" alignItems="center" justifyContent="center" py="7.5px" px={2}>
        <Button variant="fillDark" haptic onPress={confirmLogout} block>
          Log Out
        </Button>
      </Flex>
      <Spacer y={1} />
    </ScrollView>
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
