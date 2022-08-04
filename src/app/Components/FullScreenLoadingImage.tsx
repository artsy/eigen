import { CircularSpinner, Flex, Spacer, Text } from "palette"
import { ImageBackground, ImageSourcePropType, StyleSheet } from "react-native"
import { SpaceProps } from "styled-system"

interface FullScreenLoadingImageProps {
  loadingText: string
  imgSource: ImageSourcePropType
  spacerHeight?: SpaceProps["my"]
}

export const FullScreenLoadingImage: React.FC<FullScreenLoadingImageProps> = ({
  loadingText,
  imgSource,
  spacerHeight = 5,
}) => {
  return (
    <ImageBackground
      resizeMode="cover"
      style={{ ...StyleSheet.absoluteFillObject, height: "100%", width: "100%" }}
      source={imgSource}
    >
      <Flex flex={1} alignItems="center" justifyContent="center">
        <CircularSpinner color="white100" size="large" />

        <Spacer my={spacerHeight} />

        <Text variant="md" color="white100" textAlign="center">
          {loadingText}
        </Text>
      </Flex>
    </ImageBackground>
  )
}
