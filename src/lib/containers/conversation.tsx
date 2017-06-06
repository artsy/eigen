import * as React from "react"

import {
  MetadataText,
  SmallHeadline,
} from "../components/inbox/typography"

import { ImageURISource, ViewProperties } from "react-native"

import styled from "styled-components/native"
import colors from "../../data/colors"
import Composer from "../components/inbox/conversations/composer"
import Message from "../components/inbox/conversations/message"

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
  id: string | null,
  inquiry_id: string | null,
  from_name: string | null,
  from_email: string | null,
  to_name: string | null,
  last_message: string | null,
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
        <Composer />
      </Container>
    )
  }
}
