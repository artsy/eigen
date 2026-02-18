import { Flex, Spacer, SpacerProps, Spinner, Text } from "@artsy/palette-mobile"
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
  const Content = ({ color = "white" }: { color?: string }) => {
    return (
      <Flex flex={1} alignItems="center" justifyContent="center">
        <Flex alignItems="center" mb={1}>
          <Spinner size="large" color={color} />
        </Flex>

        <Spacer y={spacerHeight} />

        {!!title && (
          <Text variant="md" color={color} textAlign="center" fontWeight="bold" mb={1}>
            {title}
          </Text>
        )}

        <Text variant="sm-display" color={color} textAlign="center">
          {loadingText}
        </Text>
      </Flex>
    )
  }

  if (!imgSource) {
    return <Content color="mono100" />
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
