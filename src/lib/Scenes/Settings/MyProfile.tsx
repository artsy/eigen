import { Box, Button, Flex, Join, Separator, Serif, Spacer } from "@artsy/palette"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { Image, NativeModules, TouchableWithoutFeedback } from "react-native"

export default class MyProfile extends React.Component {
  render() {
    return (
      <>
        <Box px={2} py={2} mx={2} mb={2} mt={2}>
          <Flex alignItems="center">
            <Serif size="5">Settings</Serif>
          </Flex>
        </Box>
        <Separator />
        <Box px={2} py={1} mx={2} mt={2}>
          <Join separator={<Spacer mb={2} />}>
            <Row title="Send Feedback" />
            <Row
              title="Personal Data Request"
              onPress={() => SwitchBoard.presentNavigationViewController(this, "privacy-request")}
            />
            <Button
              variant="primaryBlack"
              block
              size="large"
              mt={3}
              onPress={() => NativeModules.ARNotificationsManager.postNotificationName("ARUserRequestedLogout", {})}
            >
              Logout
            </Button>
          </Join>
        </Box>
      </>
    )
  }
}

const Row: React.FC<{ title: string; onPress?: () => void }> = ({ title, onPress }) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
      <Serif size="3t">{title}</Serif>
      <Image source={require("../../../../images/horizontal_chevron.png")} />
    </Flex>
  </TouchableWithoutFeedback>
)
