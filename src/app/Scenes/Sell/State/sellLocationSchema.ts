import { SellDelivery, SellPackaging, SellPacker } from "app/Scenes/Sell/State/SellLocationStore"
import * as Yup from "yup"

const locationFields = {
  address: Yup.object().nullable().required(),
  phoneNumber: Yup.string().trim().required(),
}

/** Step 3’s answers for an auction work are complete when this passes */
export const sellAuctionLocationSchema = Yup.object().shape(locationFields).required()

/** Step 3’s answers for a listing are complete when this passes */
export const sellMarketplaceShippingSchema = Yup.object()
  .shape({
    ...locationFields,
    packaging: Yup.mixed<SellPackaging>().oneOf(["FRAMED", "ROLLED", "EITHER"]).required(),
    packer: Yup.mixed<SellPacker>().oneOf(["SELLER", "COURIER", "EITHER"]).required(),
    delivery: Yup.mixed<SellDelivery>().oneOf(["DROP_OFF", "COLLECTION", "EITHER"]).required(),
  })
  .required()
