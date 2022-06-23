import { CircularSpinner, Flex, Spacer, Text } from "palette"
import React from "react"
import { ImageBackground, Modal, ModalProps, StyleSheet } from "react-native"

interface SavingArtworkModalProps {
  isVisible: boolean
  loadingText: string
}

export const SavingArtworkModal: React.FC<SavingArtworkModalProps & ModalProps> = ({
  isVisible,
  loadingText = "",
  ...rest
}) => (
  <Modal animationType="fade" visible={isVisible} {...rest} transparent statusBarTranslucent>
    <ImageBackground
      style={{ height: "100%", width: "100%", ...StyleSheet.absoluteFillObject }}
      source={require("images/InsightsLoadingImage.webp")}
      resizeMode="cover"
    >
      <Flex flex={1} alignItems="center" justifyContent="center">
        <CircularSpinner color="white100" size="large" />

        <Spacer my={5} />

        <Text variant="md" color="white100">
          {loadingText}
        </Text>
      </Flex>
    </ImageBackground>
  </Modal>
)
