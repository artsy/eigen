import React from "react"

import { Schema, screenTrack, track } from "../../../utils/track"

import { Dimensions, KeyboardAvoidingView, NavigatorIOS, ScrollView, TouchableWithoutFeedback } from "react-native"

import { Flex } from "../Elements/Flex"
import { Sans12, Serif16 } from "../Elements/Typography"

import { validatePresence } from "../Validators"

import { BackButton } from "../Components/BackButton"
import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
import { Button } from "../Components/Button"
import { Container } from "../Components/Containers"
import { Input } from "../Components/Input"
import { Title } from "../Components/Title"
import { Address, Country } from "../types"

import { SelectCountry } from "./SelectCountry"

interface StyledInputInterface {
  /** The object which styled components wraps */
  root?: {
    focus?: () => void
    blur?: () => void
  }
}

const StyledInput = ({ label, error, ...props }) => (
  <Flex mb={4}>
    <Serif16 mb={2}>{label}</Serif16>
    <Input mb={3} error={Boolean(error)} {...props} />
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
    country?: string
    postalCode?: string
  }
}

@screenTrack({
  context_screen: Schema.PageNames.BidFlowBillingAddressPage,
  context_screen_owner_type: null,
})
export class BillingAddress extends React.Component<BillingAddressProps, BillingAddressState> {
  private addressLine1: StyledInputInterface
  private addressLine2: StyledInputInterface
  private city: StyledInputInterface
  private stateProvinceRegion: StyledInputInterface
  private postalCode: StyledInputInterface

  constructor(props) {
    super(props)

    this.state = {
      values: { ...this.props.billingAddress },
      errors: {},
    }
  }

  validateAddress(address: Address) {
    const { fullName, addressLine1, city, state, country, postalCode } = address

    return {
      fullName: validatePresence(fullName),
      addressLine1: validatePresence(addressLine1),
      city: validatePresence(city),
      state: validatePresence(state),
      country: validatePresence(country && country.shortName),
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

  onCountrySelected(country: Country) {
    const values = { ...this.state.values, country }

    this.setState({
      values,
      errors: {
        ...this.state.errors,
        country: this.validateAddress(values).country,
      },
    })
  }

  @track({
    action_type: Schema.ActionTypes.Success,
    action_name: Schema.ActionNames.BidFlowSaveBillingAddress,
  })
  submitValidAddress() {
    this.props.onSubmit(this.state.values)
    this.props.navigator.pop()
  }

  presentSelectCountry() {
    this.props.navigator.push({
      component: SelectCountry,
      title: "",
      passProps: {
        country: this.state.values.country,
        onCountrySelected: this.onCountrySelected.bind(this),
      },
    })
  }

  render() {
    const errorForCountry = this.state.errors.country

    // TODO: Remove this once React Native has been updated
    const isPhoneX = Dimensions.get("window").height === 812 && Dimensions.get("window").width === 375
    const defaultVerticalOffset = isPhoneX ? 30 : 15

    return (
      <BiddingThemeProvider>
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={defaultVerticalOffset} style={{ flex: 1 }}>
          <BackButton navigator={this.props.navigator} />

          <ScrollView>
            <Container>
              <Title mt={0} mb={6}>
                Your billing address
              </Title>

              <StyledInput
                {...this.defaultPropsForInput("fullName")}
                label="Full name"
                placeholder="Add your full name"
                autoFocus={true}
                onSubmitEditing={() => this.addressLine1.root.focus()}
              />

              <StyledInput
                {...this.defaultPropsForInput("addressLine1")}
                label="Address line 1"
                placeholder="Add your street address"
                onSubmitEditing={() => this.addressLine2.root.focus()}
              />

              <StyledInput
                {...this.defaultPropsForInput("addressLine2")}
                label="Address line 2 (optional)"
                placeholder="Add your apt, floor, suite, etc."
                onSubmitEditing={() => this.city.root.focus()}
              />

              <StyledInput
                {...this.defaultPropsForInput("city")}
                label="City"
                placeholder="Add your city"
                onSubmitEditing={() => this.stateProvinceRegion.root.focus()}
              />

              <StyledInput
                {...this.defaultPropsForInput("state")}
                label="State, Province, or Region"
                placeholder="Add state, province, or region"
                onSubmitEditing={() => this.postalCode.root.focus()}
                inputRef={el => (this.stateProvinceRegion = el)}
              />

              <StyledInput
                {...this.defaultPropsForInput("postalCode")}
                label="Postal code"
                placeholder="Add your postal code"
                onSubmitEditing={() => this.presentSelectCountry()}
              />

              <Flex mb={4}>
                <Serif16 mb={2}>Country</Serif16>

                <TouchableWithoutFeedback onPress={() => this.presentSelectCountry()}>
                  <Flex mb={3} p={3} pb={2} border={1} borderColor={errorForCountry ? "red100" : "black10"}>
                    {this.state.values.country ? (
                      <Serif16>{this.state.values.country.longName}</Serif16>
                    ) : (
                      <Serif16 color="black30">Select your country</Serif16>
                    )}
                  </Flex>
                </TouchableWithoutFeedback>

                {errorForCountry && <Sans12 color="red100">{errorForCountry}</Sans12>}
              </Flex>

              <Button text="Add billing address" onPress={() => this.onSubmit()} />
            </Container>
          </ScrollView>
        </KeyboardAvoidingView>
      </BiddingThemeProvider>
    )
  }

  private defaultPropsForInput(field: string) {
    return {
      autoCapitalize: "words",
      error: this.state.errors[field],
      inputRef: el => (this[field] = el),
      onBlur: () => this.validateField(field),
      onChangeText: value => this.setState({ values: { ...this.state.values, [field]: value } }),
      returnKeyType: "next",
      value: this.state.values[field],
    }
  }
}
