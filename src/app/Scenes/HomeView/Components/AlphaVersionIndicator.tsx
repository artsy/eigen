import { Box, Join, Spacer, Text } from "@artsy/palette-mobile"
import { InfoButton } from "app/Components/Buttons/InfoButton"

export const AlphaVersionIndicator: React.FC = () => {
  return (
    <InfoButton
      titleElement={
        <Text color="blue100" weight="medium">
          Alpha
        </Text>
      }
      modalTitle="Home View"
      modalContent={
        <Box py={1}>
          <Join separator={<Spacer y={2} />}>
            <Text variant="sm">Hello! 👋</Text>
            <Text variant="sm">
              This is an unreleased version of the app home screen. To switch to the current
              production version, enable the feature flag for "Prefer legacy home screen" in admin
              settings.
            </Text>
            <Text variant="sm">
              Please direct any feedback to the #pdde-art-advisor channel in Slack.
            </Text>
          </Join>
        </Box>
      }
    />
  )
}
