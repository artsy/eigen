import { Input } from "@artsy/palette-mobile"
import { CardField, CardFieldInput, useStripe } from "@stripe/stripe-react-native"
import { CreateCardTokenParams } from "@stripe/stripe-react-native/lib/typescript/src/types/Token"
import { MyProfilePaymentNewCreditCardSaveCardMutation } from "__generated__/MyProfilePaymentNewCreditCardSaveCardMutation.graphql"
import { CountrySelect } from "app/Components/CountrySelect"
import { InputTitle } from "app/Components/Input"
import { Select } from "app/Components/Select/SelectV2"
import { Stack } from "app/Components/Stack"
import { MyAccountFieldEditScreen } from "app/Scenes/MyAccount/Components/MyAccountFieldEditScreen"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { Action, Computed, action, computed, useLocalStore } from "easy-peasy"
import React, { useEffect, useRef } from "react"
import { StyleSheet } from "react-native"
import { commitMutation, graphql } from "react-relay"
import { __triggerRefresh } from "./MyProfilePayment"

interface CreditCardInputParams {
  cvc: string
  expMonth: number
  expYear: number
  number: string
}

interface FormField<Type = string> {
  value: Type | null
  touched: boolean
  required: boolean
  isPresent: Computed<this, boolean>
  setValue: Action<this, Type>
}
const emptyFieldState: () => FormField<any> = () => ({
  value: null,
  touched: false,
  required: true,
  isPresent: computed((self) => {
    if (!self.required) {
      return true
    } else {
      return self.value !== null && (typeof self.value !== "string" || !!self.value)
    }
  }),
  setValue: action((state, payload) => {
    state.value = payload
  }),
})

interface FormFields {
  creditCard: FormField<{
    valid: boolean
    params: CreditCardInputParams
  }>
  fullName: FormField
  addressLine1: FormField
  addressLine2: FormField
  city: FormField
  postCode: FormField
  state: FormField
  country: FormField
}

interface Store {
  fields: FormFields
  allPresent: Computed<Store, boolean>
}

