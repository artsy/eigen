import React from "react"

import { Dimensions, Image, ListView, ListViewDataSource, ScrollView, Text, View } from "react-native"
import { LargeHeadline } from "../Typography"

import { Fonts } from "lib/data/fonts"
import styled from "styled-components/native"

const isPad = Dimensions.get("window").width > 700

const CenteredView = styled.View`
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
const Listpad = styled.View`
  align-items: center;
  padding-top: 80;
`
const Listphone = styled.View`margin-bottom: 100;`

const HorizontalLayout = styled.View`
  flex: 1;
  flex-direction: row;
  margin-left: ${isPad ? 0 : 20};
  margin-top: 50;
  margin-bottom: ${isPad ? 0 : 50};
`

const Title = styled.Text`
  text-align: center;
  font-size: ${isPad ? 46 : 16};
  line-height: ${isPad ? 58 : 32};
  width: ${isPad ? 700 : 280};
  margin-top: ${isPad ? 80 : 35};
  font-family: ${Fonts.AvantGardeRegular};
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

const List = isPad ? Listpad : Listphone

export default () =>
  <CenteredView>
    <VerticalLayout>
      <Title>BUYING ART ON ARTSY IS SIMPLE</Title>
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
