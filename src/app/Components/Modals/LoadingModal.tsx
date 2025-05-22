import { Color, Flex, Spinner } from "@artsy/palette-mobile"
import { ReactNode } from "react"
import { Modal, ModalProps } from "react-native"

interface LoadingModalProps {
  isVisible: boolean
  dark?: boolean
}

const LoadingModal: React.FC<LoadingModalProps & ModalProps> = ({
  isVisible,
  dark = false,
  ...rest
}) => {
  return (
    <Modal
      animationType="fade"
      visible={isVisible}
      {...(rest as any)}
      transparent
      statusBarTranslucent
    >
      <LoadingSpinner dark={dark} />
    </Modal>
  )
}

export const LoadingSpinner: React.FC<{ dark?: boolean; children?: ReactNode }> = ({
  dark = false,
  children,
}) => {
  const { backgroundColor, spinnerColor } = getColors(dark)

  return (
    <Flex flex={1} justifyContent="center" style={{ backgroundColor }}>
      <Flex alignItems="center">
        <Spinner color={spinnerColor} size="large" />
        {children}
      </Flex>
    </Flex>
  )
}

const getColors = (dark: boolean): { backgroundColor: string; spinnerColor: Color } => {
  if (dark) {
    return {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      spinnerColor: "mono0",
    }
  }
  return {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    spinnerColor: "mono100",
  }
}

export default LoadingModal
