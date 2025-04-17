import { Flex, Input, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { useStripe } from "@stripe/stripe-react-native"
import { CreateCardTokenParams } from "@stripe/stripe-react-native/lib/typescript/src/types/Token"
import { MyProfilePaymentNewCreditCardSaveCardMutation } from "__generated__/MyProfilePaymentNewCreditCardSaveCardMutation.graphql"
import { CountrySelect } from "app/Components/CountrySelect"
import { CreditCardField } from "app/Components/CreditCardField/CreditCardField"
import { Select } from "app/Components/Select/SelectV2"
import { Stack } from "app/Components/Stack"
import { goBack } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { Action, Computed, action, computed, useLocalStore } from "easy-peasy"
import React, { useEffect, useRef } from "react"
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { commitMutation, graphql } from "react-relay"
import { __triggerRefresh } from "./MyProfilePayment"

interface CreditCardInputParams {
  expMonth: number
  expYear: number
  last4: string
}

export interface FormField<Type = string> {
  value: Type | null
  touched: boolean
  required: boolean
  isPresent: Computed<this, boolean>
  setValue: Action<this, Type>
}

export const emptyFieldState: () => FormField<any> = () => ({
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

export interface FormFields {
  creditCard: FormField<{
    valid: boolean
    params: CreditCardInputParams
  }>
  fullName: FormField
  addressLine1: FormField
  addressLine2: FormField
  city: FormField
  postalCode: FormField
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
      postalCode: emptyFieldState(),
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

  const addressLine1Ref = useRef<Input>(null)
  const addressLine2Ref = useRef<Input>(null)
  const cityRef = useRef<Input>(null)
  const postalCodeRef = useRef<Input>(null)
  const stateRef = useRef<Input>(null)
  const countryRef = useRef<Select<any>>(null)

  const navigation = useNavigation()

  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    const isValid = state.allPresent

    navigation.setOptions({
      headerRight: () => {
        return (
          <Touchable
            onPress={() => {
              handleSave()
            }}
            disabled={!isValid}
          >
            <Text variant="xs" color={!!isValid ? "mono100" : "mono60"}>
              Save
            </Text>
          </Touchable>
        )
      },
    })
  }, [navigation, state.allPresent])

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
        postalCode: state.fields.postalCode.value ?? undefined,
      },
    }
  }

  const handleSave = async () => {
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
      goBack()
    } catch (e) {
      console.error(e)
      Alert.alert(
        "Something went wrong while attempting to save your credit card. Please try again or contact us."
      )
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView ref={scrollViewRef}>
        <Flex p={2}>
          <Stack spacing={2}>
            <>
              <CreditCardField
                onCardChange={(cardDetails) => {
                  actions.fields.creditCard.setValue({
                    valid: cardDetails.complete,
                    params: {
                      expMonth: cardDetails.expiryMonth,
                      expYear: cardDetails.expiryYear,
                      last4: cardDetails.last4,
                    },
                  })
                }}
              />
            </>

            <Input
              title="Name on card"
              placeholder="Full name"
              onChangeText={actions.fields.fullName.setValue}
              defaultValue={state.fields.fullName.value ?? ""}
              returnKeyType="next"
              onSubmitEditing={() => addressLine1Ref.current?.focus()}
            />
            <Input
              ref={addressLine1Ref}
              title="Address line 1"
              placeholder="Add street address"
              onChangeText={actions.fields.addressLine1.setValue}
              defaultValue={state.fields.addressLine1.value ?? ""}
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
              defaultValue={state.fields.addressLine2.value ?? ""}
              returnKeyType="next"
              onSubmitEditing={() => cityRef.current?.focus()}
            />
            <Input
              ref={cityRef}
              title="City"
              onChangeText={actions.fields.city.setValue}
              defaultValue={state.fields.city.value ?? ""}
              returnKeyType="next"
              onSubmitEditing={() => postalCodeRef.current?.focus()}
            />
            <Input
              ref={postalCodeRef}
              title="Postal Code"
              onChangeText={actions.fields.postalCode.setValue}
              defaultValue={state.fields.postalCode.value ?? ""}
              returnKeyType="next"
              onSubmitEditing={() => stateRef.current?.focus()}
            />

            <Input
              ref={stateRef}
              title="State, province, or region"
              onChangeText={actions.fields.state.setValue}
              defaultValue={state.fields.state.value ?? ""}
              onSubmitEditing={() => {
                stateRef.current?.blur()
                scrollViewRef.current?.scrollToEnd()
                setTimeout(() => {
                  countryRef.current?.open()
                }, 100)
              }}
              returnKeyType="next"
            />

            <Spacer y={2} />

            <CountrySelect
              ref={countryRef}
              onSelectValue={actions.fields.country.setValue}
              value={state.fields.country.value}
            />
          </Stack>
        </Flex>
      </ScrollView>
    </KeyboardAvoidingView>
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
