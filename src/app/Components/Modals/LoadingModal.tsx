import { Flex, Color, Spinner } from "@artsy/palette-mobile"
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

export const LoadingSpinner: React.FC<{ dark?: boolean }> = ({ dark = false }) => {
  const { backgroundColor, spinnerColor } = getColors(dark)

  return (
    <Flex flex={1} alignItems="center" justifyContent="center" style={{ backgroundColor }}>
      <Spinner color={spinnerColor} />
    </Flex>
  )
}

const getColors = (dark: boolean): { backgroundColor: string; spinnerColor: Color } => {
  if (dark) {
    return {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      spinnerColor: "white100",
    }
  }
  return {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    spinnerColor: "black100",
  }
}

export default LoadingModal
