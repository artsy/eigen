import React from "react"

import { Dimensions, Image, ListView, ListViewDataSource, ScrollView, Text, View } from "react-native"
import { LargeHeadline } from "../Typography"

import colors from "lib/data/colors"
import fonts from "lib/data/fonts"
import styled from "styled-components/native"

const isPad = Dimensions.get("window").width > 700

const CenteredView = styled.View`
  background-color: ${colors["gray-light"]};
  align-items: center;
  width: 100%;
  height: 100%;
`

const VerticalLayout = styled.View`
  flex: 1;
  flex-direction: column;
  min-height: 400;
  max-height: 800;
  align-items: ${isPad ? "center" : "stretch"};
`
const List = styled.View`
  align-items: center;
  padding-top: ${isPad ? 80 : 0};
`
const HorizontalLayout = styled.View`
  flex: 1;
  flex-direction: row;
  margin-left: ${isPad ? 0 : 20};
  margin-top: 50;
  margin-bottom: ${isPad ? 0 : 50};
`

const Title = styled(LargeHeadline)`
  text-align: center;
  font-size: ${isPad ? 50 : 30};
  line-height: ${isPad ? 58 : 32};
  width: ${isPad ? 700 : 280};
  margin-top: ${isPad ? 80 : 35};
  align-self: center;
`

const SmallHeadline = styled(LargeHeadline)`
  font-size: ${isPad ? 34 : 18};
  color: black;
  ${isPad ? "width: 540" : "max-width: 280"};
  min-height: 60;
`

const Icon = styled(Image)`
  resize-mode: contain;
  width: 40;
`

export default () =>
  <CenteredView>
    <VerticalLayout>
      <Title>Buying Art on Artsy is Simple </Title>
      <List>
        <HorizontalLayout>
          <Icon source={require("../../../../../images/find.png")} />
          <SmallHeadline>Follow artists and find works you love</SmallHeadline>
        </HorizontalLayout>
        <HorizontalLayout>
          <Icon source={require("../../../../../images/contact.png")} />
          <SmallHeadline>Contact galleries or bid in auctions to purchase the work</SmallHeadline>
        </HorizontalLayout>
        <HorizontalLayout>
          <Icon source={require("../../../../../images/message.png")} />
          <SmallHeadline>Find your ongoing conversations and bidding activity here</SmallHeadline>
        </HorizontalLayout>
        <HorizontalLayout>
          <Icon source={require("../../../../../images/pay.png")} />
          <SmallHeadline>Easily process payment through our secure platform</SmallHeadline>
        </HorizontalLayout>
      </List>
    </VerticalLayout>
  </CenteredView>
