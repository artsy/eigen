import { Flex, Spacer, SpacerProps, Text } from "@artsy/palette-mobile"
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
      style={{ ...StyleSheet.absoluteFillObject }}
      source={imgSource}
    >
      <Flex flex={1} alignItems="center" justifyContent="center">
        <CircularSpinner color="white" size="large" />

        <Spacer y={spacerHeight} />

        {/* Setting the text color to white in light and dark mode because of the background image. */}
        <Text variant="sm-display" color="white" textAlign="center">
          {loadingText}
        </Text>
      </Flex>
    </ImageBackground>
  )
}
