import { Spacer, Flex, useColor, Text, Separator, Button } from "@artsy/palette-mobile"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { MenuItem } from "app/Components/MenuItem"
import { presentEmailComposer } from "app/NativeModules/presentEmailComposer"
import { Tab } from "app/Scenes/Favorites/Favorites"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Alert, ScrollView } from "react-native"

interface MyProfileSettingsProps {
  onSuccess?: () => void
}

export const MyProfileSettings: React.FC<MyProfileSettingsProps> = ({ onSuccess }) => {
  const showOrderHistory = useFeatureFlag("AREnableOrderHistoryOption")
  const showSavedAddresses = useFeatureFlag("AREnableSavedAddresses")
  const darkModeSupport = useFeatureFlag("ARDarkModeSupport")

  const color = useColor()
  const separatorColor = color("black5")

  return (
    <>
      <FancyModalHeader hideBottomDivider>Account</FancyModalHeader>

      <ScrollView>
        <Spacer y={2} />
        <MenuItem
          title="Edit Profile"
          onPress={() =>
            navigate("my-profile/edit", {
              passProps: {
                onSuccess,
              },
            })
          }
        />
        <Separator my={1} borderColor={separatorColor} />
        <MenuItem title="Account Settings" onPress={() => navigate("my-account")} />
        <Separator my={1} borderColor={separatorColor} />
        <MenuItem title="Saved Alerts" onPress={() => navigate("my-profile/saved-search-alerts")} />
        <Separator my={1} borderColor={separatorColor} />
        <MenuItem
          title="Follows"
          onPress={() =>
            navigate("favorites", {
              passProps: {
                initialTab: Tab.artists,
              },
            })
          }
        />
        <Separator my={1} borderColor={separatorColor} />
        {!!showOrderHistory && (
          <>
            <MenuItem title="Order History" onPress={() => navigate("/orders")} />
            <Separator my={1} borderColor={separatorColor} />
          </>
        )}
        <MenuItem title="Payment" onPress={() => navigate("my-profile/payment")} />
        <Separator my={1} borderColor={separatorColor} />
        {!!darkModeSupport && (
          <>
            <MenuItem title="Dark Mode" onPress={() => navigate("settings/dark-mode")} />
            <Separator my={1} borderColor={separatorColor} />
          </>
        )}

        {!!showSavedAddresses && (
          <>
            <MenuItem
              title="Saved Addresses"
              onPress={() => navigate("my-profile/saved-addresses")}
            />
            <Separator my={1} borderColor={separatorColor} />
          </>
        )}

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

        <MenuItem title="About" onPress={() => navigate("about")} />
        <Separator my={1} borderColor={separatorColor} />

        <Flex flexDirection="row" alignItems="center" justifyContent="center" py="7.5px" px={2}>
          <Button variant="fillDark" haptic onPress={confirmLogout} block>
            Log Out
          </Button>
        </Flex>
        <Spacer y={1} />
      </ScrollView>
    </>
  )
}

export const SectionHeading: React.FC<{ title: string }> = ({ title }) => (
  <Text variant="sm-display" color="black60" mb={1} mx={2}>
    {title}
  </Text>
)

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
