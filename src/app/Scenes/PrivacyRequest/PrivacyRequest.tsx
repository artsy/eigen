import { Box, Button, Join, LinkText, Spacer, Text } from "@artsy/palette-mobile"
import { presentEmailComposer } from "app/NativeModules/presentEmailComposer"
import { navigate } from "app/system/navigation/navigate"
import React from "react"
import { View } from "react-native"

export const PrivacyRequest: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <Spacer y={1} />
      <Box mx={2}>
        <Join separator={<Spacer y={2} />}>
          <Text variant="sm" textAlign="left">
            Please see Artsy’s{" "}
            <LinkText onPress={() => navigate("/privacy")}>Privacy Policy</LinkText> for more
            information about the information we collect, how we use it, and why we use it.
          </Text>
          <Text variant="sm" textAlign="left">
            To submit a personal data request tap the button below or email{" "}
            <LinkText
              onPress={() => presentEmailComposer("privacy@artsy.net", "Personal Data Request")}
            >
              privacy@artsy.net.
            </LinkText>{" "}
          </Text>
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
