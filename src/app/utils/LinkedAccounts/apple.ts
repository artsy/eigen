import {
  appleAuth,
  AppleRequestResponseFullName,
} from "@invertase/react-native-apple-authentication"
import { apple_LinkAccountMutation } from "__generated__/apple_LinkAccountMutation.graphql"
import { apple_UnlinkAccountMutation } from "__generated__/apple_UnlinkAccountMutation.graphql"
import { Toast } from "app/Components/Toast/Toast"
import { AppleToken } from "app/Scenes/Onboarding/Screens/OnboardingSocialLink"
import { unsafe_getUserEmail } from "app/store/GlobalStore"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { useEffect, useRef, useState } from "react"
import { commitMutation, graphql } from "react-relay"

export const useAppleLink = () => {
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
    commitMutation<apple_LinkAccountMutation>(getRelayEnvironment(), {
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

    try {
      const userInfo = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      })

      const idToken = userInfo.identityToken
      if (!idToken) {
        Toast.show("Error: Failed to authenticate using apple sign in.", "top")
        setLoading(false)
        return
      }

      const currentUserEmail = unsafe_getUserEmail()

      // Because Apple Auth only ever returns user email and names once (i.e during the first login),
      // fallback to current user's email when Apple auth does not return email
      const email = userInfo.email ?? currentUserEmail

      if (!email) {
        Toast.show("Error: There is no email associated with your Apple account.", "top")
        setLoading(false)
        return
      }
      const appleUid = userInfo.user

      const computeString = (str?: string | null) => (str ? str : "")

      const computeName = ({ givenName, familyName }: AppleRequestResponseFullName) =>
        (computeString(givenName) + " " + computeString(familyName)).trim()

      const name = userInfo?.fullName ? computeName(userInfo.fullName) : ""

      linkUsingOauthToken(email, name, { idToken, appleUid })
    } catch (error) {
      setLoading(false)
      // Note: ErrorCodes for apple auth might be different on android. Verify when implementing on android
      const err = error as any
      if (err?.code === appleAuth.Error.CANCELED) {
        Toast.show("Error: Linking cancelled.", "top")
      } else {
        Toast.show(`Error: Failed to link accounts.`, "top")
      }
    }
  }

  const unlink = () => {
    setLoading(true)
    commitMutation<apple_UnlinkAccountMutation>(getRelayEnvironment(), {
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
