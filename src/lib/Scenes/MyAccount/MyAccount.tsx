import { MyAccount_me } from "__generated__/MyAccount_me.graphql"
import { MyAccountQuery } from "__generated__/MyAccountQuery.graphql"
import { MenuItem } from "lib/Components/MenuItem"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { useAppleLink } from "lib/utils/LinkedAccounts/apple"
import { useFacebookLink } from "lib/utils/LinkedAccounts/facebook"
import { useGoogleLink } from "lib/utils/LinkedAccounts/google"
import { PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { times } from "lodash"
import { FacebookIcon, Flex, Separator, Text } from "palette"
import React from "react"
import { ActivityIndicator, Image, Platform, ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer, RelayProp } from "react-relay"

const MyAccount: React.FC<{ me: MyAccount_me; relay: RelayProp }> = ({ me, relay }) => {
  const showLinkedAccounts = useFeatureFlag("ARShowLinkedAccounts")
  const showLinkGoogle = useFeatureFlag("ARGoogleAuth")
  const showLinkApple = Platform.OS === "ios"

  const { link: linkFB, unlink: unlinkFB, isLoading: fbLoading } = useFacebookLink(relay.environment)
  const { link: linkGoogle, unlink: unlinkGoogle, isLoading: googleLoading } = useGoogleLink(relay.environment)
  const { link: linkApple, unlink: unlinkApple, isLoading: appleLoading } = useAppleLink(relay.environment)

  const facebookLinked = me.authentications.map((a) => a.provider).includes("FACEBOOK")
  const googleLinked = me.authentications.map((a) => a.provider).includes("GOOGLE")
  const appleLinked = me.authentications.map((a) => a.provider).includes("APPLE")

  return (
    <PageWithSimpleHeader title="Account">
      <ScrollView contentContainerStyle={{ paddingTop: 10 }}>
        <MenuItem title="Full Name" value={me.name} onPress={() => navigate("my-account/edit-name")} />
        <MenuItem
          title="Email"
          value={me.email}
          ellipsizeMode="middle"
          onPress={() => {
            navigate("my-account/edit-email")
          }}
        />
        <MenuItem title="Phone" value={me.phone || "Add phone"} onPress={() => navigate("my-account/edit-phone")} />
        {!!me.hasPassword && (
          <MenuItem title="Password" value="Change password" onPress={() => navigate("my-account/edit-password")} />
        )}
        {!!me.paddleNumber && <MenuItem title="Paddle Number" value={me.paddleNumber} />}
        {!!showLinkedAccounts && (
          <>
            <Separator />
            <MenuItem title="Linked Accounts" />
            <MenuItem
              title="Facebook"
              rightView={
                fbLoading ? (
                  <ActivityIndicator size="small" color="#000000" />
                ) : (
                  <Flex flexDirection="row" alignItems="center">
                    <Image source={require(`@images/facebook.webp`)} resizeMode="contain" style={{ marginRight: 10 }} />
                    <Text variant="md" color="black60" lineHeight={18}>
                      {facebookLinked ? "Disconnect" : "Connect"}
                    </Text>
                  </Flex>
                )
              }
              onPress={fbLoading ? () => null : () => (facebookLinked ? unlinkFB() : linkFB())}
            />
            {!!showLinkGoogle && (
              <MenuItem
                title="Google"
                rightView={
                  googleLoading ? (
                    <ActivityIndicator size="small" color="#000000" />
                  ) : (
                    <Flex flexDirection="row" alignItems="center">
                      <Image source={require(`@images/google.webp`)} resizeMode="contain" style={{ marginRight: 10 }} />
                      <Text variant="md" color="black60" lineHeight={18}>
                        {googleLinked ? "Disconnect" : "Connect"}
                      </Text>
                    </Flex>
                  )
                }
                onPress={googleLoading ? () => null : () => (googleLinked ? unlinkGoogle() : linkGoogle())}
              />
            )}
            {!!showLinkApple && (
              <MenuItem
                title="Apple"
                rightView={
                  appleLoading ? (
                    <ActivityIndicator size="small" />
                  ) : (
                    <Flex flexDirection="row" alignItems="center">
                      <Image source={require(`@images/apple.webp`)} resizeMode="contain" style={{ marginRight: 10 }} />
                      <Text variant="md" color="black60" lineHeight={18}>
                        {appleLinked ? "Disconnect" : "Connect"}
                      </Text>
                    </Flex>
                  )
                }
                onPress={appleLoading ? () => null : () => (appleLinked ? unlinkApple() : linkApple())}
              />
            )}
          </>
        )}
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

export const MyAccountContainer = createFragmentContainer(MyAccount, {
  me: graphql`
    fragment MyAccount_me on Me {
      name
      email
      phone
      paddleNumber
      hasPassword
      authentications {
        provider
      }
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
