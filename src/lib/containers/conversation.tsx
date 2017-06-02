import * as React from "react"

import {
  MetadataText,
  SmallHeadline,
} from "../../lib/components/messages/typography"

import { ImageURISource, ViewProperties } from "react-native"

import styled from "styled-components/native"
import colors from "../../data/colors"
import Composer from "../components/messages/composer"
import Message from "../components/messages/message"

// tslint:disable-next-line:no-var-requires
const chevron: ImageURISource = require("../../../images/horizontal_chevron.png")

const Container = styled.View`
  flex: 1
  flexDirection: column
  marginLeft: 20
  marginRight: 20
`
const Header = styled.View`
  alignSelf: stretch
  marginTop: 10
  flexDirection: column
`

const HeaderTextContainer = styled.View`
  flexDirection: row
  justifyContent: space-between
`

const BackButtonPlaceholder = styled.Image`
  height: 12
  width: 7
  transform: rotate(180deg)
`

const DottedBorder = styled.View`
  marginTop: 30
  height: 1
  borderWidth: 1
  borderStyle: dotted
  borderColor: ${colors["gray-regular"]}
`

interface Props extends ViewProperties {
  id: string,
  inquiry_id: string,
  from_name: string,
  from_email: string,
  to_name: string,
  last_message: string,
}

export default class Conversation extends React.Component<Props, {}> {
  render() {
    const partnerName = "Patrick Parrish Gallery"

    return (
      <Container>
        <Header>
          <HeaderTextContainer>
            <BackButtonPlaceholder source={chevron} />
            <SmallHeadline>{partnerName}</SmallHeadline>
            <MetadataText>Info</MetadataText>
          </HeaderTextContainer>
          <DottedBorder />
        </Header>
        <Message />
        <Composer onSubmit={(text) => console.log(text)}/>
      </Container>
    )
  }
}
