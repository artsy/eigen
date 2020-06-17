import { ChevronIcon, color, Flex, Join, Sans, Separator } from "@artsy/palette"
import { MyAccount_me } from "__generated__/MyAccount_me.graphql"
import { MyAccountQuery } from "__generated__/MyAccountQuery.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { times } from "lodash"
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
        <>
          <Row
            title="Full Name"
            value={me.name}
            onPress={() => {
              SwitchBoard.presentNavigationViewController(navRef.current!, "my-account/edit-name")
            }}
          />
          <Row
            title="Email"
            value={me.email}
            onPress={() => {
              // Navigate to Change Email Screen
            }}
          />
          <Row
            title="Phone"
            value={me.phone || "Add phone"}
            onPress={() => {
              // Navigate to Change Phone Number Screen
            }}
          />
          <Row
            title="Password"
            value="Change password"
            onPress={() => {
              // Navigate to Change Password Screen
            }}
          />
          <Row
            title="Paddle Number"
            value={me.paddleNumber}
            hideChevron
            onPress={() => {
              // Navigate to Change Paddle Number Screen
            }}
          />
        </>
      </Join>
    </Flex>
  )
}

const MyAccountPlaceholder: React.FC<{}> = ({}) => {
  return (
    <Flex pt="2">
      <Join separator={<Separator my={2} />}>
        <Sans size="4" weight="medium" textAlign="center">
          Account
        </Sans>
        <Flex px={2} py={1}>
          {times(5).map((index: number) => (
            <Flex key={index} py={1}>
              <PlaceholderText width={100 + Math.random() * 100} />
            </Flex>
          ))}
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
      phone
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
        renderPlaceholder: () => <MyAccountPlaceholder />,
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
      <Flex flexShrink={1} pl="1" flexDirection="row" justifyContent="flex-end" alignItems="center">
        <Sans size="4" px="1" color="black60" numberOfLines={1}>
          {value}
        </Sans>
        {!hideChevron && <ChevronIcon direction="right" fill="black60" />}
      </Flex>
    </Flex>
  </TouchableHighlight>
)
