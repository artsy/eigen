import { Box, Button, Flex, Join, Separator, Serif, Spacer } from "@artsy/palette"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { Image, NativeModules, TouchableWithoutFeedback } from "react-native"

export default class MyProfile extends React.Component {
  render() {
    return (
      <Box px={2} py={1} mx={2} my={3}>
        <Flex alignItems="center">
          <Serif size="5">Settings</Serif>
        </Flex>
        <Separator m={2} />
        <Join separator={<Spacer mb={2} />}>
          <TouchableWithoutFeedback>
            <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
              <Serif size="3t">Send Feedback</Serif>
              <Image source={require("../../../../images/horizontal_chevron.png")} />
            </Flex>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => SwitchBoard.presentNavigationViewController(this, "privacy-request")}
          >
            <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
              <Serif size="3t">Personal Data Request</Serif>
              <Image source={require("../../../../images/horizontal_chevron.png")} />
            </Flex>
          </TouchableWithoutFeedback>
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
    )
  }
}

// <>
//   <Serif>TODO: Implement this according to designs. See: MX-141.</Serif>
//   <TouchableWithoutFeedback onPress={() => SwitchBoard.presentNavigationViewController(this, "privacy-request")}>
//     <Serif>Take me to the new privacy view controller</Serif>
//   </TouchableWithoutFeedback>
//   <Button
//     variant="primaryBlack"
//     onPress={() => NativeModules.ARNotificationsManager.postNotificationName("ARUserRequestedLogout", {})}
//   >
//     Logout
//   </Button>
// </>
