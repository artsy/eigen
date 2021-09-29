declare module "react-native-credit-card-input" {
  import { StyleProp } from "react-native"

  export interface CreditCardValues {
    cvc: string
    expiry: string
    number: string
    type: string
  }

  export interface CreditCardInputOnChangeEvent {
    valid: false
    values: CreditCardValues
  }

  export class LiteCreditCardInput extends React.Component<{
    inputStyle?: StyleProp<any>
    onChange(e: CreditCardInputOnChangeEvent): void
  }> {
    focus(): void
    setValues(values: Partial<CreditCardValues>): void
  }
}
