import * as React from "react"
import * as Relay from "react-relay"
import styled from "styled-components/native"

import { RefreshControl, ScrollView, View } from "react-native"
import ActiveBids from "../Components/Inbox/Bids"
import Conversations from "../Components/Inbox/Conversations"
import ZeroStateInbox from "../Components/Inbox/Conversations/ZerostateInbox"

interface Props extends RelayProps {
  relay?: Relay.RelayProp
}

interface State {
  hasBids: boolean
  hasMessages: boolean
  fetchingData: boolean
}

const Container = styled.ScrollView`flex: 1;`

export class Inbox extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      hasBids: false,
      hasMessages: false,
      fetchingData: false,
    }

    this.fetchData = this.fetchData.bind(this)
  }

  fetchData() {
    if (this.state.fetchingData) {
      return
    }

    this.setState({ fetchingData: true })
    this.props.relay.forceFetch({}, readyState => {
      if (readyState.done) {
        this.setState({ fetchingData: false })
      }
    })
  }

  render() {
    const updateBidsState = hasBids => {
      this.setState({ hasBids })
    }
    const updateMessagesState = hasMessages => {
      this.setState({ hasMessages })
    }

    const shouldShowEmptyState = !this.state.hasBids && !this.state.hasMessages

    return (
      <Container refreshControl={<RefreshControl refreshing={this.state.fetchingData} onRefresh={this.fetchData} />}>
        <ActiveBids me={this.props.me as any} onDataLoaded={updateBidsState} />
        <Conversations me={this.props.me} onDataLoaded={updateMessagesState} />
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
