/**
 * TODO: This file shares much with the Conversations/ZeroStateInbox screen and should be refactored.
 */

import React from "react"
import { Image, LayoutChangeEvent, Route, ScrollView, TextProperties, ViewProperties } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"

import { Schema, screenTrack } from "lib/utils/track"
import CloseButton from "../Components/CloseButton"
import ConsignmentBG from "../Components/ConsignmentBG"
import { FormButton } from "../Components/FormElements"
import * as Typography from "../Typography"
import Overview from "./Overview"

import { Fonts } from "lib/data/fonts"
import styled, { StyledFunction } from "styled-components/native"

const View: StyledFunction<DeviceProps & ViewProperties> = styled.View
const Text: StyledFunction<DeviceProps & TextProperties> = styled.Text

interface DeviceProps {
  isTiny: boolean
  isPad: boolean
  isPortrait: boolean
}

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  route: Route
}

interface State {
  deviceProps?: DeviceProps
}

const VerticalLayout = View`
  flex: 1;
  flex-direction: column;
  align-items: ${({ isPad }) => (isPad ? "center" : "stretch")};
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
  margin-top: ${({ isPad, isPortrait }) => (isPad && isPortrait ? 230 : 58)};
  font-family: ${Fonts.AvantGardeRegular};
  color: white;
  margin-bottom: 63;
  /* This text aligment doesn’t seem to work, so using letter-spacing instead. */
  /* text-align: justify; */
  letter-spacing: ${({ isTiny }) => (isTiny ? "-0.2" : "1.474")};
`

/* TODO: This should actually have a reduced line gap, but there doesn’t appear to be a way to do so. Maybe native? */
const BaseHeadline: StyledFunction<DeviceProps & TextProperties> = styled(Typography.LargeHeadline)
const SmallHeadline = BaseHeadline`
  font-size:   ${({ isTiny }) => (isTiny ? 18 : 20)} ;
  line-height: 22;
  flex: 1;
  padding: 0;
  color: white;
  margin-right: 0;
  margin-bottom: 0;
  text-align: left;
`

const Icon = styled(Image)`
  resize-mode: contain;
  width: 40;
  margin-right: 24;
`

const ButtonsView = View`
  flex: 1;
  align-items: center;
  margin-top: ${({ isPad }) => (isPad ? 50 : 8)};
  margin-bottom: 10;
`

const Contents: React.SFC<{ deviceProps: DeviceProps; onPress: () => void }> = ({ deviceProps, onPress }) => {
  return (
    <ScrollView style={{ flex: 1 }} alwaysBounceVertical={false}>
      <VerticalLayout {...deviceProps}>
        <List {...deviceProps}>
          <Title {...deviceProps}>SELL WORKS FROM YOUR COLLECTION</Title>
          <HorizontalLayout {...deviceProps}>
            <Icon source={require("../../../../../images/cam.png")} />
            <SmallHeadline {...deviceProps}>Take a few photos and submit details about the work</SmallHeadline>
          </HorizontalLayout>
          <HorizontalLayout {...deviceProps}>
            <Icon source={require("../../../../../images/offer.png")} />
            <SmallHeadline {...deviceProps}>Get offers from galleries and auction houses</SmallHeadline>
          </HorizontalLayout>
          <HorizontalLayout {...deviceProps}>
            <Icon source={require("../../../../../images/sell.png")} />
            <SmallHeadline {...deviceProps}>Have your work placed in a gallery or upcoming sale</SmallHeadline>
          </HorizontalLayout>
          <HorizontalLayout {...deviceProps}>
            <Icon source={require("../../../../../images/money.png")} />
            <SmallHeadline {...deviceProps}>
              Receive payment once the
              {"\n"}
              work sells
            </SmallHeadline>
          </HorizontalLayout>
          <ButtonsView {...deviceProps}>
            <FormButton text="GET STARTED" onPress={onPress} style={{ marginTop: 0 }} />
            <CloseButton />
          </ButtonsView>
        </List>
      </VerticalLayout>
    </ScrollView>
  )
}

@screenTrack({
  context_screen: Schema.PageNames.ConsignmentsWelcome,
  context_screen_owner_type: Schema.OwnerEntityTypes.Consignment,
})
export default class Welcome extends React.Component<Props, State> {
  state = { deviceProps: undefined }

  goTapped = () => this.props.navigator.push({ component: Overview })

  handleLayoutChange = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout
    this.setState({
      deviceProps: {
        isTiny: width < 321, // Pre-iPhone 6
        isPad: width > 700,
        isPortrait: width < height,
      },
    })
  }

  render() {
    return (
      <ConsignmentBG onLayout={this.handleLayoutChange}>
        {this.state.deviceProps && <Contents deviceProps={this.state.deviceProps} onPress={this.goTapped} />}
      </ConsignmentBG>
    )
  }
}
