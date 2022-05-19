import { navigate, popToRoot } from "app/navigation/navigate"
import { Button, Flex, Text, useSpace } from "palette"
import React from "react"
import { Image } from "react-native"

export const MyCollectionInsightsEmptyState = () => {
  const space = useSpace()

  return (
    <Flex px={1} testID="my-collection-insights-empty-state">
      <Text variant="md" textAlign="center">
        Gain deeper knowledge of your artwork
      </Text>
      <Text variant="xs" color="black60" textAlign="center">
        Get free market insights about the artists you collect.
      </Text>
      <Image
        source={require("images/my-collection-empty-state.webp")}
        resizeMode="contain"
        style={{
          height: 120,
          width: 327,
          marginVertical: space(2),
        }}
      />
      <Button
        block
        onPress={() =>
          navigate("my-collection/artworks/new", {
            passProps: {
              mode: "add",
              onSuccess: popToRoot,
            },
          })
        }
      >
        Upload Your Artwork
      </Button>
    </Flex>
  )
}
