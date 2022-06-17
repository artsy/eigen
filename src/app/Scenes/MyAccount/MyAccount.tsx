import { MyAccount_me$data } from "__generated__/MyAccount_me.graphql"
import { MyAccountQuery } from "__generated__/MyAccountQuery.graphql"
import { MenuItem } from "app/Components/MenuItem"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { useFeatureFlag } from "app/store/GlobalStore"
import { useAppleLink } from "app/utils/LinkedAccounts/apple"
import { useFacebookLink } from "app/utils/LinkedAccounts/facebook"
import { useGoogleLink } from "app/utils/LinkedAccounts/google"
import { PlaceholderText } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { times } from "lodash"
import { Box, Button, Flex, Spacer, Text } from "palette"
import React from "react"
import { ActivityIndicator, Image, Platform, ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer, RelayProp } from "react-relay"

const MyAccount: React.FC<{ me: MyAccount_me$data; relay: RelayProp }> = ({ me, relay }) => {
  const hasOnlyOneAuth = me.authentications.length + (me.hasPassword ? 1 : 0) < 2

  const onlyExistingAuthFor = (provider: "FACEBOOK" | "GOOGLE" | "APPLE") => {
    return (
      hasOnlyOneAuth && me.authentications.length > 0 && me.authentications[0].provider === provider
    )
  }

  const showLinkGoogle = useFeatureFlag("ARGoogleAuth")
  const showLinkApple = Platform.OS === "ios"

  const showLinkedAccounts = !me.secondFactors?.length

  const {
    link: linkFB,
    unlink: unlinkFB,
    isLoading: fbLoading,
  } = useFacebookLink(relay.environment)
  const {
    link: linkGoogle,
    unlink: unlinkGoogle,
    isLoading: googleLoading,
  } = useGoogleLink(relay.environment)
  const {
    link: linkApple,
    unlink: unlinkApple,
    isLoading: appleLoading,
  } = useAppleLink(relay.environment)

  const facebookLinked = me.authentications.map((a) => a.provider).includes("FACEBOOK")
  const googleLinked = me.authentications.map((a) => a.provider).includes("GOOGLE")
  const appleLinked = me.authentications.map((a) => a.provider).includes("APPLE")

  const linkOrUnlink = (provider: "facebook" | "google" | "apple") => {
    switch (provider) {
      case "apple":
        return appleLinked ? unlinkApple() : linkApple()
      case "facebook":
        return facebookLinked ? unlinkFB() : linkFB()
      case "google":
        return googleLinked ? unlinkGoogle() : linkGoogle()
      default:
        return
    }
  }

  const loading = fbLoading || googleLoading || appleLoading

  return (
    <PageWithSimpleHeader title="Account">
      <ScrollView contentContainerStyle={{ paddingTop: 10 }}>
        <MenuItem
          title="Full Name"
          value={me.name}
          onPress={() => navigate("my-account/edit-name")}
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
          onPress={() => navigate("my-account/edit-phone")}
        />
        {!!me.hasPassword && (
          <MenuItem
            title="Password"
            value="Change password"
            onPress={() => navigate("my-account/edit-password")}
          />
        )}
        {!!me.paddleNumber && <MenuItem title="Paddle Number" value={me.paddleNumber} />}
        {!!showLinkedAccounts && (
          <Flex mt={3}>
            <Box mx={2}>
              <SectionTitle title="LINKED ACCOUNTS" />
            </Box>

            <MenuItem
              title="Facebook"
              disabled={loading || onlyExistingAuthFor("FACEBOOK")}
              allowDisabledVisualClue
              rightView={
                fbLoading ? (
                  <ActivityIndicator size="small" color="black" />
                ) : (
                  <Flex flexDirection="row" alignItems="center">
                    <Image
                      source={require(`images/facebook.webp`)}
                      resizeMode="contain"
                      style={{ marginRight: 10 }}
                    />
                    <Text variant="md" color="black60" lineHeight={18}>
                      {facebookLinked ? "Unlink" : "Link"}
                    </Text>
                  </Flex>
                )
              }
              onPress={
                fbLoading || onlyExistingAuthFor("FACEBOOK")
                  ? () => null
                  : () => linkOrUnlink("facebook")
              }
            />

            {!!showLinkGoogle && (
              <MenuItem
                title="Google"
                disabled={loading || onlyExistingAuthFor("GOOGLE")}
                allowDisabledVisualClue
                rightView={
                  googleLoading ? (
                    <ActivityIndicator size="small" color="black" />
                  ) : (
                    <Flex flexDirection="row" alignItems="center">
                      <Image
                        source={require(`images/google.webp`)}
                        resizeMode="contain"
                        style={{ marginRight: 10 }}
                      />
                      <Text variant="md" color="black60" lineHeight={18}>
                        {googleLinked ? "Unlink" : "Link"}
                      </Text>
                    </Flex>
                  )
                }
                onPress={
                  googleLoading || onlyExistingAuthFor("GOOGLE")
                    ? () => null
                    : () => linkOrUnlink("google")
                }
              />
            )}
            {!!showLinkApple && (
              <MenuItem
                title="Apple"
                disabled={loading || onlyExistingAuthFor("APPLE")}
                allowDisabledVisualClue
                rightView={
                  appleLoading ? (
                    <ActivityIndicator size="small" color="black" />
                  ) : (
                    <Flex flexDirection="row" alignItems="center">
                      <Image
                        source={require(`images/apple.webp`)}
                        resizeMode="contain"
                        style={{ marginRight: 10, tintColor: "black" }}
                      />
                      <Text variant="md" color="black60" lineHeight={18}>
                        {appleLinked ? "Unlink" : "Link"}
                      </Text>
                    </Flex>
                  )
                }
                onPress={
                  appleLoading || onlyExistingAuthFor("APPLE")
                    ? () => null
                    : () => linkOrUnlink("apple")
                }
              />
            )}
          </Flex>
        )}
        <Spacer mt={2} />
        <Button variant="text" block onPress={() => navigate("my-account/delete-account")}>
          <Text color="red100">Delete My Account</Text>
        </Button>
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
      authentications {
        provider
      }
      secondFactors(kinds: [sms, app, backup]) {
        kind
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
