import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { Box, Button, Sans, Serif, Theme } from "palette"
import React, { Component } from "react"
import { ScrollView, View } from "react-native"
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import stripe, { StripeToken } from "tipsi-stripe"

import { BottomAlignedButtonWrapper } from "app/Components/Buttons/BottomAlignedButtonWrapper"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Container } from "../Components/Containers"
import { PaymentCardTextFieldParams } from "../types"

import { LiteCreditCardInput } from "react-native-credit-card-input"

interface CreditCardFormProps {
  navigator: NavigatorIOS
  params?: PaymentCardTextFieldParams
  onSubmit: (t: StripeToken, p: PaymentCardTextFieldParams) => void
}

interface CreditCardFormState {
  valid: boolean | null
  params: Partial<PaymentCardTextFieldParams>
  isLoading: boolean
  isError: boolean
}

export class CreditCardForm extends Component<CreditCardFormProps, CreditCardFormState> {
  private paymentInfo: React.RefObject<LiteCreditCardInput>

  constructor(props: CreditCardFormProps) {
    super(props)

    this.paymentInfo = (React as any).createRef()
    this.state = { valid: null, params: { ...this.props.params }, isLoading: false, isError: false }
  }

  componentDidMount() {
    if (this.paymentInfo.current) {
      this.paymentInfo.current.focus()
      if (this.props.params) {
        this.paymentInfo.current.setValues({
          cvc: this.props.params.cvc,
          expiry:
            this.props.params.expMonth.toString().padStart(2, "0") +
            "/" +
            this.props.params.expYear.toString().padStart(2, "0"),
          number: this.props.params.number,
        })
      }
    }
  }

  tokenizeCardAndSubmit = async () => {
    this.setState({ isLoading: true, isError: false })

    const { params } = this.state

    try {
      const token = await stripe.createTokenWithCard({ ...params })
      // If the form is valid we can assume all params have been filled
      this.props.onSubmit(token, this.state.params as PaymentCardTextFieldParams)
      this.setState({ isLoading: false })
      this.props.navigator.pop()
    } catch (error) {
      console.error("CreditCardForm.tsx", error)
      this.setState({ isError: true, isLoading: false })
    }
  }

  render() {
    const buttonComponent = (
      <Box m="1">
        <Button
          disabled={!this.state.valid}
          loading={this.state.isLoading}
          block
          width={100}
          onPress={this.state.valid ? () => this.tokenizeCardAndSubmit() : null}
        >
          Add credit card
        </Button>
      </Box>
    )

    const errorText = "There was an error. Please try again."

    return (
      <BottomAlignedButtonWrapper
        onPress={this.state.valid ? () => this.tokenizeCardAndSubmit() : undefined}
        buttonComponent={buttonComponent}
      >
        <Theme>
          <FancyModalHeader onLeftButtonPress={() => this.props.navigator?.pop()}>
            Add credit card
          </FancyModalHeader>
        </Theme>
        <ScrollView scrollEnabled={false}>
          <Container m={0}>
            <View>
              <Box m="1">
                <Serif size="3t" mb={2}>
                  Card Information
                </Serif>
                <LiteCreditCardInput
                  ref={this.paymentInfo}
                  onChange={({ valid, values }) => {
                    this.setState({
                      valid,
                      params: {
                        cvc: values.cvc,
                        expMonth: Number(values.expiry.split("/")[0]),
                        expYear: Number(values.expiry.split("/")[1]),
                        number: values.number,
                      },
                    })
                  }}
                />
                {!!this.state.isError && (
                  <Sans size="2" mt={3} color="red100">
                    {errorText}
                  </Sans>
                )}
                <Sans mt="6" size="3" color="black60" textAlign="center">
                  Registration is free.
                  {"\n"}A credit card is required to bid. Artsy will never charge this card without
                  your permission, and you are not required to use this card to pay if you win.
                </Sans>
              </Box>
            </View>
          </Container>
        </ScrollView>
      </BottomAlignedButtonWrapper>
    )
  }
}
