import { Box, Button, Flex, Join, Sans, Separator, Serif, Spacer, Theme } from "@artsy/palette"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { Alert, Image, NativeModules, TouchableWithoutFeedback, View } from "react-native"
import { UserProfileQueryRenderer } from "./LoggedInUserInfo"

export function confirmLogout() {
  Alert.alert("Log out?", "Are you sure you want to log out?", [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "Log out",
      style: "destructive",
      onPress: () => NativeModules.ARNotificationsManager.postNotificationName("ARUserRequestedLogout", {}),
    },
  ])
}
export class SettingsOld extends React.Component {
  render() {
    return (
      <Theme>
        <Flex flexDirection="column" justifyContent="space-between" height="100%">
          <View>
            <Sans size="4" textAlign="center" mb={1} mt={2}>
              Settings
            </Sans>
            <Separator />
            <Box py={1} mx={2} mt={1}>
              <Join separator={<Spacer mb={2} />}>
                <Row
                  title="Send feedback"
                  onPress={() =>
                    SwitchBoard.presentEmailComposer(this, "feedback@artsy.net", "Feedback from the Artsy app")
                  }
                />
                <Row
                  title="Personal data request"
                  onPress={() => SwitchBoard.presentNavigationViewController(this, "privacy-request")}
                />
              </Join>
            </Box>
          </View>
          <Box py={2} mx={2} mt={1}>
            <Box>
              <UserProfileQueryRenderer />
            </Box>
            <Button variant="primaryBlack" block size="large" onPress={confirmLogout} mt={1}>
              Log out
            </Button>
          </Box>
        </Flex>
      </Theme>
    )
  }
}

const Row: React.FC<{ title: string; onPress?: () => void }> = ({ title, onPress }) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
      <Serif size="3t">{title}</Serif>
      <Image source={require("@images/horizontal_chevron.png")} />
    </Flex>
  </TouchableWithoutFeedback>
)
