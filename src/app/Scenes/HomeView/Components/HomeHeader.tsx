import { Spacer, ArtsyLogoBlackIcon, Flex, Box, Text, Join } from "@artsy/palette-mobile"
import { InfoButton } from "app/Components/Buttons/InfoButton"
import { GlobalStore } from "app/store/GlobalStore"
import { ActivityIndicator } from "./ActivityIndicator"

export const HomeHeader: React.FC = () => {
  const hasUnseenNotifications = GlobalStore.useAppState(
    (state) => state.bottomTabs.hasUnseenNotifications
  )

  return (
    <Box mb={1} mt={2}>
      <Flex flexDirection="row" justifyContent="space-between">
        <InfoButton
          titleElement={
            <Text ml={2} color="blue100" weight="medium">
              Alpha
            </Text>
          }
          modalTitle="Home View"
          modalContent={
            <Box py={1}>
              <Join separator={<Spacer y={0.5} />}>
                <Text variant="sm">Hello! 👋</Text>
                <Text variant="sm">
                  This is an unreleased version of the app home screen. To switch to the current
                  production version, disable the feature flag for "Use new home view" in admin
                  settings.
                </Text>
                <Text variant="sm">
                  Please direct any feedback to the #pdde-art-advisor channel in Slack.
                </Text>
              </Join>
            </Box>
          }
        />
        <ArtsyLogoBlackIcon scale={0.75} />
        <ActivityIndicator hasUnseenNotifications={hasUnseenNotifications} />
      </Flex>
      <Spacer y={1} />
    </Box>
  )
}
