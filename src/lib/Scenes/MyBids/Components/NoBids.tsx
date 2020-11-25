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
          Watch a live auction and place bids in advance or in real time, or you can bid in our curated timed auction
        </Text>
        <Flex width="100%" justifyContent="center" flexDirection="row">
          <Button variant="primaryBlack" onPress={() => handleViewAllAuctions()}>
            Explore Auctions
          </Button>
        </Flex>
      </Flex>
    )
  }
}
