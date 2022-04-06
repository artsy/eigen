import { captureException } from "@sentry/react-native"
import { Registration_me } from "__generated__/Registration_me.graphql"
import { Registration_sale } from "__generated__/Registration_sale.graphql"
import { RegistrationCreateBidderMutation } from "__generated__/RegistrationCreateBidderMutation.graphql"
import { RegistrationCreateCreditCardMutation } from "__generated__/RegistrationCreateCreditCardMutation.graphql"
import { RegistrationQuery } from "__generated__/RegistrationQuery.graphql"
import { RegistrationUpdateUserMutation } from "__generated__/RegistrationUpdateUserMutation.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Modal } from "app/Components/Modal"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { dismissModal, navigate } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { bidderNeedsIdentityVerification } from "app/utils/auction"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { saleTime } from "app/utils/saleTime"
import { Schema, screenTrack } from "app/utils/track"
import { get, isEmpty } from "lodash"
import { Box, Button, Flex, LinkText, Text } from "palette"
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
import { PaymentInfo } from "../Components/PaymentInfo"
import { PhoneInfo } from "../Components/PhoneInfo"
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
  phoneNumber?: string
  creditCardFormParams?: PaymentCardTextFieldParams
  creditCardToken?: StripeToken
  conditionsOfSaleChecked: boolean
  isLoading: boolean
  missingInformation: "payment" | "phone" | null
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

    const { me } = this.props

    let missingInformation: RegistrationState["missingInformation"] = null
    if (!me.hasCreditCards) {
      missingInformation = "payment"
    } else if (!me.phoneNumber?.isValid) {
      missingInformation = "phone"
    }

    this.state = {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      billingAddress: null,
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      creditCardToken: null,
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      creditCardFormParams: null,
      conditionsOfSaleChecked: false,
      missingInformation,
      isLoading: false,
      errorModalVisible: false,
      errorModalDetailText: "",
      phoneNumber: me.phoneNumber?.display || "",
    }
  }

  canCreateBidder() {
    const {
      billingAddress,
      creditCardToken,
      conditionsOfSaleChecked,
      phoneNumber,
      missingInformation: requiredInfo,
    } = this.state
    if (!conditionsOfSaleChecked) {
      return false
    }

    if (requiredInfo === "payment") {
      return billingAddress && creditCardToken
    } else if (requiredInfo === "phone") {
      return phoneNumber
    }
    return true
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

  onPhoneAdded(phoneNumber: string) {
    this.setState({ phoneNumber })
  }

  conditionsOfSalePressed() {
    this.setState({ conditionsOfSaleChecked: !this.state.conditionsOfSaleChecked })
  }

  async register() {
    this.setState({ isLoading: true })

    if (this.state.missingInformation === "payment") {
      await this.setupAddressCardAndBidder()
    } else if (this.state.missingInformation === "phone") {
      await this.setupPhoneNumberAndBidder()
    } else {
      await this.setupBidder()
    }
  }

  /** Make a bid */
  async setupBidder() {
    await this.createBidder()
  }

  async setupPhoneNumberAndBidder() {
    try {
      const { phoneNumber } = this.state
      await this.updatePhoneNumber(phoneNumber!)
      await this.createBidder()
    } catch (e) {
      if (__DEV__) {
        console.error(e)
      } else {
        captureException(e)
      }
      if (!this.state.errorModalVisible) {
        this.presentErrorModal(e, null)
      }
    }
  }

  /** Run through the full flow setting up the user account and making a bid  */
  async setupAddressCardAndBidder() {
    try {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      const { phoneNumber } = this.state.billingAddress
      await this.updatePhoneNumber(phoneNumber)

      const token = await this.createTokenFromAddress()
      await this.createCreditCard(token)

      await this.createBidder()
    } catch (e) {
      if (__DEV__) {
        console.error(e)
      } else {
        captureException(e)
      }
      if (!this.state.errorModalVisible) {
        this.presentErrorModal(e, null)
      }
    }
  }

  /**
   * Because the phone number lives on the user, not as credit card metadata, then we
   * need a separate call to update our User model to store that info
   */
  async updatePhoneNumber(phoneNumber: string) {
    const errorMessage = "There was a problem processing your phone number, please try again."

    return new Promise<void>((done, reject) => {
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
      name: billingAddress!.fullName,
      addressLine1: billingAddress!.addressLine1,
      addressLine2: billingAddress!.addressLine2,
      addressCity: billingAddress!.city,
      addressState: billingAddress!.state,
      addressZip: billingAddress!.postalCode,
      addressCountry: billingAddress!.country.shortName,
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

  renderRequiredInfoForm(): JSX.Element | undefined {
    const { missingInformation, isLoading } = this.state

    if (missingInformation === "payment") {
      return (
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
      )
    } else if (missingInformation === "phone") {
      return (
        <Flex justifyContent="center" py={20}>
          <PhoneInfo
            navigator={isLoading ? ({ push: () => null } as any) : this.props.navigator}
            onPhoneAdded={this.onPhoneAdded.bind(this)}
            phoneNumber={this.state.phoneNumber}
          />
        </Flex>
      )
    }
  }

  renderRequiredInfoHint(): JSX.Element | undefined {
    const { missingInformation } = this.state
    if (missingInformation === "payment") {
      return <Hint>A valid credit card is required.</Hint>
    } else if (missingInformation === "phone") {
      return <Hint>A valid phone number is required.</Hint>
    }
  }

  render() {
    const { sale, me } = this.props
    const { isLoading, missingInformation: missingInformation } = this.state

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

        {this.renderRequiredInfoForm()}
        <Flex px={20} flex={1}>
          {this.renderRequiredInfoHint()}
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
            !missingInformation && !bidderNeedsIdentityVerification({ sale, user: me }) && (
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

// const RequiredInfoForm: React.FC<{}> = ({navigator, onCreditrCardAdded, onBillingAddressAdded, billingAddress, creditCardFormParams, creditCardToken})

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
      phoneNumber {
        isValid
        display(format: E164)
      }
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
