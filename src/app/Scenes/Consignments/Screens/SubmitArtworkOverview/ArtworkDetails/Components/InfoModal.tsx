import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Button, Flex, Spacer, Text } from "palette"
import React from "react"

interface Props {
  title: string
  visible: boolean
  onDismiss: () => void
}

export const InfoModal: React.FC<Props> = ({ title, visible, onDismiss, children }) => {
  return (
    <FancyModal visible={visible} onBackgroundPressed={onDismiss}>
      <FancyModalHeader onRightButtonPress={onDismiss} hideBottomDivider rightCloseButton>
        <Text fontSize={24}>{title}</Text>
      </FancyModalHeader>

      <Flex m={2}>{children}</Flex>
      <Spacer mt={2} />
      <Flex justifyContent="center" alignSelf="center" width="90%">
        <Button block haptic onPress={onDismiss}>
          Close
        </Button>
      </Flex>
    </FancyModal>
  )
}
