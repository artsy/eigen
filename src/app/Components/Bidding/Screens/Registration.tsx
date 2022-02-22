import { Registration_me } from "__generated__/Registration_me.graphql"
import { Registration_sale } from "__generated__/Registration_sale.graphql"
import { RegistrationCreateBidderMutation } from "__generated__/RegistrationCreateBidderMutation.graphql"
import { RegistrationCreateCreditCardMutation } from "__generated__/RegistrationCreateCreditCardMutation.graphql"
import { RegistrationQuery } from "__generated__/RegistrationQuery.graphql"
import { RegistrationUpdateUserMutation } from "__generated__/RegistrationUpdateUserMutation.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { Modal } from "lib/Components/Modal"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { dismissModal, navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import NavigatorIOS from "lib/utils/__legacy_do_not_use__navigator-ios-shim"
import { bidderNeedsIdentityVerification } from "lib/utils/auction"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { saleTime } from "lib/utils/saleTime"
import { Schema, screenTrack } from "lib/utils/track"
import { get, isEmpty } from "lodash"
import { Box, Button, Flex, Text } from "palette"
import { Checkbox } from "palette/elements/Checkbox"
import React from "react"
import { ScrollView, View, ViewProps } from "react-native"
import {
  commitMutation,
  createFragmentContainer,
  graphql,
  QueryRenderer,
  RelayProp,
} from "react-relay"
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import stripe from "tipsi-stripe"
import { LinkText } from "../../Text/LinkText"
import { PaymentInfo } from "../Components/PaymentInfo"
import { Address, PaymentCardTextFieldParams, StripeToken } from "../types"
import { RegistrationResult, RegistrationStatus } from "./RegistrationResult"

export interface RegistrationProps extends ViewProps {
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

const Hint: React.FC = ({ children }) => (
  <Text variant="xs" fontSize={12} mb="4">
    {children}
  </Text>
)

@screenTrack({
  context_screen: Schema.PageNames.BidFlowRegistration,
  context_screen_owner_type: null,
})
export class Registration extends React.Component<RegistrationProps, RegistrationState> {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  constructor(props) {
    super(props)

    const { hasCreditCards } = this.props.me
    const requiresPaymentInformation = !hasCreditCards

    this.state = {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      billingAddress: null,
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      creditCardToken: null,
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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
    navigate("/conditions-of-sale", { modal: true })
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

    this.state.requiresPaymentInformation
      ? await this.setupAddressCardAndBidder()
      : await this.setupBidder()
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
        this.presentErrorModal(error, null)
      }
    }
  }

