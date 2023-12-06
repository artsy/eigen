import { captureMessage } from "@sentry/react-native"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { verifyEmail } from "app/utils/verifyEmail"
import { verifyID } from "app/utils/verifyID"
import { useCallback, useState } from "react"

const VERIFICATION_BANNER_TIMEOUT = 6000
const ID_VERIFICATION_BLOCKING_STATES = ["passed", "failed", "watchlist_hit"]

export const useHandleEmailVerification = () => {
  const [showVerificationBanner, setShowVerificationBanner] = useState(false)

  const handleVerification = useCallback(async () => {
    try {
      await verifyEmail(getRelayEnvironment())

      setShowVerificationBanner(true)
    } catch (error) {
      captureMessage(`useHandleEmailVerification ${JSON.stringify(error)}`)
    } finally {
      // Allow the user some time to read the message
      setTimeout(() => {
        setShowVerificationBanner(false)
      }, VERIFICATION_BANNER_TIMEOUT)
    }
  }, [])

  return { showVerificationBanner, handleVerification }
}

export const useHandleIDVerification = (initiatorID: string) => {
  const [showVerificationBanner, setShowVerificationBanner] = useState(false)

  const handleVerification = useCallback(async () => {
    try {
      const response = await verifyID({ initiatorID: initiatorID })
      const verificationState =
        response.sendIdentityVerificationEmail?.confirmationOrError?.identityVerification?.state

      const IdvHasValidState =
        typeof verificationState === "string" &&
        !ID_VERIFICATION_BLOCKING_STATES.includes(verificationState)

      if (IdvHasValidState) {
        setShowVerificationBanner(true)
      }
    } catch (error) {
      captureMessage(`useHandleIDVerification ${JSON.stringify(error)}`)
    } finally {
      // Allow the user some time to read the message
      setTimeout(() => {
        setShowVerificationBanner(false)
      }, VERIFICATION_BANNER_TIMEOUT)
    }
  }, [])

  return { showVerificationBanner, handleVerification }
}
