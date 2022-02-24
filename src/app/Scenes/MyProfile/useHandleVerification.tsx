import { captureException } from "@sentry/react-native"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { verifyEmail } from "lib/utils/verifyEmail"
import { verifyID } from "lib/utils/verifyID"
import { useCallback, useState } from "react"

type verificationType = "ID" | "Email"

const IDVerificationBlockingStates = ["passed", "failed", "watchlist_hit"]

export const useHandleEmailVerification = () => {
  return useHandleVerification("Email")
}

export const useHandleIDVerification = () => {
  return useHandleVerification("ID")
}

const SENT_STATE_TIMEOUT = 6000

const useHandleVerification = (type: verificationType) => {
  const [showVerificationBanner, setShowVerificationBanner] = useState(false)

  const handleVerification = useCallback(async () => {
    try {
      const response = await verify(type)

      // if response as state from ID verification
      const IDVerificationState = !(response && IDVerificationBlockingStates.includes(response))

      if (type === "Email" || IDVerificationState) {
        setShowVerificationBanner(true)
      }
    } catch (error) {
      captureException(error)
      setShowVerificationBanner(false)
    } finally {
      // Allow the user some time to read the message
      setTimeout(() => {
        setShowVerificationBanner(false)
      }, SENT_STATE_TIMEOUT)
    }
  }, [])

  return { showVerificationBanner, handleVerification }
}

const verify = async (type: verificationType) => {
  if (type === "Email") {
    const { sendConfirmationEmail } = await verifyEmail(defaultEnvironment)

    const confirmationOrError = sendConfirmationEmail?.confirmationOrError
    const emailToConfirm = confirmationOrError?.unconfirmedEmail
    return emailToConfirm
  } else {
    const { sendIdentityVerificationEmail } = await verifyID(defaultEnvironment)

    const confirmationOrError = sendIdentityVerificationEmail?.confirmationOrError
    const state = confirmationOrError?.identityVerificationEmail?.state
    return state
  }
}
