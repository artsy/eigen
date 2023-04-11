import { Spacer, SpacerProps, Flex, Text } from "@artsy/palette-mobile"
import { CircularSpinner } from "app/Components/CircularSpinner"
import { ImageBackground, ImageSourcePropType, StyleSheet } from "react-native"

interface FullScreenLoadingImageProps {
  loadingText: string
  imgSource: ImageSourcePropType
  spacerHeight?: SpacerProps["y"]
}

export const FullScreenLoadingImage: React.FC<FullScreenLoadingImageProps> = ({
  loadingText,
  imgSource,
  spacerHeight = 2,
}) => {
  return (
    <ImageBackground
      resizeMode="cover"
      style={{ ...StyleSheet.absoluteFillObject, height: "100%", width: "100%" }}
      source={imgSource}
    >
      <Flex flex={1} alignItems="center" justifyContent="center">
        <CircularSpinner color="white100" size="large" />

        <Spacer y={spacerHeight} />

        <Text variant="sm-display" color="white100" textAlign="center">
          {loadingText}
        </Text>
      </Flex>
    </ImageBackground>
  )
}
