import { CTAButton, Flex, Spacer, Text } from "palette"
import React from "react"

interface ArtworkDetailsProps {
  // TODO
  handlePress: any
}

export const ArtworkDetails: React.FC<ArtworkDetailsProps> = ({ handlePress }) => {
  return (
    <Flex backgroundColor="peachpuff" p={1} mt={1}>
      <Text>Upload Photos content</Text>
      <Spacer mt={1} />
      <CTAButton onPress={handlePress}>Save & Continue</CTAButton>
    </Flex>
  )
}
