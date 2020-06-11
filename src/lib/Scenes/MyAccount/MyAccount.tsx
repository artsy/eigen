import { ChevronIcon, color, Flex, Join, Sans, Separator, Spinner } from "@artsy/palette"
import { MyAccount_me } from "__generated__/MyAccount_me.graphql"
import { MyAccountQuery } from "__generated__/MyAccountQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import React, { useRef } from "react"
import { TouchableHighlight } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

const MyAccount: React.FC<{ me: MyAccount_me }> = ({ me }) => {
  const navRef = useRef(null)

  return (
    <Flex pt="2" ref={navRef}>
      <Join separator={<Separator my={2} />}>
        <Sans size="4" weight="medium" textAlign="center">
          Account
        </Sans>

        <Flex>
          <Row
            title="Full Name"
            value={me.name}
            onPress={() => {
              // Navigate to Change Full Name Screen
            }}
          />
          <Row
            title="Email"
            value={me.email}
            onPress={() => {
              // Navigate to Change Full Name Screen
            }}
          />
          {/* TODO: Check this out again once #2463 gets merged to metaphysics
            <Row
              title="Phone"
              value={me.phone || "Add phone"}
              onPress={() => {
                // Navigate to Change Full Name Screen
              }}
            />
          */}
          <Row
            title="Password"
            value="Change password"
            onPress={() => {
              // Navigate to Change Full Name Screen
            }}
          />
          <Row
            title="Paddle Number"
            value={me.paddleNumber}
            hideChevron
            onPress={() => {
              // Navigate to Change Full Name Screen
            }}
          />
        </Flex>
      </Join>
    </Flex>
  )
}

const MyAccountContainer = createFragmentContainer(MyAccount, {
  me: graphql`
    fragment MyAccount_me on Me {
      name
      email
      # phone
      paddleNumber
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
        renderPlaceholder: () => (
          <Flex flex={1} alignItems="center" justifyContent="center">
            <Spinner size="medium" />
          </Flex>
        ),
      })}
      variables={{}}
    />
  )
}

const Row: React.FC<{ title: string; onPress?: () => void; hideChevron?: boolean; value: string | null }> = ({
  title,
  onPress,
  hideChevron,
  value,
}) => (
  <TouchableHighlight onPress={onPress} underlayColor={color("black5")}>
    <Flex flexDirection="row" justifyContent="space-between" alignItems="center" py="1" px="2">
      <Sans size="4">{title}</Sans>
      <Flex flexShrink={1} px="1" flexDirection="row" justifyContent="flex-end" alignItems="center">
        <Sans size="4" px="1" color="black60" numberOfLines={1}>
          {value}
        </Sans>
        {!hideChevron && <ChevronIcon direction="right" fill="black60" />}
      </Flex>
    </Flex>
  </TouchableHighlight>
)