export const MyProfilePaymentNewCreditCard: React.FC<{}> = ({}) => {
  const { createToken } = useStripe()

  const [state, actions] = useLocalStore<Store>(() => ({
    fields: {
      creditCard: emptyFieldState(),
      fullName: emptyFieldState(),
      addressLine1: emptyFieldState(),
      addressLine2: { ...emptyFieldState(), required: false },
      city: emptyFieldState(),
      postCode: emptyFieldState(),
      state: emptyFieldState(),
      country: emptyFieldState(),
    },
    allPresent: computed((store) => {
      return Boolean(
        Object.keys(store.fields).every((k) => store.fields[k as keyof FormFields].isPresent) &&
          store.fields.creditCard.value?.valid
      )
    }),
  }))

  const paymentInfoRef = useRef<any>(null)

  const addressLine1Ref = useRef<Input>(null)
  const addressLine2Ref = useRef<Input>(null)
  const cityRef = useRef<Input>(null)
  const postalCodeRef = useRef<Input>(null)
  const stateRef = useRef<Input>(null)
  const countryRef = useRef<Select<any>>(null)

  // focus top field on mount
  useEffect(() => {
    paymentInfoRef.current?.focus()
  }, [])

  const screenRef = useRef<MyAccountFieldEditScreen>(null)

  const buildTokenParams = (): CreateCardTokenParams => {
    return {
      type: "Card",
      name: state.fields.fullName.value ?? undefined,
      address: {
        line1: state.fields.addressLine1.value ?? undefined,
        line2: state.fields.addressLine2.value ?? undefined,
        city: state.fields.city.value ?? undefined,
        state: state.fields.state.value ?? undefined,
        country: state.fields.country.value ?? undefined,
        postalCode: state.fields.postCode.value ?? undefined,
      },
      currency: "usd", // TODO: get from user
    }
  }

  return (
    <MyAccountFieldEditScreen
      ref={screenRef}
      canSave={state.allPresent}
      title="Add new card"
      onSave={async (dismiss, alert) => {
        try {
          const tokenBody = buildTokenParams()
          const stripeResult = await createToken(tokenBody)
          const tokenId = stripeResult.token?.id

          if (!stripeResult || stripeResult.error || !tokenId) {
            throw new Error(
              `Unexpected stripe card tokenization result ${JSON.stringify(stripeResult.error)}`
            )
          }
          const gravityResult = await saveCreditCard(tokenId)
          if (gravityResult.createCreditCard?.creditCardOrError?.creditCard) {
            await __triggerRefresh?.()
          } else {
            // TODO: we can probably present these errors to the user?
            throw new Error(
              `Error trying to save card ${JSON.stringify(
                gravityResult.createCreditCard?.creditCardOrError?.mutationError
              )}`
            )
          }
          dismiss()
        } catch (e) {
          console.error(e)
          alert(
            "Something went wrong while attempting to save your credit card. Please try again or contact us."
          )
        }
      }}
    >
      <Stack spacing={2}>
        <>
          <InputTitle>Credit Card</InputTitle>
          <CardField
            autofocus
            cardStyle={inputStyles}
            style={styles.cardField}
            postalCodeEnabled={false}
            onCardChange={(cardDetails) => {
              actions.fields.creditCard.setValue({
                valid: cardDetails.complete,
                // TODO: Not this
                params: {
                  cvc: cardDetails.cvc!,
                  expMonth: cardDetails.expiryMonth,
                  expYear: cardDetails.expiryYear,
                  number: cardDetails.number!,
                },
              })
            }}
          />

          {/* <LiteCreditCardInput
            ref={paymentInfoRef}
            onChange={(e) => {
              actions.fields.creditCard.setValue({
                valid: e.valid,
                params: {
                  cvc: e.values.cvc,
                  expMonth: Number(e.values.expiry.split("/")[0]),
                  expYear: Number(e.values.expiry.split("/")[1]),
                  number: e.values.number,
                },
              })
            }}
          /> */}
        </>

        <Input
          title="Name on card"
          placeholder="Full name"
          onChangeText={actions.fields.fullName.setValue}
          returnKeyType="next"
          onSubmitEditing={() => addressLine1Ref.current?.focus()}
        />
        <Input
          ref={addressLine1Ref}
          title="Address line 1"
          placeholder="Add street address"
          onChangeText={actions.fields.addressLine1.setValue}
          returnKeyType="next"
          onSubmitEditing={() => addressLine2Ref.current?.focus()}
        />
        <Input
          ref={addressLine2Ref}
          title="Address line 2"
          optional
          placeholder={[
            "Add your apt, floor, suite, etc.",
            "Add your apt, floor, etc.",
            "Add your apt, etc.",
          ]}
          onChangeText={actions.fields.addressLine2.setValue}
          returnKeyType="next"
          onSubmitEditing={() => cityRef.current?.focus()}
        />
        <Input
          ref={cityRef}
          title="City"
          onChangeText={actions.fields.city.setValue}
          returnKeyType="next"
          onSubmitEditing={() => postalCodeRef.current?.focus()}
        />
        <Input
          ref={postalCodeRef}
          title="Postal Code"
          onChangeText={actions.fields.postCode.setValue}
          returnKeyType="next"
          onSubmitEditing={() => stateRef.current?.focus()}
        />
        <Input
          ref={stateRef}
          title="State, province, or region"
          onChangeText={actions.fields.state.setValue}
          onSubmitEditing={() => {
            stateRef.current?.blur()
            screenRef.current?.scrollToEnd()
            setTimeout(() => {
              countryRef.current?.open()
            }, 100)
          }}
          returnKeyType="next"
        />
        <CountrySelect
          ref={countryRef}
          onSelectValue={actions.fields.country.setValue}
          value={state.fields.country.value}
        />
      </Stack>
    </MyAccountFieldEditScreen>
  )
}

const saveCreditCard = (token: string) => {
  return new Promise<MyProfilePaymentNewCreditCardSaveCardMutation["response"]>(
    (resolve, reject) => {
      commitMutation<MyProfilePaymentNewCreditCardSaveCardMutation>(getRelayEnvironment(), {
        mutation: graphql`
          mutation MyProfilePaymentNewCreditCardSaveCardMutation($input: CreditCardInput!) {
            createCreditCard(input: $input) {
              creditCardOrError {
                ... on CreditCardMutationSuccess {
                  creditCard {
                    internalID
                  }
                }
                ... on CreditCardMutationFailure {
                  mutationError {
                    detail
                    error
                    message
                  }
                }
              }
            }
          }
        `,
        onCompleted: resolve,
        onError: reject,
        variables: {
          input: {
            oneTimeUse: false,
            token,
          },
        },
      })
    }
  )
}

// TODO: Update these styles to match ours
const styles = StyleSheet.create({
  cardField: {
    width: "100%",
    height: 50,
    // marginVertical: 30,
  },
  or: {
    textAlign: "center",
    marginTop: 30,
  },
})

const inputStyles: CardFieldInput.Styles = {
  borderWidth: 1,
  backgroundColor: "#FFFFFF",
  borderColor: "#000000",
  fontSize: 14,
  placeholderColor: "#999999",
}
