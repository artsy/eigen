import { Box, Button, Sans, Serif } from "@artsy/palette"
import { get, isEmpty } from "lodash"
import React from "react"
import { NativeModules, View, ViewProperties } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import stripe from "tipsi-stripe"

import { Schema, screenTrack } from "../../../utils/track"

import SwitchBoard from "lib/NativeModules/SwitchBoard"

import { Flex } from "../Elements/Flex"

import { Modal } from "lib/Components/Modal"
import { LinkText } from "../../Text/LinkText"
import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
import { Checkbox } from "../Components/Checkbox"
import { Container } from "../Components/Containers"
import { PaymentInfo } from "../Components/PaymentInfo"
import { Timer } from "../Components/Timer"
import { Title } from "../Components/Title"
import { Address, PaymentCardTextFieldParams, StripeToken } from "../types"

import { Registration_me } from "__generated__/Registration_me.graphql"
import { Registration_sale } from "__generated__/Registration_sale.graphql"

import { RegistrationCreateBidderMutation } from "__generated__/RegistrationCreateBidderMutation.graphql"
import { RegistrationCreateCreditCardMutation } from "__generated__/RegistrationCreateCreditCardMutation.graphql"
import { RegistrationUpdateUserMutation } from "__generated__/RegistrationUpdateUserMutation.graphql"
import { RegistrationResult, RegistrationStatus } from "./RegistrationResult"

const Emission = NativeModules.Emission || {}

stripe.setOptions({ publishableKey: Emission.stripePublishableKey })

export interface RegistrationProps extends ViewProperties {
  sale: Registration_sale
  me: Registration_me
  relay: RelayProp
  navigator?: NavigatorIOS
}

interface RegistrationState {
  billingAddress?: Address
  creditCardFormParams?: PaymentCardTextFieldParams
  creditCardToken?: StripeToken
  conditionsOfSaleChecked: boolean
  isLoading: boolean
  requiresPaymentInformation: boolean
  errorModalVisible: boolean
  errorModalDetailText: string
}

@screenTrack({
  context_screen: Schema.PageNames.BidFlowRegistration,
  context_screen_owner_type: null,
})
export class Registration extends React.Component<RegistrationProps, RegistrationState> {
  constructor(props) {
    super(props)

    const { has_credit_cards } = this.props.me
    const requiresPaymentInformation = !has_credit_cards

    this.state = {
      billingAddress: null,
      creditCardToken: null,
      creditCardFormParams: null,
      conditionsOfSaleChecked: false,
      requiresPaymentInformation,
      isLoading: false,
      errorModalVisible: false,
      errorModalDetailText: "",
    }
  }

  canCreateBidder() {
    const { billingAddress, creditCardToken, conditionsOfSaleChecked } = this.state

    if (this.state.requiresPaymentInformation) {
      return billingAddress && creditCardToken && conditionsOfSaleChecked
    } else {
      return conditionsOfSaleChecked
    }
  }

  onPressConditionsOfSale = () => {
    SwitchBoard.presentModalViewController(this, "/conditions-of-sale?present_modally=true")
  }

  onCreditCardAdded(token: StripeToken, params: PaymentCardTextFieldParams) {
    this.setState({ creditCardToken: token, creditCardFormParams: params })
  }

  onBillingAddressAdded(values: Address) {
    this.setState({ billingAddress: values })
  }

  conditionsOfSalePressed() {
    this.setState({ conditionsOfSaleChecked: !this.state.conditionsOfSaleChecked })
  }

  async register() {
    this.setState({ isLoading: true })

    this.state.requiresPaymentInformation ? await this.setupAddressCardAndBidder() : await this.setupBidder()
  }

  /** Make a bid */
  async setupBidder() {
    await this.createBidder()
  }

