import { Flex } from "@artsy/palette-mobile"
import { usePartnerOfferCheckoutMutation$data } from "__generated__/usePartnerOfferCheckoutMutation.graphql"
import { LoadingSpinner } from "app/Components/Modals/LoadingModal"
import { usePartnerOfferMutation } from "app/Scenes/PartnerOffer/mutations/usePartnerOfferCheckoutMutation"
import { goBack, navigate } from "app/system/navigation/navigate"
import { useEffect } from "react"

export const PartnerOfferContainer: React.FC<{ partnerOfferID: string }> = ({ partnerOfferID }) => {
  const handleRedirect = (response: usePartnerOfferCheckoutMutation$data) => {
    const orderOrError = response.commerceCreatePartnerOfferOrder?.orderOrError

    if (orderOrError?.error) {
      const { code, data } = orderOrError.error
      const artworkId = JSON.parse(data?.toString() ?? "")?.artwork_id

      if (code === "expired_partner_offer") {
        // TODO: add params to show expired banner (EMI-1606)
        navigate(`/artwork/${artworkId}`)
        return
      }

      if (code === "not_acquireable") {
        // TODO: add params to show unavailable/sold banner (EMI-1606)
        navigate(`/artwork/${artworkId}`)
        return
      }
    }

    if (orderOrError?.order) {
      navigate(`/orders/${orderOrError.order?.internalID}`)
      return
    }

    goBack()
  }

  const { commitMutation } = usePartnerOfferMutation(handleRedirect)

  useEffect(() => {
    commitMutation({ partnerOfferId: partnerOfferID })
  }, [])

  return (
    <Flex flex={1}>
      <LoadingSpinner />
    </Flex>
  )
}
