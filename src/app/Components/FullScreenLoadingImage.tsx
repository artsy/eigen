import { Flex, Spacer, SpacerProps, Text } from "@artsy/palette-mobile"
import { CircularSpinner } from "app/Components/CircularSpinner"
import { ImageBackground, ImageSourcePropType, StyleSheet } from "react-native"

interface FullScreenLoadingImageProps {
  title?: string
  loadingText: string
  imgSource?: ImageSourcePropType
  spacerHeight?: SpacerProps["y"]
}

export const FullScreenLoadingImage: React.FC<FullScreenLoadingImageProps> = ({
  title,
  loadingText,
  imgSource,
  spacerHeight = 2,
}) => {
  const Content = () => {
    return (
      <Flex flex={1} alignItems="center" justifyContent="center">
        <CircularSpinner color="white" size="large" />

        <Spacer y={spacerHeight} />

        {!!title && (
          // {/* Setting the text color to white in light and dark mode because of the background image. */}
          <Text variant="md" color="white" textAlign="center" fontWeight="bold" mb={1}>
            {title}
          </Text>
        )}

        {/* Setting the text color to white in light and dark mode because of the background image. */}
        <Text variant="sm-display" color="white" textAlign="center">
          {loadingText}
        </Text>
      </Flex>
    )
  }

  if (!imgSource) {
    return <Content />
  }
  return (
    <ImageBackground
      resizeMode="cover"
      style={{ ...StyleSheet.absoluteFillObject }}
      source={imgSource}
    >
      <Content />
    </ImageBackground>
  )
}
