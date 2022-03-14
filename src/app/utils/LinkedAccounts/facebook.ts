import { facebook_LinkAccountMutation } from "__generated__/facebook_LinkAccountMutation.graphql"
import { facebook_UnlinkAccountMutation } from "__generated__/facebook_UnlinkAccountMutation.graphql"
import { Toast } from "app/Components/Toast/Toast"
import { useEffect, useRef, useState } from "react"
import { Alert } from "react-native"
import { AccessToken, LoginManager } from "react-native-fbsdk-next"
import { commitMutation, graphql } from "relay-runtime"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"

export const useFacebookLink = (relayEnvironment: RelayModernEnvironment) => {
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
    commitMutation<facebook_LinkAccountMutation>(relayEnvironment, {
      mutation: graphql`
        mutation facebook_LinkAccountMutation(
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
      variables: { provider: "FACEBOOK", oauthToken },
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
    try {
      const { declinedPermissions, isCancelled } = await LoginManager.logInWithPermissions([
        "email",
        "public_profile",
      ])

      if (isCancelled) {
        Toast.show("Error: Linking cancelled.", "top")
        setLoading(false)
        return
      }

      if (declinedPermissions?.includes("email")) {
        Alert.alert("Error", "Please allow the use of email to continue.")
        setLoading(false)
        return
      }

      const fbAccessToken = !isCancelled && (await AccessToken.getCurrentAccessToken())
      if (!fbAccessToken) {
        Toast.show("Error: Failed to retrieve access token.", "top")
        setLoading(false)
        return
      }
      linkUsingOauthToken(fbAccessToken.accessToken)
    } catch (error) {
      // Every other error
      setLoading(false)
      Toast.show(`Error: Failed to link accounts.`, "top")
    }
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
