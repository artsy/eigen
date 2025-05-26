import { QuestionCircleIcon, Flex, Text, Touchable } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"

export const Support = () => {
  return (
    <Flex flexDirection="column" p={2} key="support-section">
      <Text variant="sm-display" mb={1} weight="medium">
        Support
      </Text>
      <Touchable
        accessibilityRole="button"
        onPress={() => {
          navigate("https://support.artsy.net/s/topic/0TO3b000000UevEGAS/contacting-a-gallery", {
            modal: true,
          })
        }}
      >
        <Flex mb={1} alignItems="center" flexDirection="row">
          <QuestionCircleIcon mr={1} />
          <Text variant="sm">Inquiries FAQ</Text>
        </Flex>
      </Touchable>
    </Flex>
  )
}
