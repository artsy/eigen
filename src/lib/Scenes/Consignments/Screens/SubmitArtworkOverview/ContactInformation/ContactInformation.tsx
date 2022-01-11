import { Button, Flex, Spacer, Text } from "palette"
import React from "react"

export const ContactInformation = ({ handlePress }: { handlePress: () => void }) => {
  return (
    <Flex backgroundColor="peachpuff" p={1} mt={1}>
      <Text>ContactInformation content</Text>
      <Spacer mt={1} />
      <Button block haptic maxWidth={540} onPress={handlePress}>
        Submit Artwork
      </Button>
    </Flex>
  )
}
