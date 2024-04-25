import { Flex } from "@artsy/palette-mobile"
import { LoadingSpinner } from "app/Components/Modals/LoadingModal"
import { Toast } from "app/Components/Toast/Toast"
import { usePartnerOfferMutation } from "app/Scenes/PartnerOffer/mutations/usePartnerOfferCheckoutMutation"
import { goBack, navigate } from "app/system/navigation/navigate"
import { useEffect } from "react"

export const PartnerOfferContainer: React.FC<{ partnerOfferID: string }> = ({ partnerOfferID }) => {
  const { commitMutation } = usePartnerOfferMutation()

  const handleGenericError = () => {
    Toast.show("An error occurred.", "bottom")
    goBack()
  }

  const createOrderFromPartnerOffer = async () => {
    try {
      const response = await commitMutation({ partnerOfferId: partnerOfferID })
      const orderOrError = response.commerceCreatePartnerOfferOrder?.orderOrError

      if (orderOrError?.error) {
        const { code: errorCode, data: artwork } = orderOrError.error
        const artworkId = JSON.parse(artwork?.toString() ?? "{}")?.artwork_id

        if (errorCode === "expired_partner_offer") {
          navigate(`/artwork/${artworkId}`, {
            replaceActiveScreen: true,
            passProps: { artworkOfferExpired: true },
          })

          return
        }

        if (errorCode === "not_acquireable") {
          navigate(`/artwork/${artworkId}`, {
            replaceActiveScreen: true,
            passProps: { artworkOfferUnavailable: true },
          })

          return
        } else {
          handleGenericError()
        }
      } else if (orderOrError?.order) {
        // we need to go back to the home screen before navigating to the orders screen
        // to prevent the user from closing the modal and navigating back to the this screen
        goBack()
        navigate(`/orders/${orderOrError.order?.internalID}`, {
          passProps: { title: "Purchase" },
        })

        return
      } else {
        handleGenericError()
      }
    } catch (e) {
      handleGenericError()
    }
  }

  useEffect(() => {
    createOrderFromPartnerOffer()
  }, [])

  return (
    <Flex testID="partner-offer-container-loading-screen" flex={1}>
      <LoadingSpinner />
    </Flex>
  )
}
