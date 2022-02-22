import { navigate } from "app/navigation/navigate"
import { track as _track } from "app/utils/track"
import { Flex, QuestionCircleIcon, Text, Touchable } from "palette"
import React from "react"

export const Support = () => {
  return (
    <Flex flexDirection="column" p={2} key="support-section">
      <Text variant="md" mb={1} weight="medium">
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
