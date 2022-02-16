import {
  appleAuth,
  AppleRequestResponseFullName,
} from "@invertase/react-native-apple-authentication"
import { apple_LinkAccountMutation } from "__generated__/apple_LinkAccountMutation.graphql"
import { apple_UnlinkAccountMutation } from "__generated__/apple_UnlinkAccountMutation.graphql"
import { Toast } from "lib/Components/Toast/Toast"
import { AppleToken } from "lib/Scenes/Onboarding/OnboardingSocialLink"
import { unsafe_getUserEmail } from "lib/store/GlobalStore"
import { useEffect, useRef, useState } from "react"
import { Alert } from "react-native"
import { commitMutation, graphql } from "relay-runtime"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"

export const useAppleLink = (relayEnvironment: RelayModernEnvironment) => {
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

  const linkUsingOauthToken = (email: string, name: string, token: AppleToken) => {
    const { appleUid, idToken } = token
    setLoading(true)
    commitMutation<apple_LinkAccountMutation>(relayEnvironment, {
      mutation: graphql`
        mutation apple_LinkAccountMutation(
          $provider: AuthenticationProvider!
          $appleUid: String!
          $idToken: String!
          $email: String!
          $name: String!
          $oauthToken: String!
        ) {
          linkAuthentication(
            input: {
              provider: $provider
              appleUid: $appleUid
              idToken: $idToken
              email: $email
              name: $name
              oauthToken: $oauthToken
            }
          ) {
            me {
              ...MyAccount_me
            }
          }
        }
      `,
      variables: { provider: "APPLE", oauthToken: "", appleUid, idToken, email, name },
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

    const userInfo = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    })

    const idToken = userInfo.identityToken
    if (!idToken) {
      Alert.alert("Error", "Failed to authenticate using apple sign in")
      setLoading(false)
      return
    }

    const currentUserEmail = unsafe_getUserEmail()

    // Because Apple Auth only ever returns user email and names once (i.e during the first login),
    // fallback to current user's email when Apple auth does not return email
    const email = userInfo.email ?? currentUserEmail

    if (!email) {
      Alert.alert("Error", "There is no email associated with your Apple account.")
      setLoading(false)
      return
    }
    const appleUid = userInfo.user

    const computeString = (str?: string | null) => (str ? str : "")

    const computeName = ({ givenName, familyName }: AppleRequestResponseFullName) =>
      (computeString(givenName) + " " + computeString(familyName)).trim()

    const name = userInfo?.fullName ? computeName(userInfo.fullName) : ""

    linkUsingOauthToken(email, name, { idToken, appleUid })
  }

  const unlink = () => {
    setLoading(true)
    commitMutation<apple_UnlinkAccountMutation>(relayEnvironment, {
      mutation: graphql`
        mutation apple_UnlinkAccountMutation($provider: AuthenticationProvider!) {
          unlinkAuthentication(input: { provider: $provider }) {
            me {
              ...MyAccount_me
            }
          }
        }
      `,
      variables: { provider: "APPLE" },
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
