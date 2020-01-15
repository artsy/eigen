import { Box, Button, Flex, Join, Separator, Serif, Spacer, Theme } from "@artsy/palette"
import { LinkText } from "lib/Components/Text/LinkText"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { View } from "react-native"

export class PrivacyRequest extends React.Component {
  render() {
    return (
      <Theme>
        <View>
          <Box mb={1} mt={2}>
            <Flex alignItems="center">
              <Serif size="5">Personal data request</Serif>
            </Flex>
          </Box>
          <Separator />
          <Spacer my={4} />
          <Box mx={3}>
            <Join separator={<Spacer mb={2} />}>
              <Serif size="3t" textAlign="center">
                Please see Artsy’s{" "}
                <LinkText onPress={() => SwitchBoard.presentModalViewController(this, "/privacy")}>
                  Privacy Policy
                </LinkText>{" "}
                for more information about the information we collect, how we use it, and why we use it.
              </Serif>
              <Serif size="3t" textAlign="center">
                You can email{" "}
                <LinkText
                  onPress={() => SwitchBoard.presentEmailComposer(this, "privacy@artsy.net", "Personal Data Request")}
                >
                  privacy@artsy.net
                </LinkText>{" "}
                to submit a personal data request.
              </Serif>
              <Button
                variant="primaryBlack"
                block
                size="large"
                mt={1}
                onPress={() => SwitchBoard.presentEmailComposer(this, "privacy@artsy.net", "Personal Data Request")}
              >
                Do not sell my personal information
              </Button>
            </Join>
          </Box>
        </View>
      </Theme>
    )
  }
}
