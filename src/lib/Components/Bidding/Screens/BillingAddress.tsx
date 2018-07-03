import React from "react"

import { Schema, screenTrack, track } from "../../../utils/track"

import { NavigatorIOS, ScrollView, View } from "react-native"

import { Flex } from "../Elements/Flex"
import { Sans12, Serif16 } from "../Elements/Typography"

import { validatePresence } from "../Validators"

import { BackButton } from "../Components/BackButton"
import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
import { Button } from "../Components/Button"
import { Container } from "../Components/Containers"
import { Input } from "../Components/Input"
import { Title } from "../Components/Title"
import { Address } from "../types"

interface BillingAddressProps {
  onSubmit?: (values: Address) => void
  navigator?: NavigatorIOS
  billingAddress?: Address
}

interface BillingAddressState {
  values: Address
  errors: {
    fullName?: string
    addressLine1?: string
    addressLine2?: string
    city?: string
    state?: string
    postalCode?: string
  }
}

@screenTrack({
  context_screen: Schema.PageNames.BidFlowBillingAddressPage,
  context_screen_owner_type: null,
})
export class BillingAddress extends React.Component<BillingAddressProps, BillingAddressState> {
  constructor(props) {
    super(props)

    this.state = {
      values: { ...this.props.billingAddress },
      errors: {},
    }
  }

  validateAddress(address: Address) {
    const { fullName, addressLine1, city, state, postalCode } = address

    return {
      fullName: validatePresence(fullName),
      addressLine1: validatePresence(addressLine1),
      city: validatePresence(city),
      state: validatePresence(state),
      postalCode: validatePresence(postalCode),
    }
  }

  validateField(field: string) {
    this.setState({
      errors: { ...this.state.errors, [field]: this.validateAddress(this.state.values)[field] },
    })
  }

  onSubmit() {
    const errors = this.validateAddress(this.state.values)

    if (Object.keys(errors).filter(key => errors[key]).length > 0) {
      this.setState({ errors })
    } else {
      this.submitValidAddress()
    }
  }

  @track({
    action_type: Schema.ActionTypes.Success,
    action_name: Schema.ActionNames.BidFlowSaveBillingAddress,
  })
  submitValidAddress() {
    this.props.onSubmit(this.state.values)
    this.props.navigator.pop()
  }

  render() {
    return (
      <BiddingThemeProvider>
        <View>
          <BackButton navigator={this.props.navigator} />

          <ScrollView>
            <Container>
              <Title mt={0} mb={6}>
                Your billing address
              </Title>

              <StyledInput
                label="Full name"
                placeholder="Add your full name"
                autoCapitalize="words"
                {...this.propsForInput("fullName")}
              />

              <StyledInput
                label="Address line 1"
                placeholder="Add your street address"
                autoCapitalize="words"
                {...this.propsForInput("addressLine1")}
              />

              <StyledInput
                label="Address line 2 (optional)"
                placeholder="Add your apt, floor, suite, etc."
                autoCapitalize="words"
                {...this.propsForInput("addressLine2")}
              />

              <StyledInput label="City" placeholder="Add your city" {...this.propsForInput("city")} />

              <StyledInput
                label="State, Province, or Region"
                placeholder="Add your state, province, or region"
                autoCapitalize="words"
                {...this.propsForInput("state")}
              />

              <StyledInput
                label="Postal code"
                placeholder="Add your postal code"
                autoCapitalize="words"
                {...this.propsForInput("postalCode")}
              />

              <Button text="Add billing address" onPress={() => this.onSubmit()} />
            </Container>
          </ScrollView>
        </View>
      </BiddingThemeProvider>
    )
  }

  private propsForInput(field: string) {
    return {
      error: this.state.errors[field],
      onChangeText: value => this.setState({ values: { ...this.state.values, [field]: value } }),
      onBlur: () => this.validateField(field),
      value: this.state.values[field],
    }
  }
}

const StyledInput = ({ label, error, ...props }) => (
  <Flex mb={4}>
    <Serif16 mb={2}>{label}</Serif16>
    <Input mb={3} error={Boolean(error)} {...props} />
    {error && <Sans12 color="red100">{error}</Sans12>}
  </Flex>
)
