import React from "react"
import { ViewProperties } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import { createFragmentContainer, graphql } from "react-relay"

import { RegistrationFlow_me } from "__generated__/RegistrationFlow_me.graphql"
import { RegistrationFlow_sale } from "__generated__/RegistrationFlow_sale.graphql"
import { TimeOffsetProvider } from "../Components/Bidding/Context/TimeOffsetProvider"
import { RegistrationScreen } from "../Components/Bidding/Screens/Registration"

interface RegistrationFlowProps extends ViewProperties {
  sale: RegistrationFlow_sale
  me: RegistrationFlow_me
}

class RegistrationFlow extends React.Component<RegistrationFlowProps> {
  render() {
    return (
      <TimeOffsetProvider>
        <NavigatorIOS
          navigationBarHidden={true}
          initialRoute={{
            component: RegistrationScreen,
            title: "", // title is required, though we don't use it because our navigation bar is hidden.
            passProps: this.props,
          }}
          style={{ flex: 1 }}
        />
      </TimeOffsetProvider>
    )
  }
}

export default createFragmentContainer(RegistrationFlow, {
  sale: graphql`
    fragment RegistrationFlow_sale on Sale {
      ...Registration_sale
    }
  `,
  me: graphql`
    fragment RegistrationFlow_me on Me {
      ...Registration_me
    }
  `,
})
