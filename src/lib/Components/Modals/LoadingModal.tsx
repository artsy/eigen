import { Flex } from "palette"
import React from "react"
import { ActivityIndicator, Modal, ModalProps } from "react-native"

interface LoadingModalProps {
  isVisible: boolean
}

const LoadingModal: React.FC<LoadingModalProps & ModalProps> = ({ isVisible, ...rest }) => (
  <Modal animationType="fade" visible={isVisible} {...(rest as any)} transparent>
    <Flex flex={1} alignItems="center" justifyContent="center" style={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }}>
      <ActivityIndicator size="large" />
    </Flex>
  </Modal>
)

export default LoadingModal
