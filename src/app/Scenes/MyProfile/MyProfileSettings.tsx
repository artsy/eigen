import { MenuItem } from "app/Components/MenuItem"
import { presentEmailComposer } from "app/NativeModules/presentEmailComposer"
import { navigate } from "app/navigation/navigate"
import { GlobalStore, useFeatureFlag } from "app/store/GlobalStore"
import { Button, Flex, Separator, Spacer, Text, useColor } from "palette"
import { Alert, ScrollView } from "react-native"
import { Tab } from "../Favorites/Favorites"

export const MyProfileSettings: React.FC<{}> = () => {
  const showOrderHistory = useFeatureFlag("AREnableOrderHistoryOption")
  const showSavedAddresses = useFeatureFlag("AREnableSavedAddresses")
  const darkModeSupport = useFeatureFlag("ARDarkModeSupport")

  const color = useColor()
  const separatorColor = color("black5")

  return (
    <ScrollView>
      <Text variant="lg-display" mx="2" mt="6">
        {"Settings"}
      </Text>
      <Spacer my={1} />
      <MenuItem title="Edit Profile" onPress={() => navigate("my-profile/edit")} />
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

      <Spacer mt={2} mb={1} />
      <SectionHeading title="Account Settings" />
      <Spacer mt={1} />
      <MenuItem title="Account" onPress={() => navigate("my-account")} />
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

      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        py={7.5}
        px="2"
        pr="15px"
      >
        <Button variant="fillDark" haptic onPress={confirmLogout} block>
          Log Out{" "}
        </Button>
      </Flex>
      <Spacer mb={1} />
    </ScrollView>
  )
}

export const SectionHeading: React.FC<{ title: string }> = ({ title }) => (
  <Text variant="sm-display" color="black60" mb="1" mx="2">
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
