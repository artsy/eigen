import { Color, Flex, Spinner } from "palette"
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
  const { backgroundColor, spinnerColor } = getColors(dark)
  return (
    <Modal
      animationType="fade"
      visible={isVisible}
      {...(rest as any)}
      transparent
      statusBarTranslucent
    >
      <Flex flex={1} alignItems="center" justifyContent="center" style={{ backgroundColor }}>
        <Spinner color={spinnerColor} />
      </Flex>
    </Modal>
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
