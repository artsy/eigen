import React from "react"
import { NavigatorIOS, ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import { RegistrationFlow_sale } from "__generated__/RegistrationFlow_sale.graphql"
import { RegistrationScreen } from "../Components/Bidding/Screens/Registration"

interface RegistrationFlowProps extends ViewProperties {
  sale: RegistrationFlow_sale
  // me: RegistrationFlow_me
}

class RegistrationFlow extends React.Component<RegistrationFlowProps> {
  render() {
    return (
      <NavigatorIOS
        navigationBarHidden={true}
        initialRoute={{
          component: RegistrationScreen,
          title: "", // title is required, though we don't use it because our navigation bar is hidden.
          passProps: this.props,
        }}
        style={{ flex: 1 }}
      />
    )
  }
}

// TODO: UPDATE ME
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
