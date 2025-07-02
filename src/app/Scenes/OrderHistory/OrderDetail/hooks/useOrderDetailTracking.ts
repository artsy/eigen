import {
  ActionType,
  ContextModule,
  OwnerType,
  TappedBuyerProtection,
  TappedVisitHelpCenter,
} from "@artsy/cohesion"
import { OrderDetailHelpLinks_order$data } from "__generated__/OrderDetailHelpLinks_order.graphql"
import { OrderDetail_order$data } from "__generated__/OrderDetail_order.graphql"
import { useMemo } from "react"
import { useTracking } from "react-tracking"

export const useOrderDetailTracking = () => {
  const { trackEvent } = useTracking()

  const tracks = useMemo(() => {
    return {
      clickedVisitHelpCenter: (
        orderId: OrderDetailHelpLinks_order$data["internalID"],
        orderType: OrderDetailHelpLinks_order$data["mode"]
      ) => {
        const payload: TappedVisitHelpCenter = {
          action: ActionType.tappedVisitHelpCenter,
          context_module: ContextModule.ordersDetail,
          context_screen_owner_id: orderId,
          context_screen_owner_type: OwnerType.ordersDetail,
          destination_screen_owner_type: OwnerType.articles,
          destination_screen_owner_slug: "0TO3b000000UessGAC/buy",
          flow: orderType === "OFFER" ? "Make offer" : "Buy now",
        }

        trackEvent(payload)
      },
      clickedBuyerProtection: (orderId: OrderDetail_order$data["internalID"]) => {
        const payload: TappedBuyerProtection = {
          action: ActionType.tappedBuyerProtection,
          context_module: ContextModule.ordersDetail,
          context_screen_owner_id: orderId,
          context_screen_owner_type: OwnerType.ordersDetail,
          destination_screen_owner_slug: "The-Artsy-Guarantee",
          destination_screen_owner_type: OwnerType.articles,
        }

        trackEvent(payload)
      },
    }
  }, [trackEvent])

  return tracks
}
