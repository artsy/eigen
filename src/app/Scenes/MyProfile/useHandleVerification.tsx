import { captureException } from "@sentry/react-native"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { verifyEmail } from "app/utils/verifyEmail"
import { verifyID } from "app/utils/verifyID"
import { useCallback, useState } from "react"

type verificationType = "ID" | "Email"

const IDVerificationBlockingStates = ["passed", "failed", "watchlist_hit"]

export const useHandleEmailVerification = () => {
  return useHandleVerification("Email")
}

export const useHandleIDVerification = () => {
  return useHandleVerification("ID")
}

const VERIFICATION_BANNER_TIMEOUT = 6000

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
      }, VERIFICATION_BANNER_TIMEOUT)
    }
  }, [])

  return { showVerificationBanner, handleVerification }
}

const verify = async (type: verificationType) => {
  if (type === "Email") {
    const { sendConfirmationEmail } = await verifyEmail(defaultEnvironment)

    const confirmationOrError = sendConfirmationEmail?.confirmationOrError
    return confirmationOrError?.unconfirmedEmail
  } else {
    const { sendIdentityVerificationEmail } = await verifyID(defaultEnvironment)

    const confirmationOrError = sendIdentityVerificationEmail?.confirmationOrError
    return confirmationOrError?.identityVerificationEmail?.state
  }
}
