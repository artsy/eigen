import { facebook_LinkAccountMutation } from "__generated__/facebook_LinkAccountMutation.graphql"
import { facebook_UnlinkAccountMutation } from "__generated__/facebook_UnlinkAccountMutation.graphql"
import { useState } from "react"
import { Alert } from "react-native"
import { AccessToken, LoginManager } from "react-native-fbsdk-next"
import { commitMutation, graphql } from "relay-runtime"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { provideFeedback } from "./linkUtils"

export const useFacebookLink = (relayEnvironment: RelayModernEnvironment) => {
  const [loading, setLoading] = useState(false)

  const linkUsingOauthToken = (oauthToken: string) => {
    setLoading(true)
    commitMutation<facebook_LinkAccountMutation>(relayEnvironment, {
      mutation: graphql`
        mutation facebook_LinkAccountMutation($provider: AuthenticationProvider!, $oauthToken: String!) {
          linkAuthentication(input: { provider: $provider, oauthToken: $oauthToken }) {
            me {
              ...MyAccount_me
            }
          }
        }
      `,
      variables: { provider: "FACEBOOK", oauthToken },
      onCompleted: () => {
        setLoading(false)
        provideFeedback({ success: true }, "Facebook", "link")
      },
      onError: (err) => {
        setLoading(false)
        const error = err.message
        provideFeedback({ success: false, error }, "Facebook", "link")
      },
    })
  }

  const link = async () => {
    setLoading(true)
    const { declinedPermissions, isCancelled } = await LoginManager.logInWithPermissions(["email", "public_profile"])

    if (declinedPermissions?.includes("email")) {
      Alert.alert("Error", "Please allow the use of email to continue.")
      setLoading(false)
      return
    }

    const fbAccessToken = !isCancelled && (await AccessToken.getCurrentAccessToken())
    if (!fbAccessToken) {
      Alert.alert("Error", "Failed to retrieve access token.")
      setLoading(false)
      return
    }
    linkUsingOauthToken(fbAccessToken.accessToken)
  }

  const unlink = () => {
    setLoading(true)
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
      onCompleted: () => {
        setLoading(false)
        provideFeedback({ success: true }, "Facebook", "unlink")
      },
      onError: (err) => {
        setLoading(false)
        const error = err.message
        provideFeedback({ success: false, error }, "Facebook", "unlink")
      },
    })
  }

  return { linkUsingOauthToken, link, unlink, isLoading: loading }
}
