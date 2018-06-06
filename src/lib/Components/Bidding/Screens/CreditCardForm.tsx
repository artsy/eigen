import { Fonts } from "lib/data/fonts"
import React, { Component } from "react"
import { NavigatorIOS, StyleSheet, View } from "react-native"
import { PaymentCardTextField } from "tipsi-stripe"
import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
import { Button } from "../Components/Button"
import { Title } from "../Components/Title"
import { Flex } from "../Elements/Flex"
import { theme } from "../Elements/Theme"
import { PaymentCardTextFieldParams } from "./ConfirmFirstTimeBid"

interface CreditCardFormProps {
  navigator?: NavigatorIOS
  onSubmit: (p: PaymentCardTextFieldParams) => void
}

interface CreditCardFormState {
  valid: boolean
  params: PaymentCardTextFieldParams
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
  }

  handleFieldParamsChange = (valid, params: PaymentCardTextFieldParams) => {
    this.setState({ valid, params })
  }

  onSubmit() {
    if (this.state.valid) {
      this.props.onSubmit(this.state.params)
      this.props.navigator.pop()
    }
  }

  render() {
    return (
      <BiddingThemeProvider>
        <View>
          <Title>Your credit card</Title>

          <Flex m={4}>
            <PaymentCardTextField style={styles.field} onParamsChange={this.handleFieldParamsChange} />
          </Flex>

          <Button text="Add credit card" onPress={() => this.onSubmit()} />
        </View>
      </BiddingThemeProvider>
    )
  }
}
