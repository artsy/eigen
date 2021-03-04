import NavigatorIOS from "lib/utils/__legacy_do_not_use__navigator-ios-shim"
import React from "react"
import { Platform, ViewProperties } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

import { RegistrationFlow_me } from "__generated__/RegistrationFlow_me.graphql"
import { RegistrationFlow_sale } from "__generated__/RegistrationFlow_sale.graphql"
import { RegistrationFlowQuery } from "__generated__/RegistrationFlowQuery.graphql"
import { ModalHeader } from "lib/Components/ModalHeader"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { TimeOffsetProvider } from "../Components/Bidding/Context/TimeOffsetProvider"
import { RegistrationScreen } from "../Components/Bidding/Screens/Registration"

interface RegistrationFlowProps extends ViewProperties {
  sale: RegistrationFlow_sale
  me: RegistrationFlow_me
}

const RegistrationFlow: React.FC<RegistrationFlowProps> = (props) => {
  return (
    <TimeOffsetProvider>
      <NavigatorIOS
        initialRoute={{
          component: RegistrationScreen,
          passProps: props,
        }}
      />
    </TimeOffsetProvider>
  )
}

export const RegistrationFlowFragmentContainer = createFragmentContainer(RegistrationFlow, {
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

export const RegistrationFlowQueryRenderer: React.FC<{ saleID: string }> = ({ saleID }) => {
  return (
    <>
      <QueryRenderer<RegistrationFlowQuery>
        environment={defaultEnvironment}
        query={graphql`
          query RegistrationFlowQuery($saleID: String!) {
            sale(id: $saleID) {
              name
              ...RegistrationFlow_sale
            }
            me {
              ...RegistrationFlow_me
            }
          }
        `}
        cacheConfig={{ force: true }} // We want to always fetch latest sale registration status, CC info, etc.
        variables={{
          saleID,
        }}
        render={renderWithLoadProgress(RegistrationFlowFragmentContainer)}
      />
      <ModalHeader />
    </>
  )
}
