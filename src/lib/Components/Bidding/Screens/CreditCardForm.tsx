import { Fonts } from "lib/data/fonts"
import React, { Component } from "react"
import { NavigatorIOS, StyleSheet, View } from "react-native"
import stripe, { PaymentCardTextField, StripeToken } from "tipsi-stripe"

import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
import { Button } from "../Components/Button"
import { Container } from "../Components/Containers"
import { Title } from "../Components/Title"
import { Flex } from "../Elements/Flex"
import { theme } from "../Elements/Theme"
import { PaymentCardTextFieldParams } from "../types"

interface CreditCardFormProps {
  navigator?: NavigatorIOS
  onSubmit: (t: StripeToken, p: PaymentCardTextFieldParams) => void
}

interface CreditCardFormState {
  valid: boolean
  params: PaymentCardTextFieldParams
  isLoading: boolean
}

const styles = StyleSheet.create({
  field: {
    fontFamily: Fonts.GaramondRegular,
    height: 40,
    fontSize: theme.fontSizes[3],
    width: "100%",
    borderColor: theme.colors.purple100,
    borderWidth: 1,
    borderRadius: 0,
  },
})

export class CreditCardForm extends Component<CreditCardFormProps, CreditCardFormState> {
  state = {
    valid: false,
    params: {
      number: null,
      expMonth: null,
      expYear: null,
      cvc: null,
    },
    isLoading: false,
  }

  handleFieldParamsChange = (valid, params: PaymentCardTextFieldParams) => {
    this.setState({ valid, params })
  }

  tokenizeCardAndSubmit = async () => {
    this.setState({ isLoading: true })

    const { params } = this.state

    const token = await stripe.createTokenWithCard({
      ...params,
    })

    this.props.onSubmit(token, this.state.params)
    this.props.navigator.pop()
  }

  render() {
    return (
      <BiddingThemeProvider>
        <Container m={0}>
          <View>
            <Title>Your credit card</Title>

            <Flex m={4}>
              <PaymentCardTextField style={styles.field} onParamsChange={this.handleFieldParamsChange} />
            </Flex>
          </View>

          <View>
            <Flex m={4}>
              <Button text="Add credit card" onPress={this.state.valid ? () => this.tokenizeCardAndSubmit() : null} />
            </Flex>
          </View>
        </Container>
      </BiddingThemeProvider>
    )
  }
}
