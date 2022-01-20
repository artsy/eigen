import { CTAButton, Flex, Input, RadioButton, Spacer, Text } from "palette"
import React from "react"
import { ArtworkDetailsForm } from "./ArtworkDetailsForm"

interface ArtworkDetailsProps {
  // TODO
  handlePress: any
}

export const ArtworkDetails: React.FC<ArtworkDetailsProps> = ({ handlePress }) => {
  return (
    <Flex p={1} mt={1}>
      <Text variant="sm" color="black60">
        · All fields are required to submit an artwork.
      </Text>
      <Text variant="sm" color="black60">
        · Unfortunately, we do not allow&nbsp;
        <Text style={{ textDecorationLine: "underline" }}>artists to sell their own work</Text> on Artsy.
      </Text>

      <Spacer mt={2} />

      <ArtworkDetailsForm handlePress={handlePress} />

      <Input title="Rarity" placeholder="Select a Classification" />
      <Spacer mt={2} />
      <Input title="Height" placeholder="in" />
      <Spacer mt={2} />
      <Input title="Width" placeholder="in" />
      <Spacer mt={2} />
      <Input title="Depth" placeholder="in" />
      <Spacer mt={2} />
      <Flex flexDirection="row">
        <Flex flexDirection="row" pr={4}>
          <RadioButton text="in" />
        </Flex>
        <RadioButton text="cm" />
      </Flex>
      <Spacer mt={2} />
      <Input title="Provenance" placeholder="Describe How You Acquired the Work" />
      <Spacer mt={2} />
      <Input title="Location" placeholder="Enter City Where Artwork is Located" />
      <Spacer mt={4} />
      <CTAButton onPress={handlePress}>Save & Continue</CTAButton>
    </Flex>
  )
}
