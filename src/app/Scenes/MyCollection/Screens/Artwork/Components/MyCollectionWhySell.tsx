import { navigate } from "app/navigation/navigate"
import { Button, Flex, Join, Spacer, Text } from "palette"
import React from "react"

export const MyCollectionWhySell: React.FC = () => {
  return (
    <Flex>
      <Join separator={<Spacer my={3} />}>
        <Text variant="lg" textAlign="center" testID="SWA-banner-in-MC">
          Sell Art From Your Collection
        </Text>
      </Join>
      <Spacer mt={2} />
      <Text variant="xs" color="black60" textAlign="center">
        Submit an artwork and reach Artsy’s global network. Our specialists will guide you through
        creating a strategy and selling your work.
      </Text>
      <Spacer mb={3} />
      <Button
        size="large"
        variant="fillDark"
        block
        onPress={() => {
          navigate("/sales")
        }}
        testID="LearnMoreButton"
      >
        Learn More
      </Button>
    </Flex>
  )
}
