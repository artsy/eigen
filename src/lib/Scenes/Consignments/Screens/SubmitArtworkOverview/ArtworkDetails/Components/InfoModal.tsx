import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { artworkRarityClassifications } from "lib/utils/artworkRarityClassifications"
import { Button, Flex, InputTitle, Spacer, Text } from "palette"
import React from "react"

export const InfoModal: React.FC<{
  title: string
  visible: boolean
  isRarity: boolean
  onDismiss: () => void
}> = ({ title, visible, isRarity, onDismiss }) => {
  return (
    <FancyModal visible={visible} onBackgroundPressed={onDismiss}>
      <FancyModalHeader onRightButtonPress={onDismiss} hideBottomDivider rightCloseButton>
        <Text fontSize={24}>{title}</Text>
      </FancyModalHeader>

      <Flex m={2}>
        {isRarity ? (
          artworkRarityClassifications.map((classification) => (
            <Flex mb={2} key={classification.label}>
              <InputTitle>{classification.label}</InputTitle>
              <Text>{classification.description}</Text>
            </Flex>
          ))
        ) : (
          <>
            <Flex mb={4}>
              <Text>
                Provenance is the documented history of an artwork’s ownership and authenticity. Please list any
                documentation you have that proves your artwork’s provenance, such as:
              </Text>
            </Flex>

            <Flex flexDirection="column">
              <Text> • Invoices from previous owners</Text>
              <Text> • Certificates of authenticity</Text>
              <Text> • Gallery exhibition catalogues</Text>
            </Flex>
          </>
        )}
      </Flex>
      <Spacer mt={2} />
      <Flex justifyContent="center" alignSelf="center" width="90%">
        <Button block haptic onPress={onDismiss}>
          Close
        </Button>
      </Flex>
    </FancyModal>
  )
}
