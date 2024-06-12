import { Spacer, Flex, Text, Button, ButtonProps, useSpace } from "@artsy/palette-mobile"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { ViewStyle } from "react-native"

interface Props {
  buttonVariant?: ButtonProps["variant"]
  containerStyle?: ViewStyle
  onDismiss: () => void
  title?: string
  visible: boolean
  fullScreen?: boolean
}

export const InfoModal: React.FC<Props> = ({
  buttonVariant,
  children,
  containerStyle,
  onDismiss,
  title,
  visible,
  fullScreen = false,
}) => {
  const space = useSpace()
  return (
    <FancyModal visible={visible} onBackgroundPressed={onDismiss} fullScreen={fullScreen}>
      <FancyModalHeader onLeftButtonPress={onDismiss} hideBottomDivider useXButton>
        {!!title && <Text fontSize={24}>{title}</Text>}
      </FancyModalHeader>

      <Flex style={[{ margin: space(2) }, containerStyle]}>{children}</Flex>
      <Spacer y={2} />
      <Flex justifyContent="center" alignSelf="center" px={2}>
        <Button block haptic onPress={onDismiss} variant={buttonVariant}>
          Close
        </Button>
      </Flex>
    </FancyModal>
  )
}
