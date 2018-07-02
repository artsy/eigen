import React from "react"

import { Schema, screenTrack, track } from "../../../utils/track"

import { Dimensions, KeyboardAvoidingView, NavigatorIOS, ScrollView, TextInputProperties, View } from "react-native"

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

interface StyledInputInterface {
  /** The object which styled components wraps */
  root?: {
    focus?: () => void
    blur?: () => void
  }
}

const StyledInput = ({ label, error, refName, createCustomRef, ...props }) => (
  <Flex mb={4}>
    <Serif16 mb={2}>{label}</Serif16>
    <Input mb={3} error={Boolean(error)} refName={refName} createCustomRef={createCustomRef} {...props} />
    {error && <Sans12 color="red100">{error}</Sans12>}
  </Flex>
)

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
  private fullName: StyledInputInterface
  private addressLine1: StyledInputInterface
  private addressLine2: StyledInputInterface
  private city: StyledInputInterface
  private stateProvinceRegion: StyledInputInterface
  private postalCode: StyledInputInterface

  constructor(props) {
    super(props)

    this.selectNextInput = this.selectNextInput.bind(this)

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

  selectNextInput = nextComponent => {
    const inputs = [
      this.fullName,
      this.addressLine1,
      this.addressLine2,
      this.city,
      this.stateProvinceRegion,
      this.postalCode,
    ]

    for (const input of inputs) {
      if (input === nextComponent) {
        input.root.focus()
      } else {
        input.root.blur()
      }
    }
  }

  createCustomRef(refName: string, component: any) {
    if (component) {
      return (this[refName] = component)
    }
  }

  render() {
    // TODO: Remove this once React Native has been updated
    const isPhoneX = Dimensions.get("window").height === 812 && Dimensions.get("window").width === 375
    const defaultVerticalOffset = isPhoneX ? 30 : 15

    return (
      <BiddingThemeProvider>
        <View>
          <BackButton navigator={this.props.navigator} />

          <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={defaultVerticalOffset} style={{ flex: 1 }}>
            <ScrollView>
              <Container>
                <Title mt={0} mb={6}>
                  Your billing address
                </Title>

                <StyledInput
                  label="Full name"
                  placeholder="Enter your full name"
                  autoCapitalize="words"
                  autoFocus={true}
                  returnKeyType="next"
                  refName="fullName"
                  createCustomRef={this.createCustomRef.bind(this)}
                  onSubmitEditing={() => this.selectNextInput(this.addressLine1)}
                  {...this.propsForInput("fullName")}
                />

                <StyledInput
                  label="Address line 1"
                  placeholder="Enter your street address"
                  autoCapitalize="words"
                  returnKeyType="next"
                  refName="addressLine1"
                  createCustomRef={this.createCustomRef.bind(this)}
                  onSubmitEditing={() => this.selectNextInput(this.addressLine2)}
                  {...this.propsForInput("addressLine1")}
                />

                <StyledInput
                  label="Address line 2 (optional)"
                  placeholder="Enter your apt, floor, suite, etc."
                  autoCapitalize="words"
                  returnKeyType="next"
                  refName="addressLine2"
                  createCustomRef={this.createCustomRef.bind(this)}
                  onSubmitEditing={() => this.selectNextInput(this.city)}
                  {...this.propsForInput("addressLine2")}
                />

                <StyledInput
                  label="City"
                  placeholder="Enter city"
                  returnKeyType="next"
                  refName="city"
                  createCustomRef={this.createCustomRef.bind(this)}
                  onSubmitEditing={() => this.selectNextInput(this.stateProvinceRegion)}
                  {...this.propsForInput("city")}
                />

                <StyledInput
                  label="State, Province, or Region"
                  placeholder="Enter state, province, or region"
                  autoCapitalize="words"
                  returnKeyType="next"
                  refName="stateProvinceRegion"
                  createCustomRef={this.createCustomRef.bind(this)}
                  onSubmitEditing={() => this.selectNextInput(this.postalCode)}
                  {...this.propsForInput("state")}
                />

                <StyledInput
                  label="Postal code"
                  placeholder="Enter your postal code"
                  autoCapitalize="words"
                  refName="postalCode"
                  createCustomRef={this.createCustomRef.bind(this)}
                  {...this.propsForInput("postalCode")}
                />

                <Button text="Add billing address" onPress={() => this.onSubmit()} />
              </Container>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </BiddingThemeProvider>
    )
  }

  private propsForInput(field: string) {
    return {
      error: this.state.errors[field],
      onChangeText: value => this.setState({ values: { ...this.state.values, [field]: value } }),
      customOnBlur: () => this.validateField(field),
      value: this.state.values[field],
    }
  }
}
