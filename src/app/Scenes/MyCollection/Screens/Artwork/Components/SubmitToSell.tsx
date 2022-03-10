import { navigate } from "app/navigation/navigate"
import { Button, Flex, Join, Spacer, Text } from "palette"
import React from "react"

export const SubmitToSell: React.FC = () => {
  return (
    <Flex>
      <Join separator={<Spacer my={3} />}>
        <Text variant="lg" textAlign="center">
          Interested in Selling This Work?
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
        Submit This Artwork to Sell
      </Button>

      <Spacer mb={3} />
      <Text variant="xs" color="black60" textAlign="center">
        Learn more about{" "}
        <Text
          variant="xs"
          underline
          onPress={() => {
            navigate("/selling-with-artsy")
          }}
        >
          selling with Artsy.
        </Text>
      </Text>
    </Flex>
  )
}