  /** Run through the full flow setting up the user account and making a bid  */
  async setupAddressCardAndBidder() {
    try {
      await this.updatePhoneNumber()
      const token = await this.createTokenFromAddress()
      await this.createCreditCard(token)
      await this.createBidder()
    } catch (error) {
      if (!this.state.errorModalVisible) {
        this.presentRegistrationError(error, RegistrationStatus.RegistrationStatusError)
      }
    }
  }

  /**
   * Because the phone number lives on the user, not as credit card metadata, then we
   * need a separate call to update our User model to store that info
   */
  async updatePhoneNumber() {
    return new Promise((done, reject) => {
      const { phoneNumber } = this.state.billingAddress
      commitMutation<RegistrationUpdateUserMutation>(this.props.relay.environment, {
        onCompleted: (_, errors) => {
          if (errors && errors.length) {
            this.presentErrorModal(errors, null)
            reject(errors)
          } else {
            done()
          }
        },
        onError: error => {
          this.presentRegistrationError(error, RegistrationStatus.RegistrationStatusNetworkError)
        },
        mutation: graphql`
          mutation RegistrationUpdateUserMutation($input: UpdateMyProfileInput!) {
            updateMyUserProfile(input: $input) {
              clientMutationId
              user {
                phone
              }
            }
          }
        `,
        variables: { input: { phone: phoneNumber } },
      })
    })
  }

  async createTokenFromAddress() {
    const { billingAddress, creditCardFormParams } = this.state
    return stripe.createTokenWithCard({
      ...creditCardFormParams,
      name: billingAddress.fullName,
      addressLine1: billingAddress.addressLine1,
      addressLine2: billingAddress.addressLine2,
      addressCity: billingAddress.city,
      addressState: billingAddress.state,
      addressZip: billingAddress.postalCode,
      addressCountry: billingAddress.country.shortName,
    })
  }

  async createCreditCard(token: any) {
    return new Promise(done => {
      commitMutation<RegistrationCreateCreditCardMutation>(this.props.relay.environment, {
        onCompleted: (data, errors) => {
          if (data && get(data, "createCreditCard.creditCardOrError.creditCard")) {
            done()
          } else {
            if (isEmpty(errors)) {
              const mutationError = data && get(data, "createCreditCard.creditCardOrError.mutationError")
              this.presentErrorModal(mutationError, mutationError.detail)
            } else {
              this.presentErrorModal(errors, null)
            }
          }
        },
        onError: errors => this.presentRegistrationError(errors, RegistrationStatus.RegistrationStatusNetworkError),
        mutation: graphql`
          mutation RegistrationCreateCreditCardMutation($input: CreditCardInput!) {
            createCreditCard(input: $input) {
              creditCardOrError {
                ... on CreditCardMutationSuccess {
                  creditCard {
                    internalID
                    brand
                    name
                    last_digits: lastDigits
                    expiration_month: expirationMonth
                    expiration_year: expirationYear
                  }
                }
                ... on CreditCardMutationFailure {
                  mutationError {
                    type
                    message
                    detail
                  }
                }
              }
            }
          }
        `,
        variables: { input: { token: token.tokenId } },
      })
    })
  }

  createBidder() {
    commitMutation<RegistrationCreateBidderMutation>(this.props.relay.environment, {
      onCompleted: (results, errors) =>
        isEmpty(errors)
          ? this.presentRegistrationSuccess(results)
          : this.presentRegistrationError(errors, RegistrationStatus.RegistrationStatusError),
      onError: error => {
        this.presentRegistrationError(error, RegistrationStatus.RegistrationStatusNetworkError)
      },
      mutation: graphql`
        mutation RegistrationCreateBidderMutation($input: CreateBidderInput!) {
          createBidder(input: $input) {
            bidder {
              internalID
              qualified_for_bidding: qualifiedForBidding
            }
          }
        }
      `,
      // FIXME: Should this be slug or internalID?
      variables: { input: { saleID: this.props.sale.slug } },
    })
  }

