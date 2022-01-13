import { Button, Flex, Spacer, Text } from "palette"
import React from "react"
import { ActivityIndicator, Image, Modal } from "react-native"

interface ImageSearchModalProps {
  isVisible: boolean
  onDismiss: () => void
  isLoading: boolean
  errorMessage: string
}

export const ImageSearchModal: React.FC<ImageSearchModalProps> = ({
  isVisible,
  onDismiss,
  isLoading,
  errorMessage,
}) => {
  return (
    <Modal visible={isVisible} onDismiss={onDismiss} presentationStyle="fullScreen" animationType="slide">
      {isLoading ? (
        <Flex flex={1} justifyContent="center" alignItems="center">
          <Text>Analyzing image to find matches...</Text>
          <Spacer mb={2} />
          <ActivityIndicator size="large" color="black" />
        </Flex>
      ) : (
        <>
          <Spacer mb={1} />
          <Flex flex={1} justifyContent="center" alignItems="center">
            <Text>{errorMessage}</Text>
          </Flex>
          <Spacer mb={1} />
          <Flex flex={1} alignItems="center">
            <Button onPress={onDismiss}>
              <Text>Close</Text>
            </Button>
          </Flex>
        </>
      )}
    </Modal>
  )
}
