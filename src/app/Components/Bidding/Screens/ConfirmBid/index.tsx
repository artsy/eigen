import { Box, Text, LinkText, Button, Checkbox } from "@artsy/palette-mobile"
import { Token, createToken } from "@stripe/stripe-react-native"
import { BidderPositionQuery } from "__generated__/BidderPositionQuery.graphql"
import { ConfirmBidCreateBidderPositionMutation } from "__generated__/ConfirmBidCreateBidderPositionMutation.graphql"
import { ConfirmBidCreateCreditCardMutation } from "__generated__/ConfirmBidCreateCreditCardMutation.graphql"
import { ConfirmBidUpdateUserMutation } from "__generated__/ConfirmBidUpdateUserMutation.graphql"
import { ConfirmBid_me$data } from "__generated__/ConfirmBid_me.graphql"
import { ConfirmBid_sale_artwork$data } from "__generated__/ConfirmBid_sale_artwork.graphql"
import { BidInfoRow } from "app/Components/Bidding/Components/BidInfoRow"
import { Divider } from "app/Components/Bidding/Components/Divider"
import { PaymentInfo } from "app/Components/Bidding/Components/PaymentInfo"
import { Timer } from "app/Components/Bidding/Components/Timer"
import { Flex } from "app/Components/Bidding/Elements/Flex"
import { BidResultScreen } from "app/Components/Bidding/Screens/BidResult"
import { bidderPositionQuery } from "app/Components/Bidding/Screens/ConfirmBid/BidderPositionQuery"
import { PriceSummary } from "app/Components/Bidding/Screens/ConfirmBid/PriceSummary"
import { Address, Bid, PaymentCardTextFieldParams } from "app/Components/Bidding/types"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Modal } from "app/Components/Modal"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { partnerName } from "app/Scenes/Artwork/Components/ArtworkExtraLinks/partnerName"
import { unsafe_getFeatureFlag } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { AuctionWebsocketContextProvider } from "app/utils/Websockets/auctions/AuctionSocketContext"
import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { Schema, screenTrack, track } from "app/utils/track"
import { get, isEmpty } from "lodash"
import React from "react"
import { Image, ScrollView, ViewProps } from "react-native"
import { commitMutation, createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import { PayloadError } from "relay-runtime"

type BidderPositionResult = NonNullable<
  NonNullable<ConfirmBidCreateBidderPositionMutation["response"]["createBidderPosition"]>["result"]
>

export interface ConfirmBidProps extends ViewProps {
  sale_artwork: ConfirmBid_sale_artwork$data
  me: ConfirmBid_me$data
  relay: RelayRefetchProp
  navigator?: NavigatorIOS
  refreshSaleArtwork?: () => void
  increments: any
  selectedBidIndex: number
}

interface ConfirmBidState {
  billingAddress?: Address
  creditCardFormParams?: PaymentCardTextFieldParams
  creditCardToken?: Token.Result
  conditionsOfSaleChecked: boolean
  isLoading: boolean
  requiresCheckbox: boolean
  requiresPaymentInformation: boolean
  selectedBidIndex: number
  errorModalVisible: boolean
  errorModalDetailText: string
  currentBiddingEndAt?: string | null
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

  constructor(props: ConfirmBidProps) {
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
      currentBiddingEndAt:
        this.props.sale_artwork.extendedBiddingEndAt ||
        this.props.sale_artwork.endAt ||
        this.props.sale_artwork.sale?.end_at,
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
      if (!this.state.creditCardToken) {
        throw new Error("[ConfirmBid] Credit card token not present")
      }

      await this.updatePhoneNumber()
      await this.createCreditCard(this.state.creditCardToken)
      await this.createBidderPosition()
    } catch (error) {
      if (!this.state.errorModalVisible) {
        this.presentErrorModal(error as Error, null)
      }
    }
  }

  /**
   * Because the phone number lives on the user, not as creditcard metadata, then we
   * need a separate call to update our User model to store that info
   */
  async updatePhoneNumber() {
    return new Promise<void>((done, reject) => {
      const { phoneNumber } = this.state.billingAddress!
      commitMutation<ConfirmBidUpdateUserMutation>(this.props.relay.environment, {
        onCompleted: (_, errors) => {
          if (errors && errors.length) {
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
        variables: { input: { token: token.id } },
      })
    })
  }

  createBidderPosition() {
    commitMutation<ConfirmBidCreateBidderPositionMutation>(this.props.relay.environment, {
      onCompleted: (results, errors) => {
        return isEmpty(errors)
          ? this.verifyBidderPosition(results)
          : this.presentErrorResult(errors)
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
          saleID: this.props.sale_artwork.sale!.slug,
          artworkID: this.props.sale_artwork.artwork!.slug,
          maxBidAmountCents: this.selectedBid().cents,
        },
      },
    })
  }

  verifyBidderPosition(results: ConfirmBidCreateBidderPositionMutation["response"]) {
    const { result } = results.createBidderPosition!

    if (result!.status === "SUCCESS") {
      this.bidPlacedSuccessfully(result!.position!.internalID)
    } else {
      this.presentBidResult(result!)
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

  checkBidderPosition(data: BidderPositionQuery["response"] | undefined) {
    // eslint-disable-next-line no-unsafe-optional-chaining
    const { bidder_position } = data?.me!

    if (bidder_position!.status === "PENDING" && this.pollCount < MAX_POLL_ATTEMPTS) {
      // initiating new request here (vs setInterval) to make sure we wait for the previous call to return before making a new one
      const wait = __TEST__ ? (cb: any) => cb() : setTimeout
      wait(() => {
        bidderPositionQuery(bidder_position!.position!.internalID)
          .then(this.checkBidderPosition.bind(this))
          .catch((error) => this.presentErrorResult(error))
      }, 1000)

      this.pollCount += 1
    } else {
      this.presentBidResult(bidder_position as any)
    }
  }

  onConditionsOfSaleCheckboxPressed() {
    this.setState({ conditionsOfSaleChecked: !this.state.conditionsOfSaleChecked })
  }

  onGeneralTermsAndConditionsOfSaleLinkPressed() {
    navigate("/terms")
  }

  onConditionsOfSaleLinkPressed() {
    navigate("/conditions-of-sale")
  }

  refreshBidderInfo = () => {
    this.props.relay.refetch(
      // FIXME: Should this be internalID?
      { saleID: this.props.sale_artwork.sale!.slug },
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

  onCreditCardAdded(token: Token.Result, address: Address) {
    this.setState({ creditCardToken: token, billingAddress: address })
  }

  presentErrorResult(error: Error | ReadonlyArray<PayloadError> | null | undefined) {
    console.error(error)

    this.props.navigator?.push({
      component: BidResultScreen,
      title: "",
      passProps: {
        sale_artwork: this.props.sale_artwork,
        bidderPositionResult: resultForNetworkError,
        biddingEndAt: this.state.currentBiddingEndAt,
      },
    })

    this.setState({ isLoading: false })
  }

  presentBidResult(bidderPositionResult: BidderPositionResult) {
    LegacyNativeModules.ARNotificationsManager.postNotificationName("ARAuctionArtworkBidUpdated", {
      ARAuctionID: this.props.sale_artwork.sale!.slug,
      ARAuctionArtworkID: this.props.sale_artwork.artwork!.slug,
    })
    LegacyNativeModules.ARNotificationsManager.postNotificationName(
      "ARAuctionArtworkRegistrationUpdated",
      {
        ARAuctionID: this.props.sale_artwork.sale!.slug,
      }
    )

    this.props.navigator?.push({
      component: BidResultScreen,
      title: "",
      passProps: {
        sale_artwork: this.props.sale_artwork,
        bidderPositionResult,
        refreshBidderInfo: this.refreshBidderInfo,
        refreshSaleArtwork: this.props.refreshSaleArtwork,
        biddingEndAt: this.state.currentBiddingEndAt,
      },
    })

    this.setState({ isLoading: false })
  }

  presentErrorModal(
    errors: Error | ReadonlyArray<PayloadError> | null | undefined,
    mutationMessage: string | null
  ) {
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
    const { sale_artwork } = this.props
    const { id, artwork, lot_label, sale } = sale_artwork
    const { requiresPaymentInformation, requiresCheckbox, isLoading } = this.state
    const artworkImage = artwork!.image

    const websocketEnabled = !!sale?.cascadingEndTimeIntervalMinutes

    const showNewDisclaimer = unsafe_getFeatureFlag("AREnableNewTermsAndConditions")

    return (
      <AuctionWebsocketContextProvider
        channelInfo={{
          channel: "SalesChannel",
          sale_id: sale?.internalID,
        }}
        enabled={websocketEnabled}
        callbacks={{
          received: ({ extended_bidding_end_at }) => {
            if (!!extended_bidding_end_at) {
              this.setState({ currentBiddingEndAt: extended_bidding_end_at })
            }
          },
        }}
      >
        <Flex m={0} flex={1} flexDirection="column">
          <FancyModalHeader onLeftButtonPress={() => this.props.navigator?.pop()}>
            Confirm your bid
          </FancyModalHeader>
          <ScrollView scrollEnabled>
            <Flex alignItems="center" pt={2}>
              <Timer
                liveStartsAt={sale?.live_start_at ?? undefined}
                lotEndAt={sale_artwork.endAt}
                biddingEndAt={this.state.currentBiddingEndAt}
              />
            </Flex>

            <Box>
              <Flex m={4} alignItems="center">
                {!!artworkImage && (
                  <Image
                    resizeMode="contain"
                    style={{ width: 50, height: 50 }}
                    source={{ uri: artworkImage.url! }}
                  />
                )}

                <Text
                  variant="sm-display"
                  mt={4}
                  weight="medium"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {artwork!.artist_names}
                </Text>
                <Text variant="xs" weight="medium">
                  Lot {lot_label}
                </Text>

                <Text
                  variant="xs"
                  italic
                  color="black60"
                  textAlign="center"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {artwork!.title}
                  {!!artwork!.date && <Text variant="xs">, {artwork!.date}</Text>}
                </Text>
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
                  billingAddress={this.state.billingAddress}
                  creditCardFormParams={this.state.creditCardFormParams}
                  creditCardToken={this.state.creditCardToken}
                />
              ) : (
                <Divider mb={2} />
              )}

              <Box mt={4}>
                <PriceSummary saleArtworkId={id} bid={this.selectedBid()} />
              </Box>

              <Modal
                visible={this.state.errorModalVisible}
                headerText="An error occurred"
                detailText={this.state.errorModalDetailText}
                closeModal={this.closeModal.bind(this)}
              />
            </Box>
          </ScrollView>
          <Divider />

          <Box testID="disclaimer">
            {requiresCheckbox ? (
              <Checkbox
                mt={4}
                mx={4}
                justifyContent="center"
                onPress={() => this.onConditionsOfSaleCheckboxPressed()}
                disabled={isLoading}
                flex={undefined}
                testID="disclaimer-checkbox"
              >
                <Text color="black60" variant="xs">
                  I agree to{" "}
                  <LinkText
                    variant="xs"
                    onPress={
                      isLoading
                        ? undefined
                        : showNewDisclaimer
                          ? () => this.onGeneralTermsAndConditionsOfSaleLinkPressed()
                          : () => this.onConditionsOfSaleLinkPressed()
                    }
                  >
                    {partnerName(sale!)} {showNewDisclaimer ? "General Terms and " : ""}Conditions
                    of Sale
                  </LinkText>
                  . I understand that all bids are binding and may not be retracted.
                </Text>
              </Checkbox>
            ) : (
              <Flex alignItems="center" px={4}>
                <Text variant="xs" mt={2} color="black60">
                  I agree to{" "}
                  <LinkText
                    variant="xs"
                    onPress={
                      isLoading
                        ? undefined
                        : showNewDisclaimer
                          ? () => this.onGeneralTermsAndConditionsOfSaleLinkPressed()
                          : () => this.onConditionsOfSaleLinkPressed()
                    }
                  >
                    {partnerName(sale!)} {showNewDisclaimer ? "General Terms and " : ""}Conditions
                    of Sale
                  </LinkText>
                  . I understand that all bids are binding and may not be retracted.
                </Text>
              </Flex>
            )}

            <Box m={4}>
              <Button
                testID="bid-button"
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
      </AuctionWebsocketContextProvider>
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
          internalID
          slug
          live_start_at: liveStartAt
          end_at: endAt
          isBenefit
          cascadingEndTimeIntervalMinutes
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
        endAt
        extendedBiddingEndAt
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
