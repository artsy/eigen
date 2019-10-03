import { Box, Button, Serif } from "@artsy/palette"
import { get, isEmpty } from "lodash"
import React from "react"
import { Image, NativeModules, ScrollView, View, ViewProperties } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import { commitMutation, createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import { PayloadError } from "relay-runtime"
import stripe from "tipsi-stripe"

import { BiddingThemeProvider } from "lib/Components/Bidding/Components/BiddingThemeProvider"
import { BidInfoRow } from "lib/Components/Bidding/Components/BidInfoRow"
import { Checkbox } from "lib/Components/Bidding/Components/Checkbox"
import { Divider } from "lib/Components/Bidding/Components/Divider"
import { PaymentInfo } from "lib/Components/Bidding/Components/PaymentInfo"
import { Timer } from "lib/Components/Bidding/Components/Timer"
import { Title } from "lib/Components/Bidding/Components/Title"
import { Flex } from "lib/Components/Bidding/Elements/Flex"
import { BidResultScreen } from "lib/Components/Bidding/Screens/BidResult"
import { bidderPositionQuery } from "lib/Components/Bidding/Screens/ConfirmBid/BidderPositionQuery"
import { SelectMaxBidEdit } from "lib/Components/Bidding/Screens/SelectMaxBidEdit"
import { Address, Bid, PaymentCardTextFieldParams, StripeToken } from "lib/Components/Bidding/types"
import { LinkText } from "lib/Components/Text/LinkText"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema, screenTrack, track } from "lib/utils/track"

import { BidderPositionQueryResponse } from "__generated__/BidderPositionQuery.graphql"
import { ConfirmBid_me } from "__generated__/ConfirmBid_me.graphql"
import { ConfirmBid_sale_artwork } from "__generated__/ConfirmBid_sale_artwork.graphql"
import {
  ConfirmBidCreateBidderPositionMutation,
  ConfirmBidCreateBidderPositionMutationResponse,
} from "__generated__/ConfirmBidCreateBidderPositionMutation.graphql"
import { ConfirmBidCreateCreditCardMutation } from "__generated__/ConfirmBidCreateCreditCardMutation.graphql"
import { ConfirmBidUpdateUserMutation } from "__generated__/ConfirmBidUpdateUserMutation.graphql"
import { Modal } from "lib/Components/Modal"

type BidderPositionResult = ConfirmBidCreateBidderPositionMutationResponse["createBidderPosition"]["result"]

const Emission = NativeModules.Emission || {}

stripe.setOptions({ publishableKey: Emission.stripePublishableKey })

export interface ConfirmBidProps extends ViewProperties {
  sale_artwork: ConfirmBid_sale_artwork
  me: ConfirmBid_me
  relay: RelayRefetchProp
  navigator?: NavigatorIOS
  refreshSaleArtwork?: () => void
  increments: any
  selectedBidIndex: number
}

interface ConfirmBidState {
  billingAddress?: Address
  creditCardFormParams?: PaymentCardTextFieldParams
  creditCardToken?: StripeToken
  conditionsOfSaleChecked: boolean
  isLoading: boolean
  requiresCheckbox: boolean
  requiresPaymentInformation: boolean
  selectedBidIndex: number
  errorModalVisible: boolean
  errorModalDetailText: string
}

const MAX_POLL_ATTEMPTS = 20

const resultForNetworkError = {
  message_header: "An error occurred",
  message_description_md: "Your bid couldn’t be placed. Please\ncheck your internet connection\nand try again.",
}

@screenTrack({
  context_screen: Schema.PageNames.BidFlowConfirmBidPage,
  context_screen_owner_type: null,
})
export class ConfirmBid extends React.Component<ConfirmBidProps, ConfirmBidState> {
  private pollCount = 0

  constructor(props) {
    super(props)

    const { bidders, has_qualified_credit_cards } = this.props.me
    const { requiresCheckbox, requiresPaymentInformation } = this.determineDisplayRequirements(
      bidders,
      has_qualified_credit_cards
    )

    this.state = {
      billingAddress: null,
      creditCardToken: null,
      creditCardFormParams: null,
      conditionsOfSaleChecked: false,
      isLoading: false,
      requiresCheckbox,
      requiresPaymentInformation,
      selectedBidIndex: this.props.selectedBidIndex,
      errorModalVisible: false,
      errorModalDetailText: "",
    }
  }

