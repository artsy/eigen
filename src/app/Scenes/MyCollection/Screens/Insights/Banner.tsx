import { navigate } from "app/navigation/navigate"
import { Box, Button, Flex, Text } from "palette"
import React from "react"
import { ImageBackground } from "react-native"
import { useScreenDimensions } from "shared/hooks"
import styled from "styled-components"

const BackgroundImage = styled(ImageBackground)`
  align-items: center;
  padding-right: 20px;
  padding-left: 20px;
  height: 204px;
  width: 100%;
`

export const Banner: React.FC<{}> = () => {
  const screenDimensions = useScreenDimensions()

  return (
    <Box mb={3} width={screenDimensions.width} alignSelf="center">
      <BackgroundImage
        style={{ justifyContent: "space-between" }}
        source={require("images/MCInsights_banner_backgound_image.webp")}
      >
        <Flex alignItems="flex-start">
          <Text variant="lg" color="white100" mt={2}>
            Activate More Market Insights
          </Text>
          <Text mt={1} variant="xs" color="white100">
            Upload more of your artworks to get insights about artists you collect.
          </Text>
        </Flex>
        <Button
          mt={2}
          mb={2}
          block
          position="absolute"
          onPress={() => {
            navigate("my-collection/artworks/new", {
              passProps: {
                mode: "add",
              },
            })
          }}
        >
          Upload Another Artwork
        </Button>
      </BackgroundImage>
    </Box>
  )
}
