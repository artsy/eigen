import {
  ResaleSubmissionCourierHandoff,
  ResaleSubmissionPackaging,
  ResaleSubmissionPacker,
} from "__generated__/useUpdateResaleSubmissionMutation.graphql"
import { SellDelivery, SellPackaging, SellPacker } from "app/Scenes/Sell/State/SellLocationStore"

const PACKAGING: Record<SellPackaging, ResaleSubmissionPackaging> = {
  FRAMED: "FRAMED",
  ROLLED: "ROLLED",
  EITHER: "NO_PREFERENCE",
}

const PACKER: Record<SellPacker, ResaleSubmissionPacker> = {
  SELLER: "SELLER",
  COURIER: "COURIER",
  EITHER: "NO_PREFERENCE",
}

const COURIER_HANDOFF: Record<SellDelivery, ResaleSubmissionCourierHandoff> = {
  DROP_OFF: "SELLER_DROPOFF",
  COLLECTION: "COURIER_PICKUP",
  EITHER: "NO_PREFERENCE",
}

/** Step 3’s shipping answers as the resale submission stores them */
export const toShippingAnswers = (answers: {
  packaging: SellPackaging
  packer: SellPacker
  delivery: SellDelivery
}) => ({
  packaging: PACKAGING[answers.packaging],
  packer: PACKER[answers.packer],
  courierHandoff: COURIER_HANDOFF[answers.delivery],
})
