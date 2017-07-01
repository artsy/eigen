import * as React from "react"
import * as Relay from "react-relay"
import styled from "styled-components/native"

import { ScrollView, View } from "react-native"
import ActiveBids from "../Components/Inbox/Bids"
import Conversations from "../Components/Inbox/Conversations"
import ZeroStateInbox from "../Components/Inbox/Conversations/ZerostateInbox"

interface State {
  hasBids?: boolean
  hasMessages?: boolean
}

const Container = styled.View`flex: 1;`

export class Inbox extends React.Component<RelayProps, State> {
  constructor(props) {
    super(props)

    this.state = {
      hasBids: false,
      hasMessages: false,
    }
  }

  render() {
    const updateBidsState = hasBids => {
      this.setState({ hasBids })
    }
    const updateMessagesState = hasMessages => {
      this.setState({ hasMessages })
    }

    const shouldShowEmptyState = !this.state.hasBids && !this.state.hasMessages
    const headerView = <ActiveBids me={this.props.me as any} onDataLoaded={updateBidsState} />
    return (
      <Container>
        <Conversations me={this.props.me} headerView={headerView} onDataLoaded={updateMessagesState} />
        {shouldShowEmptyState ? <ZeroStateInbox /> : null}
      </Container>
    )
  }
}

export default Relay.createContainer(Inbox, {
  fragments: {
    me: () => Relay.QL`
      fragment on Me {
        ${Conversations.getFragment("me")}
        ${ActiveBids.getFragment("me")}
      }
    `,
  },
})

interface RelayProps {
  me: {}
}
