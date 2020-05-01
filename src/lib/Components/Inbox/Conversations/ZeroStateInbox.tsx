import { Box, Flex, Sans, Serif, Spacer } from "@artsy/palette"
import React from "react"
import { FlatList, Image } from "react-native"
import styled from "styled-components/native"

export default class ZeroStateInbox extends React.Component {
  render() {
    const rows = [
      {
        iconHref: require("../../../../../images/find.png"),
        text: "Follow artists and find works you love.",
      },
      {
        iconHref: require("../../../../../images/contact.png"),
        text: "Contact galleries or bid in auctions to purchase the work.",
      },
      {
        iconHref: require("../../../../../images/message.png"),
        text: "Find your ongoing conversations and bidding activity here.",
      },
      {
        iconHref: require("../../../../../images/pay.png"),
        text: "Easily process payment through our secure platform.",
      },
    ]

    return (
      <FlatList
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        data={rows}
        alwaysBounceVertical={false}
        keyExtractor={(_item, index) => String(index)}
        ListHeaderComponent={() => (
          <Box px={2}>
            <Sans size="4" textAlign="center" weight="medium">
              Buying art on Artsy is simple
            </Sans>
          </Box>
        )}
        renderItem={({ item }) => {
          return (
            <Box px={2}>
              <Spacer mb={3} />
              <Flex flexDirection="row" alignItems="center" flexWrap="nowrap">
                <Icon source={item.iconHref} />
                <Flex style={{ flex: 1 }}>
                  <Serif size="4">{item.text}</Serif>
                </Flex>
              </Flex>
            </Box>
          )
        }}
      />
    )
  }
}

const Icon = styled(Image)`
  resize-mode: contain;
  width: 40;
  margin-right: 20;
`
