/**
 * TODO: This file shares much with the Consignments/Welcome screen and should be refactored.
 */

import React from "react"

import { Image, LayoutChangeEvent, ScrollView, TextProperties, ViewProperties } from "react-native"
import * as Typography from "../Typography"

import { Fonts } from "lib/data/fonts"
import styled, { StyledFunction } from "styled-components/native"

const View: StyledFunction<DeviceProps & ViewProperties> = styled.View
const Text: StyledFunction<DeviceProps & TextProperties> = styled.Text

interface DeviceProps {
  size: {
    height: number
  }
  isTiny: boolean
  isPad: boolean
  isPortrait: boolean
}

interface State {
  deviceProps?: DeviceProps
}

const VerticalLayout = View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  min-height: ${props => props.size.height};
`

const List = View`
  align-self: center;
  width: ${({ isTiny }) => (isTiny ? 280 : 330)};
  margin-top: 0;
  margin-bottom: 0;
`

const HorizontalLayout = View`
  flex-direction: row;
  margin-left: 0;
  margin-top: 0;
  margin-bottom: 51;
`

const Title = Text`
  font-size: 16;
  line-height: 22;
  font-family: ${Fonts.AvantGardeRegular};
  color: black;
  margin-top: 10;
  margin-bottom: 63;
  text-align: center;
`

/* TODO: This should actually have a reduced line gap, but there doesn’t appear to be a way to do so. Maybe native? */
const BaseHeadline: StyledFunction<DeviceProps & TextProperties> = styled(Typography.LargeHeadline)
const SmallHeadline = BaseHeadline`
  font-size: 20;
  line-height: 22;
  flex: 1;
  padding: 0;
  color: black;
  margin-right: 0;
  margin-bottom: 0;
  text-align: left;
  /* This is not 44, as per the design, because RN currently clips text regardless of overflow setting. In our case it
     would clip the descender part of the font. */
  height: 47;
  /* height: 44; */
  /* overflow: visible; */
`

const Icon = styled(Image)`
  resize-mode: contain;
  width: 40;
  margin-right: 24;
`

const Contents: React.SFC<DeviceProps> = deviceProps => {
  return (
    <VerticalLayout {...deviceProps}>
      <List {...deviceProps}>
        <Title {...deviceProps}>BUYING ART ON ARTSY IS SIMPLE</Title>
        <HorizontalLayout {...deviceProps}>
          <Icon source={require("../../../../../images/find.png")} />
          <SmallHeadline {...deviceProps}>Follow artists and find works you love</SmallHeadline>
        </HorizontalLayout>
        <HorizontalLayout {...deviceProps}>
          <Icon source={require("../../../../../images/contact.png")} />
          <SmallHeadline {...deviceProps}>Contact galleries or bid in auctions to purchase the work</SmallHeadline>
        </HorizontalLayout>
        <HorizontalLayout {...deviceProps}>
          <Icon source={require("../../../../../images/message.png")} />
          <SmallHeadline {...deviceProps}>Find your ongoing conversations and bidding activity here</SmallHeadline>
        </HorizontalLayout>
        <HorizontalLayout {...deviceProps}>
          <Icon source={require("../../../../../images/pay.png")} />
          <SmallHeadline {...deviceProps}>Easily process payment through our secure platform</SmallHeadline>
        </HorizontalLayout>
      </List>
    </VerticalLayout>
  )
}

export default class ZeroStateInbox extends React.Component<{}, State> {
  state = { deviceProps: undefined }

  handleLayoutChange = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout
    this.setState({
      deviceProps: {
        size: {
          height,
        },
        isTiny: width < 321, // Pre-iPhone 6
        isPad: width > 700,
        isPortrait: width < height,
      },
    })
  }

  render() {
    return (
      <ScrollView style={{ flex: 1 }} onLayout={this.handleLayoutChange} alwaysBounceVertical={false}>
        {this.state.deviceProps && <Contents {...this.state.deviceProps} />}
      </ScrollView>
    )
  }
}
