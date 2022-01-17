import { CTAButton, Flex, Input, Spacer, Text } from "palette"
import React from "react"

export const ContactInformation = ({ handlePress }: { handlePress: () => void }) => {
  return (
    <Flex p={1} mt={1}>
      <Text variant="sm" color="black60">
        We will only use these details to contact you regarding your submission.{" "}
      </Text>
      <Spacer mt={1} />
      <Input title="Name" placeholder="in" />
      <Spacer mt={2} />
      <Input title="Email" placeholder="in" />
      <Spacer mt={2} />
      <Input title="Phone number" placeholder="in" />
      <Spacer mt={2} />
      <CTAButton onPress={handlePress}>Submit Artwork</CTAButton>
    </Flex>
  )
}
