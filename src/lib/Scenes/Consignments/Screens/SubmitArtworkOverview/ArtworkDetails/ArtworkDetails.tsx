import { Flex, Input, RadioButton, Spacer, Text } from "palette"
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
      <Input title="Height" placeholder="in" />
      <Input title="Width" placeholder="in" />
      <Input title="Depth" placeholder="in" />
      <RadioButton text="in" />
      <RadioButton text="cm" />

      <Input title="Provenance" placeholder="Describe How You Acquired the Work" />
      <Input title="Location" placeholder="Enter City Where Artwork is Located" />

      <Spacer mt={1} />
    </Flex>
  )
}
