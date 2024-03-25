import { Flex, Text, Separator } from "@artsy/palette-mobile"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { InputTitle } from "app/Components/Input"
import { artworkRarityClassifications } from "app/utils/artworkRarityClassifications"
import React from "react"

export type AttributionClassType = "LIMITED_EDITION" | "OPEN_EDITION" | "UNIQUE" | "UNKNOWN_EDITION"

export const RarityInfoModal: React.FC<{
  title: string
  visible: boolean
  onDismiss(): any
}> = ({ title, visible, onDismiss }) => {
  return (
    <FancyModal visible={visible} onBackgroundPressed={onDismiss} testID="RarityInfoModal">
      <FancyModalHeader onLeftButtonPress={onDismiss} useXButton>
        {title}
      </FancyModalHeader>
      <Separator />
      <Flex m={2}>
        {artworkRarityClassifications.map((classification) => (
          <Flex mb={2} key={classification.label}>
            <InputTitle>{classification.label}</InputTitle>
            <Text>{classification.description}</Text>
          </Flex>
        ))}
      </Flex>
    </FancyModal>
  )
}
