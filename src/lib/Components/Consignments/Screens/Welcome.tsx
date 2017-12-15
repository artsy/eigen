import React from "react"
import { Dimensions, Image, NavigatorIOS, Route, ScrollView, ViewProperties } from "react-native"

import { Schema, screenTrack } from "lib/utils/track"
import CloseButton from "../Components/CloseButton"
import ConsignmentBG from "../Components/ConsignmentBG"
import { Button } from "../Components/FormElements"
import { LargeHeadline } from "../Typography"
import Overview from "./Overview"

import { Fonts } from "lib/data/fonts"
import styled from "styled-components/native"

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  route: Route
}

const isPad = Dimensions.get("window").width > 700

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
const Listphone = styled.View`
  margin-bottom: 100;
  margin-left: 20;
`

const HorizontalLayout = styled.View`
  flex: 1;
  flex-direction: row;
  margin-left: ${isPad ? 0 : 20};
  margin-top: 50;
  margin-bottom: ${isPad ? 0 : 50};
`

const Title = styled.Text`
  text-align: center;
  font-size: ${isPad ? 20 : 16};
  line-height: ${isPad ? 24 : 32};
  width: ${isPad ? 760 : 300};
  margin-top: ${isPad ? 0 : 35};
  font-family: ${Fonts.AvantGardeRegular};
  align-self: center;
  color: white;
`

const SmallHeadline = styled(LargeHeadline)`
  font-size: ${isPad ? 30 : 20};
  color: white;
  ${isPad ? "width: 540" : "max-width: 280"};
  min-height: 60;
  text-align: left;
`

const Icon = styled(Image)`
  resize-mode: contain;
  width: 40;
`

const ButtonsView = styled.View`
  flex: 1;
  align-items: center;
`

const List = isPad ? Listpad : Listphone

@screenTrack({
  context_screen: Schema.PageNames.ConsignmentsWelcome,
  context_screen_owner_type: Schema.OwnerEntityTypes.Consignment,
})
export default class Welcome extends React.Component<Props, null> {
  goTapped = () => this.props.navigator.push({ component: Overview })

  render() {
    return (
      <ConsignmentBG>
        <ScrollView style={{ flex: 1 }} centerContent>
          <VerticalLayout>
            <Title>SELL WORKS FROM YOUR COLLECTION</Title>
            <List>
              <HorizontalLayout>
                <Icon source={require("../../../../../images/cam.png")} />
                <SmallHeadline>Take a few photos and submit details about the work</SmallHeadline>
              </HorizontalLayout>
              <HorizontalLayout>
                <Icon source={require("../../../../../images/offer.png")} />
                <SmallHeadline>Get the offers from galleries and auction houses</SmallHeadline>
              </HorizontalLayout>
              <HorizontalLayout>
                <Icon source={require("../../../../../images/sell.png")} />
                <SmallHeadline>Have your work placed in a gallery or upcoming sale</SmallHeadline>
              </HorizontalLayout>
              <HorizontalLayout>
                <Icon source={require("../../../../../images/money.png")} />
                <SmallHeadline>Receive payment once the work sells</SmallHeadline>
              </HorizontalLayout>
              <ButtonsView>
                <Button text="GET STARTED" onPress={this.goTapped} />
                <CloseButton />
              </ButtonsView>
            </List>
          </VerticalLayout>
        </ScrollView>
      </ConsignmentBG>
    )
  }
}
