import { MyAccount_me } from "__generated__/MyAccount_me.graphql"
import { MyAccountQuery } from "__generated__/MyAccountQuery.graphql"
import { MenuItem } from "lib/Components/MenuItem"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { times } from "lodash"
import { Flex } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

const MyAccount: React.FC<{ me: MyAccount_me }> = ({ me }) => {
  return (
    <PageWithSimpleHeader title="Account">
      <ScrollView contentContainerStyle={{ paddingTop: 10 }}>
        <MenuItem
          title="Full Name"
          value={me.name}
          onPress={() => {
            navigate("my-account/edit-name")
          }}
        />
        <MenuItem
          title="Email"
          value={me.email}
          ellipsizeMode="middle"
          onPress={() => {
            navigate("my-account/edit-email")
          }}
        />
        <MenuItem
          title="Phone"
          value={me.phone || "Add phone"}
          onPress={() => {
            navigate("my-account/edit-phone")
          }}
        />
        {!!me.hasPassword && (
          <MenuItem
            title="Password"
            value="Change password"
            onPress={() => {
              navigate("my-account/edit-password")
            }}
          />
        )}
        {!!me.paddleNumber && <MenuItem title="Paddle Number" value={me.paddleNumber} />}
      </ScrollView>
    </PageWithSimpleHeader>
  )
}

const MyAccountPlaceholder: React.FC = () => {
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

export const MyAccountContainer = createFragmentContainer(MyAccount, {
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

export const MyAccountQueryRenderer: React.FC = () => {
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