  presentRegistrationSuccess({ createBidder }) {
    NativeModules.ARNotificationsManager.postNotificationName("ARAuctionArtworkRegistrationUpdated", {
      ARAuctionID: this.props.sale.slug,
    })

    const qualifiedForBidding = createBidder.bidder.qualified_for_bidding
    if (qualifiedForBidding === true) {
      this.presentRegistrationResult(RegistrationStatus.RegistrationStatusComplete)
    } else {
      this.presentRegistrationResult(RegistrationStatus.RegistrationStatusPending)
    }
  }

  presentRegistrationError(error, status) {
    console.error("Registration.tsx", error)
    this.presentRegistrationResult(status)
  }

  presentRegistrationResult(status: RegistrationStatus) {
    this.props.navigator.push({
      component: RegistrationResult,
      title: "",
      passProps: {
        status,
      },
    })

    this.setState({ isLoading: false })
  }

  presentErrorModal(errors, mutationMessage) {
    console.error("Registration.tsx", errors)

    const errorMessage =
      mutationMessage || "There was a problem processing your information. Check your payment details and try again."
    this.setState({ errorModalVisible: true, errorModalDetailText: errorMessage, isLoading: false })
  }

  closeModal() {
    this.setState({ errorModalVisible: false })
  }

  render() {
    const { live_start_at, end_at, is_preview, start_at } = this.props.sale
    const { isLoading } = this.state

    return (
      <BiddingThemeProvider>
        <Container m={0}>
          <View>
            <Flex alignItems="center">
              <Title mb={3}>Register to bid</Title>
              <Timer liveStartsAt={live_start_at} endsAt={end_at} isPreview={is_preview} startsAt={start_at} />
              <Serif size="4t" weight="semibold" my={5} mx={6} textAlign="center">
                {this.props.sale.name}
              </Serif>
            </Flex>

            {this.state.requiresPaymentInformation ? (
              <>
                <PaymentInfo
                  navigator={isLoading ? ({ push: () => null } as any) : this.props.navigator}
                  onCreditCardAdded={this.onCreditCardAdded.bind(this)}
                  onBillingAddressAdded={this.onBillingAddressAdded.bind(this)}
                  billingAddress={this.state.billingAddress}
                  creditCardFormParams={this.state.creditCardFormParams}
                  creditCardToken={this.state.creditCardToken}
                />
                <Sans mt="5" size="3t" color="black60" textAlign="center">
                  A valid credit card is required for bidding.
                </Sans>
              </>
            ) : (
              <Sans mx={6} size="4t" color="black60" textAlign="center">
                To complete your registration, please confirm that you agree to the Conditions of Sale.
              </Sans>
            )}

            <Modal
              visible={this.state.errorModalVisible}
              headerText="An error occurred"
              detailText={this.state.errorModalDetailText}
              closeModal={this.closeModal.bind(this)}
            />
          </View>

          <View>
            <Checkbox
              mb={4}
              justifyContent="center"
              onPress={() => this.conditionsOfSalePressed()}
              disabled={isLoading}
            >
              <Serif size="2" mt={2} color="black60">
                Agree to{" "}
                <LinkText onPress={isLoading ? null : this.onPressConditionsOfSale}>Conditions of Sale</LinkText>
              </Serif>
            </Checkbox>

            <Box m={4}>
              <Button
                onPress={this.canCreateBidder() ? this.register.bind(this) : null}
                loading={isLoading}
                block
                width={100}
                disabled={!this.canCreateBidder()}
              >
                Complete registration
              </Button>
            </Box>
          </View>
        </Container>
      </BiddingThemeProvider>
    )
  }
}

export const RegistrationScreen = createFragmentContainer(Registration, {
  sale: graphql`
    fragment Registration_sale on Sale {
      slug
      end_at: endAt
      is_preview: isPreview
      live_start_at: liveStartAt
      name
      start_at: startAt
    }
  `,
  me: graphql`
    fragment Registration_me on Me {
      has_credit_cards: hasCreditCards
    }
  `,
})
