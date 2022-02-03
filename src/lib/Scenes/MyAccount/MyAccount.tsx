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
import { Flex, Separator, Text, useColor } from "palette"
import React from "react"
import { ActivityIndicator, Alert, Image, Platform, ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer, RelayProp } from "react-relay"
import { SectionHeading } from "../MyProfile/MyProfileSettings"

const MyAccount: React.FC<{ me: MyAccount_me; relay: RelayProp }> = ({ me, relay }) => {
  const showLinkedAccounts = useFeatureFlag("ARShowLinkedAccounts") && !me.secondFactors?.length
  const showLinkGoogle = useFeatureFlag("ARGoogleAuth")
  const showLinkApple = Platform.OS === "ios"

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

  const blackColor = useColor()("black100")

  const hasOnlyOneAuth = me.authentications.length + (me.hasPassword ? 1 : 0) < 2

  const linkOrUnlink = (provider: "facebook" | "google" | "apple") => {
    if (hasOnlyOneAuth) {
      Alert.alert("Error", "You cannot unlink your only authentication method.")
      return
    }
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
          <>
            <Separator mt={2} mb={2} />
            <SectionHeading title="LINKED ACCOUNTS" />
            <MenuItem
              title="Facebook"
              rightView={
                fbLoading ? (
                  <ActivityIndicator size="small" color={blackColor} />
                ) : (
                  <Flex flexDirection="row" alignItems="center">
                    <Image
                      source={require(`@images/facebook.webp`)}
                      resizeMode="contain"
                      style={{ marginRight: 10 }}
                    />
                    <Text variant="md" color="black60" lineHeight={18}>
                      {facebookLinked ? "Disconnect" : "Connect"}
                    </Text>
                  </Flex>
                )
              }
              onPress={fbLoading ? () => null : () => linkOrUnlink("facebook")}
            />
            {!!showLinkGoogle && (
              <MenuItem
                title="Google"
                rightView={
                  googleLoading ? (
                    <ActivityIndicator size="small" color={blackColor} />
                  ) : (
                    <Flex flexDirection="row" alignItems="center">
                      <Image
                        source={require(`@images/google.webp`)}
                        resizeMode="contain"
                        style={{ marginRight: 10 }}
                      />
                      <Text variant="md" color="black60" lineHeight={18}>
                        {googleLinked ? "Disconnect" : "Connect"}
                      </Text>
                    </Flex>
                  )
                }
                onPress={googleLoading ? () => null : () => linkOrUnlink("google")}
              />
            )}
            {!!showLinkApple && (
              <MenuItem
                title="Apple"
                rightView={
                  appleLoading ? (
                    <ActivityIndicator size="small" color={blackColor} />
                  ) : (
                    <Flex flexDirection="row" alignItems="center">
                      <Image
                        source={require(`@images/apple.webp`)}
                        resizeMode="contain"
                        style={{ marginRight: 10, tintColor: blackColor }}
                      />
                      <Text variant="md" color="black60" lineHeight={18}>
                        {appleLinked ? "Disconnect" : "Connect"}
                      </Text>
                    </Flex>
                  )
                }
                onPress={appleLoading ? () => null : () => linkOrUnlink("apple")}
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
