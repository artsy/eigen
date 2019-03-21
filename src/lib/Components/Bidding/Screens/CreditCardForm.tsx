import { Sans } from "@artsy/palette"
import { Fonts } from "lib/data/fonts"
import React, { Component } from "react"
import { NavigatorIOS, ScrollView, StyleSheet, View } from "react-native"
import stripe, { PaymentCardTextField, StripeToken } from "tipsi-stripe"

import BottomAlignedButtonWrapper from "lib/Components/Buttons/BottomAlignedButtonWrapper"
import { BackButton } from "../Components/BackButton"
import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
import { Button } from "../Components/Button"
import { Container } from "../Components/Containers"
import { Title } from "../Components/Title"
import { Flex } from "../Elements/Flex"
import { theme } from "../Elements/Theme"
import { PaymentCardTextFieldParams } from "../types"

interface CreditCardFormProps {
  navigator?: NavigatorIOS
  params?: PaymentCardTextFieldParams
  onSubmit: (t: StripeToken, p: PaymentCardTextFieldParams) => void
}

interface CreditCardFormState {
  valid: boolean
  params: PaymentCardTextFieldParams
  isLoading: boolean
  isError: boolean
}

export class CreditCardForm extends Component<CreditCardFormProps, CreditCardFormState> {
  private paymentInfo: PaymentCardTextField

  constructor(props) {
    super(props)

    this.paymentInfo = (React as any).createRef()
    this.state = { valid: null, params: { ...this.props.params }, isLoading: false, isError: false }
  }

  componentDidMount() {
    if (this.paymentInfo.value) {
      this.paymentInfo.value.setParams(this.state.params)
      this.paymentInfo.value.focus()
    }
  }

  handleFieldParamsChange = (valid, params: PaymentCardTextFieldParams) => {
    this.setState({ valid, params })
  }

  tokenizeCardAndSubmit = async () => {
    this.setState({ isLoading: true, isError: false })

    const { params } = this.state

    try {
      const token = await stripe.createTokenWithCard({ ...params })
      this.props.onSubmit(token, this.state.params)
      this.setState({ isLoading: false })
      this.props.navigator.pop()
    } catch (error) {
      console.error("CreditCardForm.tsx", error)
      this.setState({ isError: true, isLoading: false })
    }
  }

  render() {
    const buttonComponent = (
      <Flex m={4}>
        <Button
          text="Add credit card"
          disabled={!this.state.valid}
          inProgress={this.state.isLoading}
          onPress={this.state.valid ? () => this.tokenizeCardAndSubmit() : null}
        />
      </Flex>
    )

    const styles = StyleSheet.create({
      field: {
        fontFamily: Fonts.GaramondRegular,
        height: 40,
        fontSize: theme.fontSizes[3],
        width: "100%",
        borderColor: this.state.isError ? theme.colors.red100 : theme.colors.purple100,
        borderWidth: 1,
        borderRadius: 0,
      },
    })

    const errorText = "There was an error. Please try again."

    return (
      <BiddingThemeProvider>
        <BottomAlignedButtonWrapper
          onPress={this.state.valid ? () => this.tokenizeCardAndSubmit() : null}
          buttonComponent={buttonComponent}
        >
          <BackButton navigator={this.props.navigator} />

          <ScrollView scrollEnabled={false}>
            <Container m={0}>
              <View>
                <Title>Your credit card</Title>

                <Flex m={4}>
                  <PaymentCardTextField
                    ref={this.paymentInfo}
                    style={styles.field}
                    onParamsChange={this.handleFieldParamsChange}
                    numberPlaceholder="Card number"
                    expirationPlaceholder="MM/YY"
                    cvcPlaceholde="CVC"
                  />
                  {this.state.isError && (
                    <Sans size="2" mt={3} color="red100">
                      {errorText}
                    </Sans>
                  )}
                </Flex>
              </View>
            </Container>
          </ScrollView>
        </BottomAlignedButtonWrapper>
      </BiddingThemeProvider>
    )
  }
}
