import { captureException } from "@sentry/react-native"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { verifyEmail } from "lib/utils/verifyEmail"
import { verifyID } from "lib/utils/verifyID"
import { useCallback, useState } from "react"

export const useHandleVerification = () => {
  const [showVerificationBannerForEmail, setShowVerificationBannerForEmail] = useState(false)
  const [isEmailVerificationLoading, setIsEmailVerificationLoading] = useState(false)
  const [didSuccessfullyVerifyEmail, setDidSuccessfullyVerifyEmail] = useState<boolean | null>(null)
  const [showVerificationBannerForID, setShowVerificationBannerForID] = useState(false)
  const [isIDVerificationLoading, setIsIDVerificationLoading] = useState(false)
  const [didSuccessfullyVerifyID, setDidSuccessfullyVerifyID] = useState<boolean | null>(null)

  const handleEmailVerification = useCallback(async () => {
    try {
      setShowVerificationBannerForEmail(true)
      setIsEmailVerificationLoading(true)

      const { sendConfirmationEmail } = await verifyEmail(defaultEnvironment)

      const confirmationOrError = sendConfirmationEmail?.confirmationOrError
      const emailToConfirm = confirmationOrError?.unconfirmedEmail

      // this timeout is here to make sure that the user have enough time to read
      // "Sending a confirmation email..."
      setTimeout(() => {
        if (emailToConfirm) {
          setDidSuccessfullyVerifyEmail(true)
          setIsEmailVerificationLoading(false)
        } else {
          setDidSuccessfullyVerifyEmail(false)
          setIsEmailVerificationLoading(false)
        }
      }, 500)
    } catch (error) {
      captureException(error)
    } finally {
      // Allow the user some time to read the message
      setTimeout(() => {
        setShowVerificationBannerForEmail(false)
      }, 2000)
    }
  }, [])

  const handleIDVerification = useCallback(async () => {
    try {
      setShowVerificationBannerForID(true)
      setIsIDVerificationLoading(true)

      const { sendIdentityVerificationEmail } = await verifyID(defaultEnvironment)

      const confirmationOrError = sendIdentityVerificationEmail?.confirmationOrError
      const state = confirmationOrError?.identityVerificationEmail?.state

      // this timeout is here to make sure that the user have enough time to read
      // "Sending an ID verification email..."
      setTimeout(() => {
        if (state && Object.values(StateToBlockFurtherIDVerification).includes(state)) {
          setDidSuccessfullyVerifyID(false)
          setIsIDVerificationLoading(false)
        } else {
          setDidSuccessfullyVerifyID(true)
          setIsIDVerificationLoading(false)
        }
      }, 500)
    } catch (error) {
      captureException(error)
    } finally {
      // Allow the user some time to read the message
      setTimeout(() => {
        setShowVerificationBannerForID(false)
      }, 2000)
    }
  }, [])

  return {
    handleEmailVerification,
    handleIDVerification,
    isEmailVerificationLoading,
    didSuccessfullyVerifyEmail,
    showVerificationBannerForEmail,
    isIDVerificationLoading,
    showVerificationBannerForID,
    didSuccessfullyVerifyID,
  }
}

enum StateToBlockFurtherIDVerification {
  passed,
  failed,
  watchlist_hit,
}
