import { MenuItem } from "lib/Components/MenuItem"
import { presentEmailComposer } from "lib/NativeModules/presentEmailComposer"
import { navigate } from "lib/navigation/navigate"
import { GlobalStore, useFeatureFlag } from "lib/store/GlobalStore"
import { Button, Flex, Sans, Separator, Spacer, useColor } from "palette"
import React from "react"
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
      <Sans size="8" mx="2" mt="6">
        {"Settings"}
      </Sans>
      <Spacer mt={3} mb={2} />
      <SectionHeading title="FAVORITES" />
      <Spacer my={1} />
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

      <Spacer my={2} />
      <SectionHeading title="ACCOUNT SETTINGS" />
      <Spacer my={1} />
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
  <Sans size="3" color="black100" mb="1" mx="2">
    {title}
  </Sans>
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
