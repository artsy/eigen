import { captureException } from "@sentry/react-native"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { verifyEmail } from "lib/utils/verifyEmail"
import { verifyID } from "lib/utils/verifyID"
import { useCallback, useState } from "react"

type verificationType = "ID" | "Email"

const useHandleVerification = (type: verificationType) => {
  const [emailVerificationState, setEmailVerificationState] = useState<boolean | null>(null)
  const [iDVerificationState, setIDVerificationState] = useState<boolean | null>(null)
  const [showVerificationBannerForEmail, setShowVerificationBannerForEmail] = useState(false)
  const [showVerificationBannerForID, setShowVerificationBannerForID] = useState(false)

  if (type === "Email") {
    const handleEmailVerification = useCallback(async () => {
      try {
        setShowVerificationBannerForEmail(true)

        const { sendConfirmationEmail } = await verifyEmail(defaultEnvironment)

        const confirmationOrError = sendConfirmationEmail?.confirmationOrError
        const emailToConfirm = confirmationOrError?.unconfirmedEmail

        // this timeout is here to make sure that the user have enough time to read
        // "Sending a confirmation email..."
        setTimeout(() => {
          if (emailToConfirm) {
            setEmailVerificationState(true)
          } else {
            setEmailVerificationState(false)
          }
        }, 500)
      } catch (error) {
        captureException(error)
      } finally {
        // Allow the user some time to read the message
        setTimeout(() => {
          setShowVerificationBannerForEmail(false)
        }, 6000)
      }
    }, [])

    return {
      emailVerificationState,
      showVerificationBannerForEmail,
      handleEmailVerification,
    }
  } else {
    const handleIDVerification = useCallback(async () => {
      try {
        setShowVerificationBannerForID(true)
        const { sendIdentityVerificationEmail } = await verifyID(defaultEnvironment)

        const confirmationOrError = sendIdentityVerificationEmail?.confirmationOrError
        const state = confirmationOrError?.identityVerificationEmail?.state

        // this timeout is here to make sure that the user have enough time to read
        // "Sending an ID verification email..."
        setTimeout(() => {
          if (state && Object.values(StateToBlockFurtherIDVerification).includes(state)) {
            setIDVerificationState(false)
          } else {
            setIDVerificationState(true)
          }
        }, 500)
      } catch (error) {
        captureException(error)
      } finally {
        // Allow the user some time to read the message
        setTimeout(() => {
          setShowVerificationBannerForID(false)
        }, 6000)
      }
    }, [])

    return {
      iDVerificationState,
      showVerificationBannerForID,
      handleIDVerification,
    }
  }
}

export const useHandleEmailVerification = () => {
  return useHandleVerification("Email")
}

export const useHandleIDVerification = () => {
  return useHandleVerification("ID")
}

enum StateToBlockFurtherIDVerification {
  passed,
  failed,
  watchlist_hit,
}
