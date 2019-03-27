import { Sans, Serif } from "@artsy/palette"
import React from "react"

import { Schema, screenTrack, track } from "../../../utils/track"

import {
  Dimensions,
  EmitterSubscription,
  Keyboard,
  KeyboardAvoidingView,
  LayoutRectangle,
  NavigatorIOS,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native"

import { Flex } from "../Elements/Flex"

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

const StyledInput = ({ label, error, onLayout, ...props }) => (
  <Flex mb={4} onLayout={onLayout}>
    <Serif size="3" mb={2}>
      {label}
    </Serif>
    <Input mb={3} error={Boolean(error)} {...props} />
    {!!error && (
      <Sans size="2" color="red100">
        {error}
      </Sans>
    )}
  </Flex>
)

const iOSAccessoryViewHeight = 60

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
  private phoneNumber: StyledInputInterface

  private fullNameLayout: LayoutRectangle
  private addressLine1Layout: LayoutRectangle
  private addressLine2Layout: LayoutRectangle
  private cityLayout: LayoutRectangle
  private stateProvinceRegionLayout: LayoutRectangle
  private postalCodeLayout: LayoutRectangle
  private phoneNumberLayout: LayoutRectangle

  private keyboardDidShowListener: EmitterSubscription

  private keyboardHeight: number

  private scrollView: ScrollView

  constructor(props) {
    super(props)

    this.state = {
      values: { ...this.props.billingAddress },
      errors: {},
    }
  }

  validateAddress(address: Address) {
    const { fullName, addressLine1, city, state, country, postalCode, phoneNumber } = address

    return {
      fullName: validatePresence(fullName),
      addressLine1: validatePresence(addressLine1),
      city: validatePresence(city),
      state: validatePresence(state),
      country: validatePresence(country && country.shortName),
      postalCode: validatePresence(postalCode),
      phoneNumber: validatePresence(phoneNumber),
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

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      ({ endCoordinates }) => (this.keyboardHeight = endCoordinates.height)
    )
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
  }

  render() {
    const errorForCountry = this.state.errors.country

    return (
      <BiddingThemeProvider>
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={this.verticalOffset} style={{ flex: 1 }}>
          <BackButton navigator={this.props.navigator} />

          <ScrollView ref={scrollView => (this.scrollView = scrollView as any)}>
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
                onLayout={({ nativeEvent }) => (this.fullNameLayout = nativeEvent.layout)}
                onFocus={() => this.scrollView.scrollTo({ x: 0, y: this.yPosition(this.fullNameLayout) })}
              />

              <StyledInput
                {...this.defaultPropsForInput("addressLine1")}
                label="Address line 1"
                placeholder="Add your street address"
                onSubmitEditing={() => this.addressLine2.root.focus()}
                onLayout={({ nativeEvent }) => (this.addressLine1Layout = nativeEvent.layout)}
                onFocus={() => this.scrollView.scrollTo({ x: 0, y: this.yPosition(this.addressLine1Layout) })}
              />

              <StyledInput
                {...this.defaultPropsForInput("addressLine2")}
                label="Address line 2 (optional)"
                placeholder="Add your apt, floor, suite, etc."
                onSubmitEditing={() => this.city.root.focus()}
                onLayout={({ nativeEvent }) => (this.addressLine2Layout = nativeEvent.layout)}
                onFocus={() => this.scrollView.scrollTo({ x: 0, y: this.yPosition(this.addressLine2Layout) })}
              />

              <StyledInput
                {...this.defaultPropsForInput("city")}
                label="City"
                placeholder="Add your city"
                onSubmitEditing={() => this.stateProvinceRegion.root.focus()}
                onLayout={({ nativeEvent }) => (this.cityLayout = nativeEvent.layout)}
                onFocus={() => this.scrollView.scrollTo({ x: 0, y: this.yPosition(this.cityLayout) })}
              />

              <StyledInput
                {...this.defaultPropsForInput("state")}
                label="State, Province, or Region"
                placeholder="Add state, province, or region"
                onSubmitEditing={() => this.postalCode.root.focus()}
                inputRef={el => (this.stateProvinceRegion = el)}
                onLayout={({ nativeEvent }) => (this.stateProvinceRegionLayout = nativeEvent.layout)}
                onFocus={() =>
                  this.scrollView.scrollTo({
                    x: 0,
                    y: this.yPosition(this.stateProvinceRegionLayout),
                  })
                }
              />

              <StyledInput
                {...this.defaultPropsForInput("postalCode")}
                label="Postal code"
                placeholder="Add your postal code"
                onSubmitEditing={() => this.phoneNumber.root.focus()}
                onLayout={({ nativeEvent }) => (this.postalCodeLayout = nativeEvent.layout)}
                onFocus={() => this.scrollView.scrollTo({ x: 0, y: this.yPosition(this.postalCodeLayout) })}
              />

              <StyledInput
                {...this.defaultPropsForInput("phoneNumber")}
                label="Phone"
                placeholder="Add your phone number"
                onSubmitEditing={() => this.presentSelectCountry()}
                onLayout={({ nativeEvent }) => (this.phoneNumberLayout = nativeEvent.layout)}
                onFocus={() => this.scrollView.scrollTo({ x: 0, y: this.yPosition(this.phoneNumberLayout) })}
              />

              <Flex mb={4}>
                <Serif size="3" mb={2}>
                  Country
                </Serif>

                <TouchableWithoutFeedback onPress={() => this.presentSelectCountry()}>
                  <Flex mb={3} p={3} pb={2} border={1} borderColor={errorForCountry ? "red100" : "black10"}>
                    {this.state.values.country ? (
                      <Serif size="3">{this.state.values.country.longName}</Serif>
                    ) : (
                      <Serif size="3" color="black30">
                        Select your country
                      </Serif>
                    )}
                  </Flex>
                </TouchableWithoutFeedback>

                {!!errorForCountry && (
                  <Sans size="2" color="red100">
                    {errorForCountry}
                  </Sans>
                )}
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

  private yPosition({ y, height }) {
    const windowHeight = Dimensions.get("window").height

    return Math.max(0, y - windowHeight + height + iOSAccessoryViewHeight + this.keyboardHeight + this.iPhoneXOffset)
  }

  private get verticalOffset() {
    return this.iPhoneXOffset + 15
  }

  // TODO: Remove this once React Native has been updated
  private get iPhoneXOffset() {
    const isPhoneX = Dimensions.get("window").height === 812 && Dimensions.get("window").width === 375

    return isPhoneX ? 15 : 0
  }
}
