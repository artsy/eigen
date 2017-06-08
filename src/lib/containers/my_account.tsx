import * as React from "react"
import * as Relay from "react-relay"

import { Dimensions, ScrollView, View, ViewProperties, ViewStyle } from "react-native"

import Headline from "../components/text/headline"

interface Props extends ViewProperties, RelayProps {}

export class MyAccount extends React.Component<Props, {}> {
  state: {
    selectedTabIndex: number
  }

  render() {
    const windowDimensions = Dimensions.get("window")
    const commonPadding = windowDimensions.width > 700 ? 40 : 20

    return (
      <ScrollView scrollsToTop={true} automaticallyAdjustContentInsets={false}>
        <View style={{ paddingLeft: commonPadding, paddingRight: commonPadding }}>
          <Headline>{this.props.me.name}</Headline>
        </View>
      </ScrollView>
    )
  }
}

interface Styles {
  tabView: ViewStyle
}

export default Relay.createContainer(MyAccount, {
  fragments: {
    me: () => Relay.QL`
      fragment on Me {
        name
      }
    `,
  },
})

interface RelayProps {
  me: {
    name: string | null
  }
}