  canPlaceBid() {
    const { billingAddress, creditCardToken, conditionsOfSaleChecked } = this.state

    if (this.state.requiresPaymentInformation) {
      return billingAddress && creditCardToken && conditionsOfSaleChecked
    } else if (this.state.requiresCheckbox) {
      return conditionsOfSaleChecked
    } else {
      return true
    }
  }

  @track({
    action_type: Schema.ActionTypes.Tap,
    action_name: Schema.ActionNames.BidFlowPlaceBid,
  })
  async placeBid() {
    this.setState({ isLoading: true })

    this.state.requiresPaymentInformation
      ? await this.setupAddressCardAndBidderPosition()
      : await this.setupBidderPosition()
  }

  /** Make a bid */
  async setupBidderPosition() {
    await this.createBidderPosition()
  }

  /** Run through the full flow setting up the user account and making a bid  */
  async setupAddressCardAndBidderPosition() {
    try {
      await this.updatePhoneNumber()
      const token = await this.createTokenFromAddress()
      await this.createCreditCard(token)
      await this.createBidderPosition()
    } catch (error) {
      if (!this.state.errorModalVisible) {
        this.presentErrorModal(error, null)
      }
    }
  }

  /**
   * Because the phone number lives on the user, not as creditcard metadata, then we
   * need a separate call to update our User model to store that info
   */
  async updatePhoneNumber() {
    return new Promise((done, reject) => {
      const { phoneNumber } = this.state.billingAddress
      commitMutation<ConfirmBidUpdateUserMutation>(this.props.relay.environment, {
        onCompleted: (_, errors) => {
          if (errors && errors.length) {
            this.presentErrorModal(errors, null)
            reject(errors)
          } else {
            done()
          }
        },
        onError: errors => this.presentErrorResult(errors),
        mutation: graphql`
          mutation ConfirmBidUpdateUserMutation($input: UpdateMyProfileInput!) {
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
      commitMutation<ConfirmBidCreateCreditCardMutation>(this.props.relay.environment, {
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
        onError: errors => this.presentErrorResult(errors),
        mutation: graphql`
          mutation ConfirmBidCreateCreditCardMutation($input: CreditCardInput!) {
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

  createBidderPosition() {
    commitMutation<ConfirmBidCreateBidderPositionMutation>(this.props.relay.environment, {
      onCompleted: (results, errors) =>
        isEmpty(errors) ? this.verifyBidderPosition(results) : this.presentErrorResult(errors),
      onError: this.presentErrorResult.bind(this),
      mutation: graphql`
        mutation ConfirmBidCreateBidderPositionMutation($input: BidderPositionInput!) {
          createBidderPosition(input: $input) {
            result {
              status
              message_header: messageHeader
              message_description_md: messageDescriptionMD
              position {
                internalID
                suggested_next_bid: suggestedNextBid {
                  cents
                  display
                }
              }
            }
          }
        }
      `,
      variables: {
        input: {
          saleID: this.props.sale_artwork.sale.slug,
          artworkID: this.props.sale_artwork.artwork.slug,
          maxBidAmountCents: this.selectedBid().cents,
        },
      },
    })
  }

  verifyBidderPosition(results: ConfirmBidCreateBidderPositionMutationResponse) {
    const { result } = results.createBidderPosition

    if (result.status === "SUCCESS") {
      this.bidPlacedSuccessfully(result.position.internalID)
    } else {
      this.presentBidResult(result)
    }
  }

  @track({
    action_type: Schema.ActionTypes.Success,
    action_name: Schema.ActionNames.BidFlowPlaceBid,
  })
  bidPlacedSuccessfully(positionId: string) {
    bidderPositionQuery(positionId)
      .then(this.checkBidderPosition.bind(this))
      .catch(error => this.presentErrorResult(error))
  }

  checkBidderPosition(data: BidderPositionQueryResponse) {
    const { bidder_position } = data.me

    if (bidder_position.status === "PENDING" && this.pollCount < MAX_POLL_ATTEMPTS) {
      // initiating new request here (vs setInterval) to make sure we wait for the previous call to return before making a new one
      setTimeout(
        () =>
          bidderPositionQuery(bidder_position.position.internalID)
            .then(this.checkBidderPosition.bind(this))
            .catch(error => this.presentErrorResult(error)),
        1000
      )

      this.pollCount += 1
    } else {
      this.presentBidResult(bidder_position)
    }
  }

  onConditionsOfSaleCheckboxPressed() {
    this.setState({ conditionsOfSaleChecked: !this.state.conditionsOfSaleChecked })
  }

  onConditionsOfSaleLinkPressed() {
    SwitchBoard.presentModalViewController(this, "/conditions-of-sale?present_modally=true")
  }

  refreshBidderInfo = () => {
    this.props.relay.refetch(
      // FIXME: Should this be internalID?
      { saleID: this.props.sale_artwork.sale.slug },
      null,
      error => {
        if (error) {
          console.error("ConfirmBid.tsx", error.message)
        }
        const { bidders, has_qualified_credit_cards } = this.props.me
        const { requiresCheckbox, requiresPaymentInformation } = this.determineDisplayRequirements(
          bidders,
          has_qualified_credit_cards
        )
        this.setState({ requiresCheckbox, requiresPaymentInformation })
      },
      { force: true }
    )
  }

  onCreditCardAdded(token: StripeToken, params: PaymentCardTextFieldParams) {
    this.setState({ creditCardToken: token, creditCardFormParams: params })
  }

  onBillingAddressAdded(values: Address) {
    this.setState({ billingAddress: values })
  }

  goBackToSelectMaxBid() {
    this.props.navigator.push({
      component: SelectMaxBidEdit,
      title: "",
      passProps: {
        increments: this.props.increments,
        selectedBidIndex: this.state.selectedBidIndex,
        updateSelectedBid: this.updateSelectedBid.bind(this),
      },
    })
  }

  presentErrorResult(error: Error | ReadonlyArray<PayloadError>) {
    console.error(error)

    this.props.navigator.push({
      component: BidResultScreen,
      title: "",
      passProps: {
        sale_artwork: this.props.sale_artwork,
        bidderPositionResult: resultForNetworkError,
      },
    })

    this.setState({ isLoading: false })
  }

  presentBidResult(bidderPositionResult: BidderPositionResult) {
    NativeModules.ARNotificationsManager.postNotificationName("ARAuctionArtworkBidUpdated", {
      ARAuctionID: this.props.sale_artwork.sale.slug,
      ARAuctionArtworkID: this.props.sale_artwork.artwork.slug,
    })
    NativeModules.ARNotificationsManager.postNotificationName("ARAuctionArtworkRegistrationUpdated", {
      ARAuctionID: this.props.sale_artwork.sale.slug,
    })

    this.props.navigator.push({
      component: BidResultScreen,
      title: "",
      passProps: {
        sale_artwork: this.props.sale_artwork,
        bidderPositionResult,
        refreshBidderInfo: this.refreshBidderInfo,
        refreshSaleArtwork: this.props.refreshSaleArtwork,
      },
    })

    this.setState({ isLoading: false })
  }

  presentErrorModal(errors: Error | ReadonlyArray<PayloadError>, mutationMessage: string) {
    console.error("ConfirmBid.tsx", errors)

    const errorMessage =
      mutationMessage || "There was a problem processing your information. Check your payment details and try again."
    this.setState({ errorModalVisible: true, errorModalDetailText: errorMessage, isLoading: false })
  }

  updateSelectedBid(newBidIndex: number) {
    this.setState({ selectedBidIndex: newBidIndex })
  }

  closeModal() {
    this.setState({ errorModalVisible: false })
  }

  render() {
    const { artwork, lot_label, sale } = this.props.sale_artwork
    const { requiresPaymentInformation, requiresCheckbox, isLoading } = this.state
    const artworkImage = artwork.image

    return (
      <BiddingThemeProvider>
        <Flex m={0} flex={1} flexDirection="column">
          <ScrollView scrollEnabled>
            <Flex alignItems="center">
              <Title mb={3}>Confirm your bid</Title>
              <Timer liveStartsAt={sale.live_start_at} endsAt={sale.end_at} />
            </Flex>

            <View>
              <Flex m={4} alignItems="center">
                {artworkImage && (
                  <Image resizeMode="contain" style={{ width: 50, height: 50 }} source={{ uri: artworkImage.url }} />
                )}

                <Serif mt={4} size="4t" weight="semibold" numberOfLines={1} ellipsizeMode={"tail"}>
                  {artwork.artist_names}
                </Serif>
                <Serif size="2" weight="semibold">
                  Lot {lot_label}
                </Serif>

                <Serif italic size="2" color="black60" textAlign="center" numberOfLines={1} ellipsizeMode={"tail"}>
                  {artwork.title}
                  {artwork.date && <Serif size="2">, {artwork.date}</Serif>}
                </Serif>
              </Flex>

              <Divider />

              <BidInfoRow
                label="Max bid"
                value={this.selectedBid().display}
                onPress={isLoading ? () => null : () => this.goBackToSelectMaxBid()}
              />

              {requiresPaymentInformation ? (
                <PaymentInfo
                  navigator={isLoading ? ({ push: () => null } as any) : this.props.navigator}
                  onCreditCardAdded={this.onCreditCardAdded.bind(this)}
                  onBillingAddressAdded={this.onBillingAddressAdded.bind(this)}
                  billingAddress={this.state.billingAddress}
                  creditCardFormParams={this.state.creditCardFormParams}
                  creditCardToken={this.state.creditCardToken}
                />
              ) : (
                <Divider mb={9} />
              )}

              <Modal
                visible={this.state.errorModalVisible}
                headerText="An error occurred"
                detailText={this.state.errorModalDetailText}
                closeModal={this.closeModal.bind(this)}
              />
            </View>
          </ScrollView>

          <View>
            {requiresCheckbox ? (
              <Checkbox
                mt={3}
                justifyContent="center"
                onPress={() => this.onConditionsOfSaleCheckboxPressed()}
                disabled={isLoading}
              >
                <Serif size="2" mt={2} color="black60">
                  You agree to{" "}
                  <LinkText onPress={isLoading ? null : () => this.onConditionsOfSaleLinkPressed()}>
                    Conditions of Sale
                  </LinkText>
                  .
                </Serif>
              </Checkbox>
            ) : (
              <Flex alignItems="center">
                <Serif size="2" mt={2} color="black60">
                  You agree to{" "}
                  <LinkText onPress={isLoading ? null : () => this.onConditionsOfSaleLinkPressed()}>
                    Conditions of Sale
                  </LinkText>
                  .
                </Serif>
              </Flex>
            )}

            <Box m={4}>
              <Button
                loading={this.state.isLoading}
                block
                width={100}
                disabled={!this.canPlaceBid()}
                onPress={this.canPlaceBid() ? () => this.placeBid() : null}
              >
                Bid
              </Button>
            </Box>
          </View>
        </Flex>
      </BiddingThemeProvider>
    )
  }

  private selectedBid(): Bid {
    return this.props.increments[this.state.selectedBidIndex]
  }

  private determineDisplayRequirements(bidders: ReadonlyArray<any>, hasQualifiedCreditCards: boolean) {
    const isRegistered = bidders && bidders.length > 0
    const requiresCheckbox = !isRegistered
    const requiresPaymentInformation = !(isRegistered || hasQualifiedCreditCards)
    return { requiresCheckbox, requiresPaymentInformation }
  }
}

export const ConfirmBidScreen = createRefetchContainer(
  ConfirmBid,
  {
    sale_artwork: graphql`
      fragment ConfirmBid_sale_artwork on SaleArtwork {
        internalID
        sale {
          slug
          live_start_at: liveStartAt
          end_at: endAt
        }
        artwork {
          slug
          title
          date
          artist_names: artistNames
          image {
            url(version: "small")
          }
        }
        lot_label: lotLabel
        ...BidResult_sale_artwork
      }
    `,
    me: graphql`
      fragment ConfirmBid_me on Me {
        has_qualified_credit_cards: hasQualifiedCreditCards
        bidders(saleID: $saleID) {
          id
        }
      }
    `,
  },
  graphql`
    query ConfirmBidRefetchQuery($saleID: String!) {
      me {
        has_qualified_credit_cards: hasQualifiedCreditCards
        bidders(saleID: $saleID) {
          id
        }
      }
    }
  `
)
