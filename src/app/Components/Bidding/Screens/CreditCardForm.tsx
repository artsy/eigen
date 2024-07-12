import { Box, Text, Button, Spacer } from "@artsy/palette-mobile"
import { createToken, Token } from "@stripe/stripe-react-native"
import { Container } from "app/Components/Bidding/Components/Containers"
import { PaymentCardTextFieldParams } from "app/Components/Bidding/types"
import { BottomAlignedButtonWrapper } from "app/Components/Buttons/BottomAlignedButtonWrapper"
import { CreditCardField } from "app/Components/CreditCardField/CreditCardField"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { Component } from "react"
import { ScrollView, View } from "react-native"

interface CreditCardFormProps {
  navigator: NavigatorIOS
  params?: PaymentCardTextFieldParams
  onSubmit: (t: Token.Result, p: PaymentCardTextFieldParams) => void
}

interface CreditCardFormState {
  valid: boolean | null
  params: Partial<PaymentCardTextFieldParams>
  isLoading: boolean
  isError: boolean
}

export class CreditCardForm extends Component<CreditCardFormProps, CreditCardFormState> {
  constructor(props: CreditCardFormProps) {
    super(props)
    this.state = { valid: null, params: { ...this.props.params }, isLoading: false, isError: false }
  }

  tokenizeCardAndSubmit = async () => {
    this.setState({ isLoading: true, isError: false })

    const { params } = this.state

    try {
      const token = await createToken({ ...params, type: "Card" })

      if (token.error) {
        throw new Error(`[Stripe]: error creating the token: ${JSON.stringify(token.error)}`)
      }

      // If the form is valid we can assume all params have been filled
      this.props.onSubmit(token.token, this.state.params as PaymentCardTextFieldParams)
      this.setState({ isLoading: false })
      this.props.navigator.pop()
    } catch (error) {
      console.error("CreditCardForm.tsx", error)
      this.setState({ isError: true, isLoading: false })
    }
  }

  render() {
    const buttonComponent = (
      <Box p={2} mb={2}>
        <Button
          testID="add-credit-card-button"
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
        <FancyModalHeader onLeftButtonPress={() => this.props.navigator?.pop()}>
          Add credit card
        </FancyModalHeader>
        <ScrollView scrollEnabled={false}>
          <Container m={0}>
            <View>
              <Box m={2}>
                <CreditCardField
                  onCardChange={(cardDetails) => {
                    this.setState({
                      valid: cardDetails.complete,
                      params: {
                        expiryMonth: cardDetails.expiryMonth,
                        expiryYear: cardDetails.expiryYear,
                        last4: cardDetails.last4,
                      },
                    })
                  }}
                />
                {!!this.state.isError && (
                  <Text testID="error-message" variant="xs" mt={4} color="red100">
                    {errorText}
                  </Text>
                )}

                <Spacer y={2} />

                <Text variant="sm" color="black60">
                  Registration is free.
                  {"\n"}
                  {"\n"}A valid credit card is required in order to bid. Please enter your credit
                  card information below. The name on your Artsy account must match the name on the
                  card.
                </Text>
              </Box>
            </View>
          </Container>
        </ScrollView>
      </BottomAlignedButtonWrapper>
    )
  }
}
