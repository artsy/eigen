import { presentEmailComposer } from "app/NativeModules/presentEmailComposer"
import { navigate } from "app/navigation/navigate"
import { Box, Button, Flex, Join, LinkText, Sans, Separator, Spacer } from "palette"
import React from "react"
import { View } from "react-native"

export class PrivacyRequest extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Box mb={1} mt={2}>
          <Flex alignItems="center">
            <Sans size="4" weight="medium">
              Personal data request
            </Sans>
          </Flex>
        </Box>
        <Separator />
        <Spacer my={1} />
        <Box mx={2}>
          <Join separator={<Spacer mb={2} />}>
            <Sans size="3" textAlign="left">
              Please see Artsy’s{" "}
              <LinkText onPress={() => navigate("/privacy", { modal: true })}>
                Privacy Policy
              </LinkText>{" "}
              for more information about the information we collect, how we use it, and why we use
              it.
            </Sans>
            <Sans size="3" textAlign="left">
              To submit a personal data request tap the button below or email{" "}
              <LinkText
                onPress={() => presentEmailComposer("privacy@artsy.net", "Personal Data Request")}
              >
                privacy@artsy.net.
              </LinkText>{" "}
            </Sans>
            <Button
              variant="fillGray"
              block
              size="large"
              mt={1}
              onPress={() =>
                presentEmailComposer(
                  "privacy@artsy.net",
                  "Personal Data Request",
                  "Hello, I'm contacting you to ask that..."
                )
              }
            >
              Do not sell my personal information
            </Button>
          </Join>
        </Box>
      </View>
    )
  }
}
