import { Box, Button, Checkbox, Flex, LinkText, Text } from "@artsy/palette-mobile"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { captureMessage } from "@sentry/react-native"
import { Token, createToken } from "@stripe/stripe-react-native"
import {
  RegistrationCreateBidderMutation,
  RegistrationCreateBidderMutation$data,
} from "__generated__/RegistrationCreateBidderMutation.graphql"
import { RegistrationCreateCreditCardMutation } from "__generated__/RegistrationCreateCreditCardMutation.graphql"
import { RegistrationQuery } from "__generated__/RegistrationQuery.graphql"
import { RegistrationUpdateUserMutation } from "__generated__/RegistrationUpdateUserMutation.graphql"
import { Registration_me$data } from "__generated__/Registration_me.graphql"
import { Registration_sale$data } from "__generated__/Registration_sale.graphql"
import { PaymentInfo } from "app/Components/Bidding/Components/PaymentInfo"
import { PhoneInfo } from "app/Components/Bidding/Components/PhoneInfo"
import { Address, PaymentCardTextFieldParams } from "app/Components/Bidding/types"
import { Modal } from "app/Components/Modal"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { BiddingNavigationStackParams } from "app/Navigation/AuthenticatedRoutes/BiddingNavigator"
import { dismissModal, navigate } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { bidderNeedsIdentityVerification } from "app/utils/auction/bidderNeedsIdentityVerification"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { saleTime } from "app/utils/saleTime"
import { Schema, screenTrack } from "app/utils/track"
import { get, isEmpty } from "lodash"
import React from "react"
import { Alert, ScrollView, View, ViewProps } from "react-native"
import {
  QueryRenderer,
  RelayProp,
  commitMutation,
  createFragmentContainer,
  graphql,
} from "react-relay"
import { PayloadError } from "relay-runtime"
import { RegistrationStatus } from "./RegistrationResult"

export interface RegistrationProps
  extends ViewProps,
    NativeStackScreenProps<BiddingNavigationStackParams, "SelectMaxBid"> {
  sale: Registration_sale$data
  me: Registration_me$data
  relay: RelayProp
}

interface RegistrationState {
  billingAddress?: Address
  phoneNumber?: string
  creditCardFormParams?: PaymentCardTextFieldParams
  creditCardToken?: Token.Result
  conditionsOfSaleChecked: boolean
  isLoading: boolean
  missingInformation: "payment" | "phone" | null
  errorModalVisible: boolean
  errorModalDetailText: string
}

const Hint: React.FC = ({ children }) => (
  <Text variant="sm-display" mb={4} color="mono60">
    {children}
  </Text>
)

@screenTrack({
  context_screen: Schema.PageNames.BidFlowRegistration,
  context_screen_owner_type: null,
})
export class Registration extends React.Component<RegistrationProps, RegistrationState> {
  constructor(props: RegistrationProps) {
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

  onPressGeneralTermsAndConditionsOfSale = () => {
    navigate("/terms")
  }

  onPressConditionsOfSale = () => {
    navigate("/conditions-of-sale")
  }

  onCreditCardAdded(token: Token.Result, address: Address) {
    this.setState({ creditCardToken: token, billingAddress: address })
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
      if (phoneNumber) {
        await this.updatePhoneNumber(phoneNumber)
      }
      await this.createBidder()
    } catch (e) {
      if (__DEV__) {
        console.error(e)
      } else {
        captureMessage(`setupPhoneNumberAndBidder: ${JSON.stringify(e)}`)
      }
      if (!this.state.errorModalVisible) {
        this.presentErrorModal(e as Error, null)
      }
    }
  }

