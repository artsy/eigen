import { Flex, Spinner } from "palette"
import React from "react"
import { Modal, ModalProps } from "react-native"

interface LoadingModalProps {
  isVisible: boolean
}

const LoadingModal: React.FC<LoadingModalProps & ModalProps> = ({ isVisible, ...rest }) => (
  <Modal
    animationType="fade"
    visible={isVisible}
    {...(rest as any)}
    transparent
    statusBarTranslucent
  >
    <Flex
      flex={1}
      alignItems="center"
      justifyContent="center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }}
    >
      <Spinner />
    </Flex>
  </Modal>
)

export default LoadingModal
