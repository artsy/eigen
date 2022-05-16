import { Box, Flex, Sans, Serif } from "palette"
import React from "react"
import { Dimensions, FlatList, Image, View } from "react-native"
import styled from "styled-components/native"

const isPad = Dimensions.get("window").width > 700

export default class ZeroStateInbox extends React.Component {
  render() {
    const rows = [
      {
        iconHref: require("images/find.webp"),
        text: "Follow artists and find works you love.",
      },
      {
        iconHref: require("images/contact.webp"),
        text: "Contact galleries or bid in auctions to purchase the work.",
      },
      {
        iconHref: require("images/message.webp"),
        text: "Find your ongoing conversations and bidding activity here.",
      },
      {
        iconHref: require("images/pay.webp"),
        text: "Easily process payment through our secure platform.",
      },
    ]

    return (
      <FlatList
        contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center" }}
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
            <Row>
              <Icon resizeMode="contain" source={item.iconHref} />
              <Flex style={{ flex: 1 }}>
                <Serif size="4">{item.text}</Serif>
              </Flex>
            </Row>
          )
        }}
      />
    )
  }
}

const Icon = styled(Image)`
  width: 40;
  margin-right: 20;
`

const Row = styled(View)`
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  padding-top: 30px;
  padding-right: 20px;
  padding-left: 20px;
  ${isPad ? "width: 600;" : "width: 100%;"};
`