  /** Run through the full flow setting up the user account and making a bid  */
  async setupAddressCardAndBidder() {
    try {
      if (this.state.billingAddress?.phoneNumber) {
        await this.updatePhoneNumber(this.state.billingAddress.phoneNumber)
      }

      if (!this.state.creditCardToken) {
        throw new Error("[Registration] Credit card token not present")
      }

      await this.createCreditCard(this.state.creditCardToken)

      await this.createBidder()
    } catch (e) {
      if (__DEV__) {
        console.error(e)
      } else {
        captureMessage(`setupAddressCardAndBidder: ${JSON.stringify(e)}`)
      }
      if (!this.state.errorModalVisible) {
        this.presentErrorModal(e as Error, null)
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

    return createToken({
      ...creditCardFormParams,
      type: "Card",
      name: billingAddress?.fullName,
      address: {
        line1: billingAddress?.addressLine1,
        line2: billingAddress?.addressLine2,
        city: billingAddress?.city,
        state: billingAddress?.state,
        postalCode: billingAddress?.postalCode,
        country: billingAddress?.country.shortName,
      },
    })
  }

  async createCreditCard(token: Token.Result) {
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
        variables: { input: { token: token.id } },
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

  presentRegistrationSuccess({ createBidder }: RegistrationCreateBidderMutation$data) {
    LegacyNativeModules.ARNotificationsManager.postNotificationName(
      "ARAuctionArtworkRegistrationUpdated",
      {
        ARAuctionID: this.props.sale.slug,
      }
    )

    const qualifiedForBidding = createBidder?.bidder?.qualified_for_bidding
    if (qualifiedForBidding === true) {
      this.presentRegistrationResult(RegistrationStatus.RegistrationStatusComplete)
    } else {
      this.presentRegistrationResult(RegistrationStatus.RegistrationStatusPending)
    }
  }

  presentRegistrationResult(status: RegistrationStatus) {
    const { sale, me, navigation } = this.props

    navigation?.navigate("RegistrationResult", {
      status,
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      needsIdentityVerification: bidderNeedsIdentityVerification({ sale, user: me }),
    })

    this.setState({ isLoading: false })
  }

  presentErrorModal(
    errors: Error | ReadonlyArray<PayloadError> | null | undefined,
    mutationMessage: string | null
  ) {
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
        <Flex py={2}>
          <PaymentInfo
            navigator={isLoading ? ({ navigate: () => null } as any) : this.props.navigation}
            onCreditCardAdded={this.onCreditCardAdded.bind(this)}
            billingAddress={this.state.billingAddress}
            creditCardFormParams={this.state.creditCardFormParams}
            creditCardToken={this.state.creditCardToken}
          />
        </Flex>
      )
    } else if (missingInformation === "phone") {
      return (
        <Flex justifyContent="center" py={2}>
          <PhoneInfo
            navigator={isLoading ? ({ navigate: () => null } as any) : this.props.navigation}
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
        <Box p={2}>
          <Text variant="lg-display" mb={2}>
            {sale.name}
          </Text>

          {saleTimeDetails.absolute !== null && (
            <Text variant="sm-display" color="mono60">
              {saleTimeDetails.absolute}
            </Text>
          )}
        </Box>

        {this.renderRequiredInfoForm()}
        <Flex px={2}>
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
            <Text variant="sm-display">
              I agree to Artsy's{" "}
              <LinkText
                onPress={isLoading ? undefined : this.onPressGeneralTermsAndConditionsOfSale}
              >
                General Terms and Conditions of Sale
              </LinkText>
              . I understand that all bids are binding and may not be retracted.
            </Text>
          </Checkbox>
        </Flex>

        <Box p={2} mb={2}>
          <Button
            testID="register-button"
            onPress={this.canCreateBidder() ? this.register.bind(this) : null}
            loading={isLoading}
            block
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
      isIdentityVerified
      phoneNumber {
        isValid
        display(format: E164)
      }
    }
  `,
})

export const RegistrationQueryRenderer: React.FC<
  NativeStackScreenProps<BiddingNavigationStackParams, "RegisterToBid">
> = (screenProps) => {
  const { saleID } = screenProps.route.params

  return (
    <View style={{ flex: 1 }}>
      <NavigationHeader
        onLeftButtonPress={() => {
          Alert.alert("Are you sure you want to leave?", "", [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => null,
            },
            {
              text: "Leave",
              style: "destructive",
              onPress: () => dismissModal(),
            },
          ])
        }}
        useXButton
      >
        Register to bid
      </NavigationHeader>
      <QueryRenderer<RegistrationQuery>
        environment={getRelayEnvironment()}
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
        variables={{ saleID }}
        render={renderWithLoadProgress((props) => (
          <RegistrationContainer {...props} {...screenProps} />
        ))}
      />
    </View>
  )
}
