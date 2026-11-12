import { SellLocationFields_me$data } from "__generated__/SellLocationFields_me.graphql"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { Action, Computed, action, computed, createContextStore } from "easy-peasy"

export type SellSavedAddress = ExtractNodeType<SellLocationFields_me$data["addressConnection"]>

/** The Sell flow is US only, so other addresses show but can't be picked */
export const isSellableAddress = (address: SellSavedAddress) => address.country === "US"

export type SellPackaging = "FRAMED" | "ROLLED" | "EITHER"
export type SellPacker = "SELLER" | "COURIER" | "EITHER"
export type SellDelivery = "DROP_OFF" | "COLLECTION" | "EITHER"

/** Step 3's answers. The provider lives on the LocationAndContact screen. */
export interface SellLocationStoreModel {
  address: SellSavedAddress | null
  phoneNumber: string
  packaging: SellPackaging | null
  packer: SellPacker | null
  delivery: SellDelivery | null
  locationComplete: Computed<this, boolean>
  shippingComplete: Computed<this, boolean>
  /** Also fills an empty phone number from the address */
  setAddress: Action<this, SellSavedAddress>
  setPhoneNumber: Action<this, string>
  setPackaging: Action<this, SellPackaging>
  setPacker: Action<this, SellPacker>
  setDelivery: Action<this, SellDelivery>
}

export const sellLocationStoreModel: SellLocationStoreModel = {
  address: null,
  phoneNumber: "",
  packaging: null,
  packer: null,
  delivery: null,
  locationComplete: computed((state) => !!state.address),
  shippingComplete: computed((state) => !!state.packaging && !!state.packer && !!state.delivery),
  setAddress: action((state, address) => {
    state.address = address
    state.phoneNumber ||= address.phoneNumber ?? ""
  }),
  setPhoneNumber: action((state, phoneNumber) => {
    state.phoneNumber = phoneNumber
  }),
  setPackaging: action((state, packaging) => {
    state.packaging = packaging
  }),
  setPacker: action((state, packer) => {
    state.packer = packer
  }),
  setDelivery: action((state, delivery) => {
    state.delivery = delivery
  }),
}

export const SellLocationStore = createContextStore<SellLocationStoreModel>((runtimeModel) => ({
  ...sellLocationStoreModel,
  ...runtimeModel,
}))
