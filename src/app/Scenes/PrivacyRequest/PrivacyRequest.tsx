import { Box, Button, Flex, Join, LinkText, Spacer, Text } from "@artsy/palette-mobile"
import { MyProfileScreenWrapper } from "app/Scenes/MyProfile/Components/MyProfileScreenWrapper"
import { RouterLink } from "app/system/navigation/RouterLink"
import { presentEmailComposer } from "app/utils/email/presentEmailComposer"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import React from "react"

export const PrivacyRequest: React.FC = () => {
  const enableRedesignedSettings = useFeatureFlag("AREnableRedesignedSettings")

  if (enableRedesignedSettings) {
    return (
      <MyProfileScreenWrapper
        title="Personal Data Request"
        contentContainerStyle={{ paddingHorizontal: 0 }}
      >
        <Content />
      </MyProfileScreenWrapper>
    )
  }
  return <Content />
}

export const Content: React.FC = () => {
  return (
    <Flex flex={1}>
      <Spacer y={1} />
      <Box mx={2}>
        <Join separator={<Spacer y={2} />}>
          <Text variant="sm" textAlign="left">
            Please see Artsy's{" "}
            <RouterLink to="/privacy" hasChildTouchable>
              <LinkText>Privacy Policy</LinkText>
            </RouterLink>{" "}
            for more information about the information we collect, how we use it, and why we use it.
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
    </Flex>
  )
}
