import {
  ActionType,
  ContextModule,
  OrderDetailsViewed,
  OwnerType,
  TappedAskSpecialist,
  TappedBuyerProtection,
  TappedContactGallery,
  TappedImportFees,
  TappedVisitHelpCenter,
} from "@artsy/cohesion"
import { OrderDetailsHelpLinks_order$data } from "__generated__/OrderDetailsHelpLinks_order.graphql"
import { OrderDetailsPriceBreakdown_order$data } from "__generated__/OrderDetailsPriceBreakdown_order.graphql"
import { OrderDetails_order$data } from "__generated__/OrderDetails_order.graphql"
import { useMemo } from "react"
import { useTracking } from "react-tracking"

export const useOrderDetailsTracking = () => {
  const { trackEvent } = useTracking()

  const tracks = useMemo(() => {
    return {
      orderDetailsViewed: (
        orderId: OrderDetails_order$data["internalID"],
        messageType: OrderDetails_order$data["displayTexts"]["messageType"]
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

      tappedAskSpecialist: (
        orderId: OrderDetailsHelpLinks_order$data["internalID"],
        orderType: OrderDetailsHelpLinks_order$data["mode"],
        orderSource: OrderDetailsHelpLinks_order$data["source"]
      ) => {
        const flow =
          orderType === "OFFER"
            ? "Make offer"
            : orderSource === "PARTNER_OFFER"
              ? "Partner offer"
              : "Buy now"

        const payload: TappedAskSpecialist = {
          action: ActionType.tappedAskSpecialist,
          context_module: ContextModule.ordersDetail,
          context_screen_owner_id: orderId,
          context_screen_owner_type: OwnerType.ordersDetail,
          flow,
        }

        trackEvent(payload)
      },
      tappedBuyerProtection: (orderId: OrderDetails_order$data["internalID"]) => {
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
      tappedContactGallery: (orderId: string) => {
        const payload: TappedContactGallery = {
          action: ActionType.tappedContactGallery,
          context_owner_type: OwnerType.ordersDetail,
          context_owner_id: orderId,
        }
        trackEvent(payload)
      },
      tappedImportFees: (
        orderID: OrderDetailsPriceBreakdown_order$data["internalID"],
        orderType: OrderDetailsPriceBreakdown_order$data["mode"],
        orderSource: OrderDetailsPriceBreakdown_order$data["source"]
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
        orderId: OrderDetailsHelpLinks_order$data["internalID"],
        orderType: OrderDetailsHelpLinks_order$data["mode"],
        orderSource: OrderDetailsHelpLinks_order$data["source"]
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
