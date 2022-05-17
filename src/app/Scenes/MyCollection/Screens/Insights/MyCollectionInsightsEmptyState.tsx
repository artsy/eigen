import { navigate, popToRoot } from "app/navigation/navigate"
import { Button, Flex, Text } from "palette"
import React from "react"

export const MyCollectionInsightsEmptyState = () => {
  return (
    <Flex px={1} testID="my-collection-insights-empty-state">
      <Text variant="md" textAlign="center">
        Gain deeper knowledge of your artwork
      </Text>
      <Text variant="xs" color="black60" textAlign="center">
        Get free market insights about the artists you collect.
      </Text>
      <Flex my={2} height={120} width="100%" backgroundColor="grey" />
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
