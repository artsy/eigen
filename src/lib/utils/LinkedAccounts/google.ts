import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { google_LinkAccountMutation } from "__generated__/google_LinkAccountMutation.graphql"
import { google_UnlinkAccountMutation } from "__generated__/google_UnlinkAccountMutation.graphql"
import { useState } from "react"
import { Alert } from "react-native"
import { commitMutation, graphql } from "relay-runtime"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"
import { provideFeedback } from "./linkUtils"

export const useGoogleLink = (relayEnvironment: RelayModernEnvironment) => {
  const [loading, setLoading] = useState(false)

  const linkUsingOauthToken = (oauthToken: string) => {
    setLoading(true)
    commitMutation<google_LinkAccountMutation>(relayEnvironment, {
      mutation: graphql`
        mutation google_LinkAccountMutation($provider: AuthenticationProvider!, $oauthToken: String!) {
          linkAuthentication(input: { provider: $provider, oauthToken: $oauthToken }) {
            me {
              ...MyAccount_me
            }
          }
        }
      `,
      variables: { provider: "GOOGLE", oauthToken },
      onCompleted: () => {
        setLoading(false)
        provideFeedback({ success: true }, "Google", "link")
      },
      onError: (err) => {
        setLoading(false)
        const error = err.message
        provideFeedback({ success: false, error }, "Google", "link")
      },
    })
  }

  const link = async () => {
    setLoading(true)
    if (!(await GoogleSignin.hasPlayServices())) {
      Alert.alert("Error", "Play services are not available.")
      setLoading(false)
      return
    }
    await GoogleSignin.signIn()
    const accessToken = (await GoogleSignin.getTokens()).accessToken

    linkUsingOauthToken(accessToken)
  }

  const unlink = () => {
    setLoading(true)
    commitMutation<google_UnlinkAccountMutation>(relayEnvironment, {
      mutation: graphql`
        mutation google_UnlinkAccountMutation($provider: AuthenticationProvider!) {
          unlinkAuthentication(input: { provider: $provider }) {
            me {
              ...MyAccount_me
            }
          }
        }
      `,
      variables: { provider: "GOOGLE" },
      onCompleted: () => {
        setLoading(false)
        provideFeedback({ success: true }, "Google", "unlink")
      },
      onError: (err) => {
        setLoading(false)
        const error = err.message
        provideFeedback({ success: true, error }, "Google", "unlink")
      },
    })
  }

  return { linkUsingOauthToken, link, unlink, isLoading: loading }
}
