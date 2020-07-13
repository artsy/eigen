import { Box, Button, Flex, Join, Sans, Separator, Serif, Spacer, Theme } from "@artsy/palette"
import { LinkText } from "lib/Components/Text/LinkText"
import { Fonts } from "lib/data/fonts"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"

export class PrivacyRequest extends React.Component {
  render() {
    return (
      <Theme>
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
            <Serif size="3" textAlign="left" fontFamily={Fonts.Unica77LLRegular}>
              Please see Artsy’s{" "}
              <LinkText onPress={() => SwitchBoard.presentModalViewController(this, "/privacy")}>
                Privacy Policy
              </LinkText>{" "}
              for more information about the information we collect, how we use it, and why we use it.
            </Serif>
            <Serif size="3" textAlign="left" fontFamily={Fonts.Unica77LLRegular}>
              To submit a personal data request tap the button below or email{" "}
              <LinkText
                onPress={() => SwitchBoard.presentEmailComposer(this, "privacy@artsy.net", "Personal Data Request")}
              >
                privacy@artsy.net.
              </LinkText>{" "}
            </Serif>
            <Button
              variant="secondaryGray"
              block
              size="large"
              mt={2}
              onPress={() =>
                SwitchBoard.presentEmailComposer(
                  this,
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
      </Theme>
    )
  }
}
