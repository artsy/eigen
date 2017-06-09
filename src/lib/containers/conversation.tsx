import * as React from "react"

import { MetadataText, SmallHeadline } from "../components/inbox/typography"

import { FlatList, ImageURISource, ViewProperties } from "react-native"

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
  height: 1
  borderWidth: 1
  borderStyle: dotted
  borderColor: ${colors["gray-regular"]}
`

const MessagesList = styled(FlatList)`
  marginTop: 30
`

interface Props extends ViewProperties {
  id?: string
  inquiry_id?: string
  from_name?: string
  from_email?: string
  to_name?: string
  last_message?: string
}

export default class Conversation extends React.Component<Props, any> {
  render() {
    const partnerName = "Patrick Parrish Gallery"
    // tslint:disable-next-line:max-line-length
    const messageBody =
      "Hi, I'm interested in purchasing this work. Could you please provide more information about the piece, including price?"
    // tslint:disable-next-line:max-line-length
    const otherMessageBody =
      "Hi Katarina, thanks for reaching out with your interest in this great piece by Ian Stell. Threestool is currently available at $3,600, please let me know if you have any other questions "
    const data = [
      { senderName: "Katarina Batina", key: 0, time: "11:00AM", body: messageBody },
      { senderName: "Patrick Parrish", key: 1, time: "11:00AM", body: otherMessageBody },
    ]

    return (
      <Container>
        <Header>
          <HeaderTextContainer>
            <BackButtonPlaceholder source={chevron} />
            <SmallHeadline>{partnerName}</SmallHeadline>
            <MetadataText>Info</MetadataText>
          </HeaderTextContainer>
        </Header>
        <MessagesList
          data={data}
          renderItem={messageProps => <Message message={messageProps.item} />}
          ItemSeparatorComponent={DottedBorder}
        />
        <Composer />
      </Container>
    )
  }
}
