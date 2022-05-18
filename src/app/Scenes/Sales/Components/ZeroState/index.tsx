import { Flex, Sans, Separator } from "palette"
import React from "react"
import { View } from "react-native"

export class ZeroState extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }} testID="Sales-Zero-State-Container">
        <Sans size="4" textAlign="center" mb={1} mt={2}>
          Auctions
        </Sans>
        <Separator />
        <Flex justifyContent="center" flexGrow={1}>
          <Sans size="3t" weight="medium" textAlign="center">
            There are no upcoming auctions scheduled
          </Sans>
          <Sans size="3t" textAlign="center" color="black60">
            Check back soon for new auctions on Artsy.
          </Sans>
        </Flex>
      </View>
    )
  }
}
