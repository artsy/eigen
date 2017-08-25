import * as React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { Dimensions, ScrollView, View, ViewProperties, ViewStyle } from "react-native"

import Headline from "../Components/Text/Headline"

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
          <Headline>
            {this.props.me.name}
          </Headline>
        </View>
      </ScrollView>
    )
  }
}

interface Styles {
  tabView: ViewStyle
}

export default createFragmentContainer(
  MyAccount,
  graphql`
    fragment MyAccount_me on Me {
      name
    }
  `
)

interface RelayProps {
  me: {
    name: string | null
  }
}
