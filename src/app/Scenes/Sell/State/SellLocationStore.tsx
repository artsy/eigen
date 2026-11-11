import { LocationWithDetails } from "app/utils/googleMaps"
import { Action, Computed, action, computed, createContextStore } from "easy-peasy"

export const US_ZIP_LENGTH = 5

export type SellPackaging = "FRAMED" | "ROLLED" | "EITHER"
export type SellPacker = "SELLER" | "COURIER" | "EITHER"
export type SellDelivery = "DROP_OFF" | "COLLECTION" | "EITHER"

/** Step 3's answers. The provider lives on the LocationAndContact screen. */
export interface SellLocationStoreModel {
  address: LocationWithDetails | null
  postalCode: string
  phoneNumber: string
  packaging: SellPackaging | null
  packer: SellPacker | null
  delivery: SellDelivery | null
  locationComplete: Computed<this, boolean>
  shippingComplete: Computed<this, boolean>
  /** Also fills the postal code when Google knows it */
  setAddress: Action<this, LocationWithDetails>
  setPostalCode: Action<this, string>
  setPhoneNumber: Action<this, string>
  setPackaging: Action<this, SellPackaging>
  setPacker: Action<this, SellPacker>
  setDelivery: Action<this, SellDelivery>
}

export const sellLocationStoreModel: SellLocationStoreModel = {
  address: null,
  postalCode: "",
  phoneNumber: "",
  packaging: null,
  packer: null,
  delivery: null,
  locationComplete: computed(
    (state) => !!state.address && state.postalCode.length === US_ZIP_LENGTH
  ),
  shippingComplete: computed((state) => !!state.packaging && !!state.packer && !!state.delivery),
  setAddress: action((state, address) => {
    state.address = address
    if (address.postalCode) {
      state.postalCode = address.postalCode.slice(0, US_ZIP_LENGTH)
    }
  }),
  setPostalCode: action((state, postalCode) => {
    state.postalCode = postalCode
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
