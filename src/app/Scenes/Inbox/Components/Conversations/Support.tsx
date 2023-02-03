import { QuestionCircleIcon } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
import { Flex, Text, Touchable } from "palette"

export const Support = () => {
  return (
    <Flex flexDirection="column" p={2} key="support-section">
      <Text variant="sm-display" mb={1} weight="medium">
        Support
      </Text>
      <Touchable
        onPress={() => {
          navigate("https://support.artsy.net/hc/en-us/sections/360008203054-Contact-a-gallery", {
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
