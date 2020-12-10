import { navigate } from "lib/navigation/navigate"
import { Button, Flex, Text } from "palette"
import React from "react"

export class NoBids extends React.Component<{ headerText: string }> {
  render() {
    const handleViewAllAuctions = () => {
      navigate(`/auctions`)
    }
    const { headerText } = this.props
    return (
      <Flex mt={3}>
        <Text variant="title" textAlign="center" fontWeight="normal">
          {headerText}
        </Text>
        <Text mb={2} mt={1} mx={4} variant="text" textAlign="center" fontWeight="normal" color="black60">
          Browse and bid in auctions around the world, from online-only sales to benefit auctions—all in the Artsy app
        </Text>
        <Flex width="100%" justifyContent="center" flexDirection="row">
          <Button variant="primaryBlack" onPress={() => handleViewAllAuctions()}>
            Explore auctions
          </Button>
        </Flex>
      </Flex>
    )
  }
}
