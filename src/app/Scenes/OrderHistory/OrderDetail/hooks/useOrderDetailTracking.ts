import {
  ActionType,
  ContextModule,
  OrderDetailsViewed,
  OwnerType,
  TappedBuyerProtection,
  TappedImportFees,
  TappedVisitHelpCenter,
} from "@artsy/cohesion"
import { OrderDetailHelpLinks_order$data } from "__generated__/OrderDetailHelpLinks_order.graphql"
import { OrderDetailPriceBreakdown_order$data } from "__generated__/OrderDetailPriceBreakdown_order.graphql"
import { OrderDetail_order$data } from "__generated__/OrderDetail_order.graphql"
import { useMemo } from "react"
import { useTracking } from "react-tracking"

export const useOrderDetailTracking = () => {
  const { trackEvent } = useTracking()

  const tracks = useMemo(() => {
    return {
      orderDetailsViewed: (
        orderId: OrderDetail_order$data["internalID"],
        messageType: OrderDetail_order$data["displayTexts"]["messageType"]
      ) => {
        const payload: OrderDetailsViewed = {
          action: ActionType.orderDetailsViewed,
          context_module: ContextModule.ordersDetail,
          context_owner_type: OwnerType.ordersDetail,
          context_owner_id: orderId,
          message_type: messageType,
        }

        trackEvent(payload)
      },
      tappedBuyerProtection: (orderId: OrderDetail_order$data["internalID"]) => {
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
      tappedImportFees: (
        orderID: OrderDetailPriceBreakdown_order$data["internalID"],
        orderType: OrderDetailPriceBreakdown_order$data["mode"],
        orderSource: OrderDetailPriceBreakdown_order$data["source"]
      ) => {
        const flow =
          orderType === "OFFER"
            ? "Make offer"
            : orderSource === "PARTNER_OFFER"
              ? "Partner offer"
              : "Buy now"

        const payload: TappedImportFees = {
          action: ActionType.tappedImportFees,
          context_module: ContextModule.ordersDetail,
          context_screen_owner_id: orderID,
          context_screen_owner_type: OwnerType.ordersDetail,
          destination_screen_owner_type: OwnerType.articles,
          destination_screen_owner_slug: "How-are-taxes-and-customs-fees-calculated",
          flow,
        }

        trackEvent(payload)
      },
      tappedVisitHelpCenter: (
        orderId: OrderDetailHelpLinks_order$data["internalID"],
        orderType: OrderDetailHelpLinks_order$data["mode"],
        orderSource: OrderDetailHelpLinks_order$data["source"]
      ) => {
        const flow =
          orderType === "OFFER"
            ? "Make offer"
            : orderSource === "PARTNER_OFFER"
              ? "Partner offer"
              : "Buy now"

        const payload: TappedVisitHelpCenter = {
          action: ActionType.tappedVisitHelpCenter,
          context_module: ContextModule.ordersDetail,
          context_screen_owner_id: orderId,
          context_screen_owner_type: OwnerType.ordersDetail,
          destination_screen_owner_type: OwnerType.articles,
          destination_screen_owner_slug: "0TO3b000000UessGAC/buy",
          flow,
        }

        trackEvent(payload)
      },
    }
  }, [trackEvent])

  return tracks
}
