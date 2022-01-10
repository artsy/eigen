import { Alert } from "react-native"
import { AccessToken, LoginManager } from "react-native-fbsdk-next"
import { commitMutation, graphql } from "relay-runtime"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { facebook_LinkAccountMutation } from "__generated__/facebook_LinkAccountMutation.graphql"
import { facebook_UnlinkAccountMutation } from "__generated__/facebook_UnlinkAccountMutation.graphql"

export const useFacebookLink = (relayEnvironment: RelayModernEnvironment) => {
  const link = async () => {
    const { declinedPermissions, isCancelled } = await LoginManager.logInWithPermissions(["email", "public_profile"])

    if (declinedPermissions?.includes("email")) {
      Alert.alert("Please allow the use of email to continue.")
      return
    }

    const fbAccessToken = !isCancelled && (await AccessToken.getCurrentAccessToken())
    if (!fbAccessToken) {
      Alert.alert("Failed to retrieve access token.")
      return
    }

    await commitMutation<facebook_LinkAccountMutation>(relayEnvironment, {
      mutation: graphql`
        mutation facebook_LinkAccountMutation($provider: AuthenticationProvider!, $oauthToken: String!) {
          linkAuthentication(input: { provider: $provider, oauthToken: $oauthToken }) {
            me {
              ...MyAccount_me
            }
          }
        }
      `,
      variables: { provider: "FACEBOOK", oauthToken: fbAccessToken.accessToken },
    })
  }

  const unlink = () =>
    commitMutation<facebook_UnlinkAccountMutation>(relayEnvironment, {
      mutation: graphql`
        mutation facebook_UnlinkAccountMutation($provider: AuthenticationProvider!) {
          unlinkAuthentication(input: { provider: $provider }) {
            me {
              ...MyAccount_me
            }
          }
        }
      `,
      variables: { provider: "FACEBOOK" },
    })

  return { link, unlink }
}
