import { BidderPositionQueryResponse } from "__generated__/BidderPositionQuery.graphql"
import { ConfirmBid_me } from "__generated__/ConfirmBid_me.graphql"
import { ConfirmBid_sale_artwork } from "__generated__/ConfirmBid_sale_artwork.graphql"
import {
  ConfirmBidCreateBidderPositionMutation,
  ConfirmBidCreateBidderPositionMutationResponse,
} from "__generated__/ConfirmBidCreateBidderPositionMutation.graphql"
import { ConfirmBidCreateCreditCardMutation } from "__generated__/ConfirmBidCreateCreditCardMutation.graphql"
import { ConfirmBidUpdateUserMutation } from "__generated__/ConfirmBidUpdateUserMutation.graphql"
import { BidInfoRow } from "app/Components/Bidding/Components/BidInfoRow"
import { Divider } from "app/Components/Bidding/Components/Divider"
import { PaymentInfo } from "app/Components/Bidding/Components/PaymentInfo"
import { Timer } from "app/Components/Bidding/Components/Timer"
import { Flex } from "app/Components/Bidding/Elements/Flex"
import { BidResultScreen } from "app/Components/Bidding/Screens/BidResult"
import { bidderPositionQuery } from "app/Components/Bidding/Screens/ConfirmBid/BidderPositionQuery"
import { PriceSummary } from "app/Components/Bidding/Screens/ConfirmBid/PriceSummary"
import { Address, Bid, PaymentCardTextFieldParams, StripeToken } from "app/Components/Bidding/types"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Modal } from "app/Components/Modal"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { navigate } from "app/navigation/navigate"
import { partnerName } from "app/Scenes/Artwork/Components/ArtworkExtraLinks/partnerName"
import { unsafe_getFeatureFlag } from "app/store/GlobalStore"
import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { Schema, screenTrack, track } from "app/utils/track"
import { get, isEmpty } from "lodash"
import { Box, Button, Checkbox, LinkText, Serif, Text, Theme } from "palette"
import React from "react"
import { Image, ScrollView, ViewProps } from "react-native"
import { commitMutation, createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import { PayloadError } from "relay-runtime"
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import stripe from "tipsi-stripe"

type BidderPositionResult = NonNullable<
  NonNullable<ConfirmBidCreateBidderPositionMutationResponse["createBidderPosition"]>["result"]
>

export interface ConfirmBidProps extends ViewProps {
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
  message_description_md:
    "Your bid couldn’t be placed. Please\ncheck your internet connection\nand try again.",
}

@screenTrack({
  context_screen: Schema.PageNames.BidFlowConfirmBidPage,
  context_screen_owner_type: null,
})
export class ConfirmBid extends React.Component<ConfirmBidProps, ConfirmBidState> {
  private pollCount = 0

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  constructor(props) {
    super(props)

    const { bidders, has_qualified_credit_cards } = this.props.me
    const { requiresCheckbox, requiresPaymentInformation } = this.determineDisplayRequirements(
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      bidders,
      has_qualified_credit_cards
    )

    this.state = {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      billingAddress: null,
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      creditCardToken: null,
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        this.presentErrorModal(error, null)
      }
    }
  }

  /**
   * Because the phone number lives on the user, not as creditcard metadata, then we
   * need a separate call to update our User model to store that info
   */
  async updatePhoneNumber() {
    return new Promise<void>((done, reject) => {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      const { phoneNumber } = this.state.billingAddress
      commitMutation<ConfirmBidUpdateUserMutation>(this.props.relay.environment, {
        onCompleted: (_, errors) => {
          if (errors && errors.length) {
            // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            this.presentErrorModal(errors, null)
            reject(errors)
          } else {
            done()
          }
        },
        onError: (errors) => this.presentErrorResult(errors),
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
      commitMutation<ConfirmBidCreateCreditCardMutation>(this.props.relay.environment, {
        onCompleted: (data, errors) => {
          if (data && get(data, "createCreditCard.creditCardOrError.creditCard")) {
            done()
          } else {
            if (isEmpty(errors)) {
              const mutationError =
                data && get(data, "createCreditCard.creditCardOrError.mutationError")
              this.presentErrorModal(mutationError, mutationError.detail)
            } else {
              // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
              this.presentErrorModal(errors, null)
            }
          }
        },
        onError: (errors) => this.presentErrorResult(errors),
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
      onCompleted: (results, errors) => {
        return isEmpty(errors)
          ? this.verifyBidderPosition(results)
          : // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            this.presentErrorResult(errors)
      },
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
                saleArtwork {
                  reserveMessage
                  currentBid {
                    display
                  }
                  counts {
                    bidderPositions
                  }
                  artwork {
                    myLotStanding(live: true) {
                      activeBid {
                        isWinning
                      }
                      mostRecentBid {
                        maxBid {
                          display
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        input: {
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          saleID: this.props.sale_artwork.sale.slug,
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          artworkID: this.props.sale_artwork.artwork.slug,
          maxBidAmountCents: this.selectedBid().cents,
        },
      },
    })
  }

  verifyBidderPosition(results: ConfirmBidCreateBidderPositionMutationResponse) {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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
      .catch((error) => this.presentErrorResult(error))
  }

  checkBidderPosition(data: BidderPositionQueryResponse | undefined) {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const { bidder_position } = data.me

    if (bidder_position.status === "PENDING" && this.pollCount < MAX_POLL_ATTEMPTS) {
      // initiating new request here (vs setInterval) to make sure we wait for the previous call to return before making a new one
      setTimeout(() => {
        bidderPositionQuery(bidder_position.position.internalID)
          .then(this.checkBidderPosition.bind(this))
          .catch((error) => this.presentErrorResult(error))
      }, 1000)

      this.pollCount += 1
    } else {
      this.presentBidResult(bidder_position)
    }
  }

  onConditionsOfSaleCheckboxPressed() {
    this.setState({ conditionsOfSaleChecked: !this.state.conditionsOfSaleChecked })
  }

  onConditionsOfSaleLinkPressed() {
    navigate("/conditions-of-sale", { modal: true })
  }

  refreshBidderInfo = () => {
    this.props.relay.refetch(
      // FIXME: Should this be internalID?
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      { saleID: this.props.sale_artwork.sale.slug },
      null,
      (error) => {
        if (error) {
          console.error("ConfirmBid.tsx", error.message)
        }
        const { bidders, has_qualified_credit_cards } = this.props.me
        const { requiresCheckbox, requiresPaymentInformation } = this.determineDisplayRequirements(
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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

  presentErrorResult(error: Error | ReadonlyArray<PayloadError>) {
    console.error(error)

    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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
    LegacyNativeModules.ARNotificationsManager.postNotificationName("ARAuctionArtworkBidUpdated", {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      ARAuctionID: this.props.sale_artwork.sale.slug,
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      ARAuctionArtworkID: this.props.sale_artwork.artwork.slug,
    })
    LegacyNativeModules.ARNotificationsManager.postNotificationName(
      "ARAuctionArtworkRegistrationUpdated",
      {
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        ARAuctionID: this.props.sale_artwork.sale.slug,
      }
    )

    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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
      mutationMessage ||
      "There was a problem processing your information. Check your payment details and try again."
    this.setState({ errorModalVisible: true, errorModalDetailText: errorMessage, isLoading: false })
  }

  updateSelectedBid(newBidIndex: number) {
    this.setState({ selectedBidIndex: newBidIndex })
  }

  closeModal() {
    this.setState({ errorModalVisible: false })
  }

  render() {
    const { id, artwork, lot_label, sale } = this.props.sale_artwork
    const { requiresPaymentInformation, requiresCheckbox, isLoading } = this.state
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const artworkImage = artwork.image

    // GOTCHA: Don't copy this kind of feature flag code if you're working in a functional component. use `useFeatureFlag` instead
    const enablePriceTransparency = unsafe_getFeatureFlag("AROptionsPriceTransparency")

    return (
      <Flex m={0} flex={1} flexDirection="column">
        <Theme>
          <FancyModalHeader onLeftButtonPress={() => this.props.navigator?.pop()}>
            Confirm your bid
          </FancyModalHeader>
        </Theme>
        <ScrollView scrollEnabled>
          <Flex alignItems="center" pt="20px">
            <Timer
              // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
              liveStartsAt={sale.live_start_at}
              // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
              endsAt={sale.end_at}
            />
          </Flex>

          <Box>
            <Flex m={4} alignItems="center">
              {!!artworkImage && (
                <Image
                  resizeMode="contain"
                  style={{ width: 50, height: 50 }}
                  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                  source={{ uri: artworkImage.url }}
                />
              )}

              <Serif mt={4} size="4t" weight="semibold" numberOfLines={1} ellipsizeMode="tail">
                {
                  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                  artwork.artist_names
                }
              </Serif>
              <Serif size="2" weight="semibold">
                Lot {lot_label}
              </Serif>

              <Serif
                italic
                size="2"
                color="black60"
                textAlign="center"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {
                  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                  artwork.title
                }
                {!!artwork! /* STRICTNESS_MIGRATION */.date && (
                  <Serif size="2">
                    ,{" "}
                    {
                      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                      artwork.date
                    }
                  </Serif>
                )}
              </Serif>
            </Flex>

            <Divider />

            <BidInfoRow
              label="Max bid"
              value={this.selectedBid().display}
              onPress={isLoading ? () => null : () => this.props.navigator?.pop()}
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
              <Divider mb={2} />
            )}

            {enablePriceTransparency ? (
              <Box mt={4}>
                <PriceSummary saleArtworkId={id} bid={this.selectedBid()} />
              </Box>
            ) : null}

            <Modal
              visible={this.state.errorModalVisible}
              headerText="An error occurred"
              detailText={this.state.errorModalDetailText}
              closeModal={this.closeModal.bind(this)}
            />
          </Box>
        </ScrollView>
        <Divider />

        <Box>
          {requiresCheckbox ? (
            <Checkbox
              mt={4}
              mx={3}
              justifyContent="center"
              onPress={() => this.onConditionsOfSaleCheckboxPressed()}
              disabled={isLoading}
              flex={undefined}
            >
              <Text color="black60">
                You agree to{" "}
                <LinkText
                  onPress={isLoading ? undefined : () => this.onConditionsOfSaleLinkPressed()}
                >
                  {partnerName(sale!)} Conditions of Sale
                </LinkText>
                .
              </Text>
            </Checkbox>
          ) : (
            <Flex alignItems="center" px={4}>
              <Serif size="2" mt={2} color="black60">
                You agree to{" "}
                <LinkText
                  onPress={isLoading ? undefined : () => this.onConditionsOfSaleLinkPressed()}
                >
                  {partnerName(sale!)} Conditions of Sale
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
              onPress={this.canPlaceBid() ? () => this.placeBid() : undefined}
            >
              Bid
            </Button>
          </Box>
        </Box>
      </Flex>
    )
  }

  private selectedBid(): Bid {
    return this.props.increments[this.state.selectedBidIndex]
  }

  private determineDisplayRequirements(
    bidders: ReadonlyArray<any>,
    hasQualifiedCreditCards: boolean
  ) {
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
        id
        internalID
        sale {
          slug
          live_start_at: liveStartAt
          end_at: endAt
          isBenefit
          partner {
            name
          }
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
