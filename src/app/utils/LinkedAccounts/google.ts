import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { google_LinkAccountMutation } from "__generated__/google_LinkAccountMutation.graphql"
import { google_UnlinkAccountMutation } from "__generated__/google_UnlinkAccountMutation.graphql"
import { Toast } from "lib/Components/Toast/Toast"
import { useEffect, useRef, useState } from "react"
import { Alert } from "react-native"
import { commitMutation, graphql } from "relay-runtime"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"

export const useGoogleLink = (relayEnvironment: RelayModernEnvironment) => {
  const [loading, setIsLoading] = useState(false)
  const isMountedRef = useRef(false)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const setLoading = (state: boolean) => {
    if (isMountedRef.current) {
      setIsLoading(state)
    }
  }

  const linkUsingOauthToken = (oauthToken: string) => {
    setLoading(true)
    commitMutation<google_LinkAccountMutation>(relayEnvironment, {
      mutation: graphql`
        mutation google_LinkAccountMutation(
          $provider: AuthenticationProvider!
          $oauthToken: String!
        ) {
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
        Toast.show("Account has been successfully linked.", "top")
      },
      onError: () => {
        setLoading(false)
        Toast.show("Error: Failed to link account.", "top")
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
        Toast.show("Account has been successfully unlinked.", "top")
      },
      onError: () => {
        setLoading(false)
        Toast.show("Error: Failed to unlink account.", "top")
      },
    })
  }

  return { linkUsingOauthToken, link, unlink, isLoading: loading }
}
