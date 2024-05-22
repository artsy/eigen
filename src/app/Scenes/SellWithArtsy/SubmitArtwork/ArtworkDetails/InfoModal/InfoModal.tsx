import { Spacer, Flex, Text, Button, ButtonProps } from "@artsy/palette-mobile"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"

interface Props {
  buttonVariant?: ButtonProps["variant"]
  onDismiss: () => void
  title: string
  visible: boolean
}

export const InfoModal: React.FC<Props> = ({
  children,
  onDismiss,
  visible,
  buttonVariant,
  title,
}) => {
  return (
    <FancyModal visible={visible} onBackgroundPressed={onDismiss}>
      <FancyModalHeader onRightButtonPress={onDismiss} hideBottomDivider rightCloseButton>
        <Text fontSize={24}>{title}</Text>
      </FancyModalHeader>

      <Flex m={2}>{children}</Flex>
      <Spacer y={2} />
      <Flex justifyContent="center" alignSelf="center" width="90%">
        <Button block haptic onPress={onDismiss} variant={buttonVariant}>
          Close
        </Button>
      </Flex>
    </FancyModal>
  )
}