  /**
   * Because the phone number lives on the user, not as credit card metadata, then we
   * need a separate call to update our User model to store that info
   */
  async updatePhoneNumber() {
    const errorMessage = "There was a problem processing your phone number, please try again."

    return new Promise<void>((done, reject) => {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      const { phoneNumber } = this.state.billingAddress
      commitMutation<RegistrationUpdateUserMutation>(this.props.relay.environment, {
        onCompleted: (_, errors) => {
          if (errors && errors.length) {
            this.presentErrorModal(errors, errorMessage)
            reject(errors)
          } else {
            done()
          }
        },
        onError: (error) => {
          this.presentErrorModal(error, errorMessage)
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
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      name: billingAddress.fullName,
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      addressLine1: billingAddress.addressLine1,
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      addressLine2: billingAddress.addressLine2,
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      addressCity: billingAddress.city,
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      addressState: billingAddress.state,
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      addressZip: billingAddress.postalCode,
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      addressCountry: billingAddress.country.shortName,
    })
  }

  async createCreditCard(token: any) {
    return new Promise<void>((done) => {
      commitMutation<RegistrationCreateCreditCardMutation>(this.props.relay.environment, {
        onCompleted: (data, errors) => {
          if (data && get(data, "createCreditCard.creditCardOrError.creditCard")) {
            done()
          } else {
            if (isEmpty(errors)) {
              const mutationError =
                data && get(data, "createCreditCard.creditCardOrError.mutationError")
              this.presentErrorModal(mutationError, mutationError.detail)
            } else {
              this.presentErrorModal(errors, null)
            }
          }
        },
        onError: (errors) => this.presentErrorModal(errors, null),
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
          : this.presentErrorModal(errors, null),
      onError: (error) => this.presentErrorModal(error, null),
      mutation: graphql`
        mutation RegistrationCreateBidderMutation($input: CreateBidderInput!) {
          createBidder(input: $input) {
            bidder {
              internalID
              qualified_for_bidding: qualifiedForBidding
              sale {
                registrationStatus {
                  qualifiedForBidding
                }
              }
            }
          }
        }
      `,
      // FIXME: Should this be slug or internalID?
      variables: { input: { saleID: this.props.sale.slug } },
    })
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  presentRegistrationSuccess({ createBidder }) {
    LegacyNativeModules.ARNotificationsManager.postNotificationName(
      "ARAuctionArtworkRegistrationUpdated",
      {
        ARAuctionID: this.props.sale.slug,
      }
    )

    const qualifiedForBidding = createBidder.bidder.qualified_for_bidding
    if (qualifiedForBidding === true) {
      this.presentRegistrationResult(RegistrationStatus.RegistrationStatusComplete)
    } else {
      this.presentRegistrationResult(RegistrationStatus.RegistrationStatusPending)
    }
  }

  presentRegistrationResult(status: RegistrationStatus) {
    const { sale, me, navigator } = this.props

    navigator?.push({
      component: RegistrationResult,
      title: "",
      passProps: {
        status,
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        needsIdentityVerification: bidderNeedsIdentityVerification({ sale, user: me }),
      },
    })

    this.setState({ isLoading: false })
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  presentErrorModal(errors, mutationMessage) {
    console.error("Registration.tsx", errors)

    const errorMessage =
      mutationMessage ||
      "There was a problem processing your information. Check your payment details and try again."
    this.setState({ errorModalVisible: true, errorModalDetailText: errorMessage, isLoading: false })
  }

  closeModal() {
    this.setState({ errorModalVisible: false })
  }

  render() {
    const { sale, me } = this.props
    const { isLoading, requiresPaymentInformation } = this.state

    const saleTimeDetails = saleTime(sale)

    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
        keyboardDismissMode="on-drag"
      >
        <Box p={20} pt={25} flex={1}>
          <Text fontSize={16} variant="xs" mb="2">
            {sale.name}
          </Text>

          {saleTimeDetails.absolute !== null && (
            <Text fontSize={12} variant="md" color="black60">
              {saleTimeDetails.absolute}
            </Text>
          )}
        </Box>

        {!!requiresPaymentInformation && (
          <Flex flex={1} py={20}>
            <PaymentInfo
              navigator={isLoading ? ({ push: () => null } as any) : this.props.navigator}
              onCreditCardAdded={this.onCreditCardAdded.bind(this)}
              onBillingAddressAdded={this.onBillingAddressAdded.bind(this)}
              billingAddress={this.state.billingAddress}
              creditCardFormParams={this.state.creditCardFormParams}
              creditCardToken={this.state.creditCardToken}
            />
          </Flex>
        )}
        <Flex px={20} flex={1}>
          {!!requiresPaymentInformation && <Hint>A valid credit card is required.</Hint>}
          {
            // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            !!bidderNeedsIdentityVerification({ sale, user: me }) && (
              <>
                <Hint>This auction requires Artsy to verify your identity before bidding.</Hint>
                <Hint>
                  After you register, you’ll receive an email with a link to complete identity
                  verification.
                </Hint>
              </>
            )
          }
          {
            // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            !requiresPaymentInformation && !bidderNeedsIdentityVerification({ sale, user: me }) && (
              <Hint>
                To complete your registration, please confirm that you agree to the Conditions of
                Sale.
              </Hint>
            )
          }
          <Modal
            visible={this.state.errorModalVisible}
            headerText="An error occurred"
            detailText={this.state.errorModalDetailText}
            closeModal={this.closeModal.bind(this)}
          />
          <Checkbox mb={4} onPress={() => this.conditionsOfSalePressed()} disabled={isLoading}>
            <Text variant="xs" fontSize="2">
              Agree to{" "}
              <LinkText onPress={isLoading ? undefined : this.onPressConditionsOfSale}>
                Conditions of Sale
              </LinkText>
            </Text>
          </Checkbox>
        </Flex>

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
      </ScrollView>
    )
  }
}

const RegistrationContainer = createFragmentContainer(Registration, {
  sale: graphql`
    fragment Registration_sale on Sale {
      slug
      endAt
      isPreview
      liveStartAt
      name
      startAt
      requireIdentityVerification
      timeZone
    }
  `,
  me: graphql`
    fragment Registration_me on Me {
      hasCreditCards
      identityVerified
    }
  `,
})

export const RegistrationQueryRenderer: React.FC<{ saleID: string; navigator: NavigatorIOS }> = ({
  saleID,
  navigator,
}) => {
  return (
    <View style={{ flex: 1 }}>
      <FancyModalHeader onLeftButtonPress={dismissModal} useXButton>
        Register to bid
      </FancyModalHeader>
      <QueryRenderer<RegistrationQuery>
        environment={defaultEnvironment}
        query={graphql`
          query RegistrationQuery($saleID: String!) {
            sale(id: $saleID) {
              name
              ...Registration_sale
            }
            me {
              ...Registration_me
            }
          }
        `}
        cacheConfig={{ force: true }} // We want to always fetch latest sale registration status, CC info, etc.
        variables={{
          saleID,
        }}
        render={renderWithLoadProgress((props) => (
          <RegistrationContainer {...(props as any)} navigator={navigator} />
        ))}
      />
    </View>
  )
}
