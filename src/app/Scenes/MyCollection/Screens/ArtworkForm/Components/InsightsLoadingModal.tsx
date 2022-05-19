import { CircularSpinner, Flex, Spacer, Text } from "palette"
import React from "react"
import { Dimensions, Image, Modal, ModalProps, View } from "react-native"

interface InsightsLoadingModalProps {
  isVisible: boolean
  artworkSaved: boolean
}

export const InsightsLoadingModal: React.FC<InsightsLoadingModalProps & ModalProps> = ({
  isVisible,
  artworkSaved = false,
  ...rest
}) => {
  const { height: screenHeight } = Dimensions.get("screen")

  return (
    <Modal animationType="slide" visible={isVisible} {...rest} statusBarTranslucent>
      <View style={{ position: "absolute", width: "100%" }}>
        <Image
          style={{ height: screenHeight, width: "100%" }}
          source={require("images/InsightsLoadingImage.webp")}
          resizeMode="cover"
        />
      </View>

      <Flex flex={1} alignItems="center" justifyContent="center">
        <CircularSpinner color="white100" size="large" />

        <Spacer my={5} />

        <Text variant="md" color="white100">
          {artworkSaved ? "Generating market data" : "Saving Artwork"}
        </Text>
      </Flex>
    </Modal>
  )
}
