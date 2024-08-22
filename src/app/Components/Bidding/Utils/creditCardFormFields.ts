import { Country, PaymentCardTextFieldParams } from "app/Components/Bidding/types"

export interface CreditCardFormValues {
  creditCard: {
    valid: boolean
    params: Partial<PaymentCardTextFieldParams>
  }
  fullName: string
  addressLine1: string
  addressLine2: string
  city: string
  postalCode: string
  state: string
  country: Country
  phoneNumber: string
}

export const CREDIT_CARD_INITIAL_FORM_VALUES: CreditCardFormValues = {
  creditCard: {
    valid: false,
    params: {
      expiryMonth: undefined,
      expiryYear: undefined,
      last4: undefined,
    },
  },
  fullName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  postalCode: "",
  state: "",
  country: { longName: "", shortName: "" },
  phoneNumber: "",
}
