import { Flex } from "@artsy/palette"
import { MyAccount_me } from "__generated__/MyAccount_me.graphql"
import { MyAccountQuery } from "__generated__/MyAccountQuery.graphql"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { times } from "lodash"
import React, { useRef } from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { MyProfileMenuItem } from "../MyProfile/Components/MyProfileMenuItem"

const MyAccount: React.FC<{ me: MyAccount_me }> = ({ me }) => {
  const navRef = useRef(null)
  return (
    <PageWithSimpleHeader title="Account">
      <ScrollView ref={navRef} contentContainerStyle={{ paddingTop: 10 }}>
        <MyProfileMenuItem
          title="Full Name"
          value={me.name}
          onPress={() => {
            SwitchBoard.presentNavigationViewController(navRef.current!, "my-account/edit-name")
          }}
        />
        <MyProfileMenuItem
          title="Email"
          value={me.email}
          onPress={() => {
            SwitchBoard.presentNavigationViewController(navRef.current!, "my-account/edit-email")
          }}
        />
        <MyProfileMenuItem
          title="Phone"
          value={me.phone || "Add phone"}
          onPress={() => {
            SwitchBoard.presentNavigationViewController(navRef.current!, "my-account/edit-phone")
          }}
        />
        {!!me.hasPassword && (
          <MyProfileMenuItem
            title="Password"
            value="Change password"
            onPress={() => {
              SwitchBoard.presentNavigationViewController(navRef.current!, "my-account/edit-password")
            }}
          />
        )}
        {!!me.paddleNumber && <MyProfileMenuItem title="Paddle Number" value={me.paddleNumber} />}
      </ScrollView>
    </PageWithSimpleHeader>
  )
}

const MyAccountPlaceholder: React.FC<{}> = ({}) => {
  return (
    <PageWithSimpleHeader title="Account">
      <Flex px={2} py={1}>
        {times(5).map((index: number) => (
          <Flex key={index} py={7.5}>
            <PlaceholderText width={100 + Math.random() * 100} />
          </Flex>
        ))}
      </Flex>
    </PageWithSimpleHeader>
  )
}

const MyAccountContainer = createFragmentContainer(MyAccount, {
  me: graphql`
    fragment MyAccount_me on Me {
      name
      email
      phone
      paddleNumber
      hasPassword
    }
  `,
})

export const MyAccountQueryRenderer: React.FC<{}> = () => {
  return (
    <QueryRenderer<MyAccountQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MyAccountQuery {
          me {
            ...MyAccount_me
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: MyAccountContainer,
        renderPlaceholder: () => <MyAccountPlaceholder />,
      })}
      variables={{}}
    />
  )
}
