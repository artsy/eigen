import * as React from "react"
import * as Relay from "react-relay"

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

export class Conversation extends React.Component<RelayProps, any> {
  render() {
    const conversation = this.props.me.conversation
    const partnerName = conversation.to_name

    /** These are the only messages we can access at the moment; eventually we will get an array of all messages in the
     *  conversation to use as `data`
     */
    const initialMessage = conversation.initial_message
    // tslint:disable-next-line:max-line-length
    const partnerResponse =
      "Hi Sarah, thanks for reaching out with your interest in this great piece by Ana Mendieta. Threestool is currently available at $3,600, please let me know if you have any other questions "
    const temporaryTimestamp = "11:00AM"

    const data = [
      { senderName: conversation.from_name, key: 0, time: temporaryTimestamp, body: initialMessage },
      { senderName: partnerName, key: 1, time: temporaryTimestamp, body: partnerResponse },
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

export default Relay.createContainer(Conversation, {
  initialVariables: {
    conversationID: null,
  },
  fragments: {
    me: () => Relay.QL`
      fragment on Me {
        conversation(id: $conversationID) {
          id
          from_name
          to_name
          initial_message
        }
      }
    `,
  },
})

interface RelayProps {
  me: {
    conversation: {
      id: string
      from_name: string
      to_name: string
      initial_message: string
    }
  }
}
