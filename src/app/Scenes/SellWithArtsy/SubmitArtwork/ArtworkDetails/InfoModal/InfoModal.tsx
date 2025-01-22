import {
  Spacer,
  Flex,
  Button,
  ButtonProps,
  useSpace,
  Screen,
  Touchable,
  CloseIcon,
} from "@artsy/palette-mobile"
import { Modal, ViewStyle } from "react-native"

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
}) => {
  const space = useSpace()
  return (
    <Modal visible={visible} onDismiss={onDismiss}>
      <Screen>
        <Screen.Header
          title={title}
          leftElements={
            <Touchable hitSlop={{ bottom: 40, right: 40, left: 40, top: 40 }} onPress={onDismiss}>
              <CloseIcon fill="black100" />
            </Touchable>
          }
        />

        <Flex bg="red10" style={[{ margin: space(2) }, containerStyle]}>
          {children}
        </Flex>
        <Spacer y={2} />
        <Flex justifyContent="center" alignSelf="center" px={2}>
          <Button block haptic onPress={onDismiss} variant={buttonVariant}>
            Close
          </Button>
        </Flex>
      </Screen>
    </Modal>
  )
}
