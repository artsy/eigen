import { Box, Join, LinkText, Spacer, Text } from "@artsy/palette-mobile"
import { InfoButton } from "app/Components/Buttons/InfoButton"
import { Linking } from "react-native"

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

            <Text variant="sm">This is an unreleased version of the app home screen.</Text>

            <Text variant="sm">
              Please direct any feedback to the{" "}
              <LinkText
                fontWeight="bold"
                onPress={() => Linking.openURL("https://artsy.slack.com/archives/C07ANEV7RNV")}
              >
                #pdde-art-advisor
              </LinkText>{" "}
              channel in Slack, or to the{" "}
              <LinkText
                fontWeight="bold"
                onPress={() =>
                  Linking.openURL("https://www.notion.so/artsy/abc1123548504ae58051405627fb6c9f")
                }
              >
                Notion feedback board
              </LinkText>
              .
            </Text>

            <Text variant="sm">
              To switch to the current production version, enable the feature flag for “
              <Text fontWeight="bold">Prefer legacy home screen</Text>” in the admin settings.
            </Text>

            <LinkText
              onPress={() =>
                Linking.openURL("https://www.notion.so/artsy/e9958451ea9d44c6b357aba6505c0abc")
              }
            >
              See more on how to switch back
            </LinkText>
          </Join>
        </Box>
      }
    />
  )
}
