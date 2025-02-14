import { Box, Button, Checkbox, LinkText, Text } from "@artsy/palette-mobile"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { captureException, captureMessage } from "@sentry/react-native"
import {
  BidderPositionQuery,
  BidderPositionQuery$data,
} from "__generated__/BidderPositionQuery.graphql"
import {
  useCreateBidderPositionMutation,
  useCreateBidderPositionMutation$data,
} from "__generated__/useCreateBidderPositionMutation.graphql"
import { BidInfoRow } from "app/Components/Bidding/Components/BidInfoRow"
import { Divider } from "app/Components/Bidding/Components/Divider"
import { PaymentInfo } from "app/Components/Bidding/Components/PaymentInfo"
import { Timer } from "app/Components/Bidding/Components/Timer"
import { BidFlowContextStore } from "app/Components/Bidding/Context/BidFlowContextProvider"
import { Flex } from "app/Components/Bidding/Elements/Flex"
import { bidderPositionQuery } from "app/Components/Bidding/Screens/ConfirmBid/BidderPositionQuery"
import { PriceSummary } from "app/Components/Bidding/Screens/ConfirmBid/PriceSummary"
import { Modal } from "app/Components/Modal"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { BiddingNavigationStackParams } from "app/Navigation/AuthenticatedRoutes/BiddingNavigator"
import { partnerName } from "app/Scenes/Artwork/Components/ArtworkExtraLinks/partnerName"
import { navigate } from "app/system/navigation/navigate"
import { AuctionWebsocketContextProvider } from "app/utils/Websockets/auctions/AuctionSocketContext"
import { usePromisedMutation } from "app/utils/hooks/usePromisedMutation"
import { useCreateBidderPosition } from "app/utils/mutations/useCreateBidderPosition"
import { useCreateCreditCard } from "app/utils/mutations/useCreateCreditCard"
import { useUpdateUserPhoneNumber } from "app/utils/mutations/useUpdateUserPhoneNumber"
import { Schema } from "app/utils/track"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { Image, ScrollView } from "react-native"
import { graphql, useRefetchableFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { PayloadError } from "relay-runtime"

export type BidderPositionResult =
  | NonNullable<useCreateBidderPositionMutation$data["createBidderPosition"]>["result"]
  | NonNullable<BidderPositionQuery$data["me"]>["bidderPosition"]

const MAX_POLL_ATTEMPTS = 20

const resultForNetworkError = {
  messageHeader: "An error occurred",
  messageDescriptionMD:
    "Your bid couldn’t be placed. Please\ncheck your internet connection\nand try again.",
  position: null,
  status: "ERROR",
}

type ConfirmBidProps = NativeStackScreenProps<BiddingNavigationStackParams, "ConfirmBid">

export const ConfirmBid: React.FC<ConfirmBidProps> = ({
  navigation,
  route: {
    params: { me, saleArtwork, refreshSaleArtwork },
  },
}) => {
  const pollCount = useRef(0)
  const { trackEvent } = useTracking()
  const [saleArtworkData, refetchSale] = useRefetchableFragment(
    confirmBidSaleArtworkFragment,
    saleArtwork
  )
  const [meData, refetchMe] = useRefetchableFragment(confirmBidMeFragment, me)
  const { sale, endAt, extendedBiddingEndAt } = saleArtworkData

  // store states
  const biddingEndAt = BidFlowContextStore.useStoreState((state) => state.biddingEndAt)
  const creditCardToken = BidFlowContextStore.useStoreState((state) => state.creditCardToken)
  const billingAddress = BidFlowContextStore.useStoreState((state) => state.billingAddress)
  const selectedBid = BidFlowContextStore.useStoreState((state) => state.selectedBid)

  // store actions
  const setBiddingEndAt = BidFlowContextStore.useStoreActions((actions) => actions.setBiddingEndAt)
  const setCreditCardToken = BidFlowContextStore.useStoreActions(
    (actions) => actions.setCreditCardToken
  )
  const setBillingAddress = BidFlowContextStore.useStoreActions(
    (actions) => actions.setBillingAddress
  )

  const [errorMessage, setErrorMessage] = useState("")
  const [errorModalVisible, setErrorModalVisible] = useState(false)
  const [conditionsOfSaleChecked, setConditionsOfSaleChecked] = useState(false)

  const [updateUserPhoneNumber, updatingPhoneNumber] = useUpdateUserPhoneNumber()
  const [createCreditCard, creatingCreditCard] = usePromisedMutation(useCreateCreditCard)
  const [createBidderPosition, creatingBidderPosition] = useCreateBidderPosition()

  const requiresCheckbox = !sale?.bidder
  const requiresPaymentInformation = !(sale?.bidder || meData.hasQualifiedCreditCards)

  useEffect(() => {
    setBiddingEndAt(extendedBiddingEndAt || endAt || sale?.endAt)
  }, [saleArtworkData])

  const canPlaceBid = useMemo(() => {
    switch (true) {
      case requiresPaymentInformation:
        return !!billingAddress && !!creditCardToken && conditionsOfSaleChecked
      case requiresCheckbox:
        return conditionsOfSaleChecked
      default:
        return true
    }
  }, [
    requiresPaymentInformation,
    requiresCheckbox,
    billingAddress,
    creditCardToken,
    conditionsOfSaleChecked,
  ])

  if (!sale || !saleArtworkData.artwork) {
    return null
  }

  const refreshBidderInfo = async () => {
    refetchMe({}, { fetchPolicy: "store-and-network" })
    refetchSale({ saleID: sale.slug }, { fetchPolicy: "store-and-network" })
  }

  const handlePlaceBid = async () => {
    if (!canPlaceBid) {
      return
    }

    try {
      if (requiresPaymentInformation) {
        if (!creditCardToken?.id) {
          throw new Error("Credit card token not present")
        }

        updateUserPhoneNumber({
          variables: { input: { phone: billingAddress?.phoneNumber } },
          onCompleted: (_, errors) => {
            if (errors && errors.length) {
              console.error("ConfirmBid.tsx: updateUserPhoneNumber", errors)
              captureMessage(
                `ConfirmBid.tsx: #updateUserPhoneNumber ${JSON.stringify(errors)}`,
                "error"
              )
              setErrorMessage(
                "There was a problem processing your information. Check your payment details and try again."
              )
              setErrorModalVisible(true)
            }
          },
          onError: (errors) => {
            console.error("ConfirmBid.tsx: updateUserPhoneNumber", errors)
          },
        })

        await createCreditCard({ variables: { input: { token: creditCardToken.id } } })
          .then((results) => {
            const mutationError = results?.createCreditCard?.creditCardOrError?.mutationError
            if (mutationError) {
              captureMessage(
                `ConfirmBid.tsx: #createCreditCard mutation error ${JSON.stringify(mutationError)}`,
                "error"
              )
              setErrorMessage(
                mutationError.detail ||
                  "There was a problem processing your information. Check your payment details and try again."
              )
              setErrorModalVisible(true)
              console.error("ConfirmBid.tsx: createCreditCard", mutationError)
            }
          })
          .catch((error) => {
            if (error?.length) {
              captureMessage(
                `ConfirmBid.tsx: #createCreditCard error ${JSON.stringify(error)}`,
                "error"
              )
              console.error("ConfirmBid.tsx: createCreditCard", error)
              setErrorMessage(
                "There was a problem processing your information. Check your payment details and try again."
              )
              setErrorModalVisible(true)
            } else {
              captureMessage(`ConfirmBid.tsx: #createCreditCard ${JSON.stringify(error)}`, "error")
              console.error("ConfirmBid.tsx: createCreditCard", error)
              navigateToBidScreen(undefined, error)
            }
          })
      }

      if (selectedBid?.cents == null) {
        throw new Error("Selected bid amount is not valid")
      }

      createBidderPosition({
        variables: {
          input: {
            saleID: sale.slug,
            artworkID: saleArtworkData?.artwork?.slug as string,
            maxBidAmountCents: selectedBid.cents,
          },
        },
        onCompleted: (results, errors) => {
          if (errors?.length) {
            captureMessage(
              `ConfirmBid.tsx: #createBidderPosition ${JSON.stringify(errors)}`,
              "error"
            )
            console.error("ConfirmBid.tsx: createBidderPosition", errors)
            navigateToBidScreen(undefined, errors)
          } else {
            verifyBidderPosition(results.createBidderPosition)
          }
        },
        onError: (errors) => {
          captureMessage(`ConfirmBid.tsx: #createBidderPosition ${JSON.stringify(errors)}`, "error")
          console.error("ConfirmBid.tsx: createBidderPosition", errors)
          navigateToBidScreen(undefined, errors)
        },
      })
    } catch (error) {
      captureException(error, { tags: { source: "ConfirmBid.tsx: handlePlaceBid" } })
      setErrorMessage((error as Error).message)
      setErrorModalVisible(true)
    }
  }

  const verifyBidderPosition = (
    bidderPostion: useCreateBidderPositionMutation["response"]["createBidderPosition"]
  ) => {
    if (bidderPostion?.result?.status === "SUCCESS") {
      trackEvent({
        action_type: Schema.ActionTypes.Success,
        action_name: Schema.ActionNames.BidFlowPlaceBid,
      })

      bidderPositionQuery(bidderPostion.result.position?.internalID as string)
        .then(checkBidderPosition)
        .catch((error) => {
          captureException(error, { tags: { source: "ConfirmBid.tsx: verifyBidderPosition" } })
          navigateToBidScreen(undefined, error)
        })
    } else {
      navigateToBidScreen(bidderPostion?.result)
    }
  }

  const checkBidderPosition = (response: BidderPositionQuery["response"] | undefined) => {
    const bidderPosition = response?.me?.bidderPosition

    if (bidderPosition?.status === "PENDING" && pollCount.current < MAX_POLL_ATTEMPTS) {
      // initiating new request here (vs setInterval) to make sure we wait for the previous call to return before making a new one
      const wait = __TEST__ ? (cb: any) => cb() : setTimeout
      wait(() => {
        bidderPositionQuery(bidderPosition.position?.internalID as string)
          .then(checkBidderPosition)
          .catch((error) => {
            captureException(error, {
              tags: { source: "ConfirmBid.tsx: checkBidderPosition" },
              extra: { pollCount: pollCount.current },
            })
            navigateToBidScreen(undefined, error)
          })
      }, 1000)

      pollCount.current += 1
    } else {
      navigateToBidScreen(bidderPosition)
    }
  }

  const navigateToBidScreen = (
    bidderPositionResult?: BidderPositionResult,
    error?: Error | ReadonlyArray<PayloadError> | null
  ) => {
    if (error || !bidderPositionResult) {
      console.error("ConfirmBid.tsx: navigateToBidScreen", error)

      navigation.navigate("BidResult", {
        saleArtwork: saleArtworkData,
        bidderPositionResult: resultForNetworkError,
      })
    } else {
      LegacyNativeModules.ARNotificationsManager.postNotificationName(
        "ARAuctionArtworkBidUpdated",
        {
          ARAuctionID: sale.slug,
          ARAuctionArtworkID: saleArtworkData.artwork?.slug,
        }
      )
      LegacyNativeModules.ARNotificationsManager.postNotificationName(
        "ARAuctionArtworkRegistrationUpdated",
        {
          ARAuctionID: sale.slug,
        }
      )

      navigation.navigate("BidResult", {
        saleArtwork: saleArtworkData,
        bidderPositionResult,
        refreshBidderInfo,
        refreshSaleArtwork,
      })
    }
  }

  const mutationInProgress = creatingBidderPosition || creatingCreditCard || updatingPhoneNumber

  return (
    <AuctionWebsocketContextProvider
      channelInfo={{ channel: "SalesChannel", sale_id: saleArtworkData?.sale?.internalID }}
      enabled={!!saleArtworkData?.sale?.cascadingEndTimeIntervalMinutes}
      callbacks={{
        received: ({ extended_bidding_end_at }) => {
          setBiddingEndAt(extended_bidding_end_at)
        },
      }}
    >
      <NavigationHeader onLeftButtonPress={() => navigation.goBack()}>
        Confirm your bid
      </NavigationHeader>

      <ScrollView style={{ flex: 1 }}>
        <Flex alignItems="center" pt={2}>
          <Timer
            liveStartsAt={sale.liveStartAt ?? undefined}
            lotEndAt={endAt}
            biddingEndAt={biddingEndAt}
          />
        </Flex>

        <Box>
          <Flex my={4} alignItems="center">
            {!!saleArtworkData.artwork.image?.url && (
              <Image
                resizeMode="contain"
                style={{ width: 50, height: 50 }}
                source={{ uri: saleArtworkData.artwork.image.url }}
              />
            )}

            <Text
              variant="sm-display"
              mt={4}
              weight="medium"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {saleArtworkData.artwork.artistNames}
            </Text>

            <Text variant="xs" weight="medium">
              Lot {saleArtworkData.lotLabel}
            </Text>

            <Text
              variant="xs"
              italic
              color="black60"
              textAlign="center"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {saleArtworkData.artwork.title}
              {!!saleArtworkData.artwork.date && (
                <Text variant="xs">, {saleArtworkData.artwork.date}</Text>
              )}
            </Text>
          </Flex>

          <Divider />

          <BidInfoRow
            label="Max bid"
            value={selectedBid.display ?? undefined}
            onPress={() => (mutationInProgress ? null : navigation.goBack())}
          />

          {requiresPaymentInformation ? (
            <PaymentInfo
              navigator={mutationInProgress ? undefined : navigation}
              onCreditCardAdded={(token, address) => {
                setCreditCardToken(token)
                setBillingAddress(address)
              }}
              billingAddress={billingAddress}
              creditCardToken={creditCardToken}
            />
          ) : (
            <Divider mb={2} />
          )}

          <Box mt={4}>
            <PriceSummary saleArtworkId={saleArtworkData.id} />
          </Box>

          <Modal
            visible={errorModalVisible}
            headerText="An error occurred"
            detailText={errorMessage}
            closeModal={() => {
              setErrorModalVisible(false)
            }}
          />
        </Box>
      </ScrollView>

      <Divider />

      <Box testID="disclaimer">
        {requiresCheckbox ? (
          <Checkbox
            m={2}
            justifyContent="center"
            onPress={() => setConditionsOfSaleChecked(!conditionsOfSaleChecked)}
            disabled={mutationInProgress}
            testID="disclaimer-checkbox"
            flex={undefined}
          >
            <Text color="black60" variant="xs">
              I agree to{" "}
              <LinkText
                variant="xs"
                onPress={() => (mutationInProgress ? null : navigate("/terms"))}
              >
                {partnerName(sale)} General Terms and Conditions of Sale
              </LinkText>
              . I understand that all bids are binding and may not be retracted.
            </Text>
          </Checkbox>
        ) : (
          <Flex alignItems="center" px={4} testID="disclaimer-text">
            <Text variant="xs" mt={2} color="black60">
              I agree to{" "}
              <LinkText
                variant="xs"
                onPress={() => (mutationInProgress ? null : navigate("/terms"))}
              >
                {partnerName(sale)} General Terms and Conditions of Sale
              </LinkText>
              . I understand that all bids are binding and may not be retracted.
            </Text>
          </Flex>
        )}

        <Box mx={2} mt={4}>
          <Button
            testID="bid-button"
            block
            loading={mutationInProgress}
            width={100}
            disabled={!canPlaceBid}
            onPress={handlePlaceBid}
          >
            Bid
          </Button>
        </Box>
      </Box>
    </AuctionWebsocketContextProvider>
  )
}

const confirmBidSaleArtworkFragment = graphql`
  fragment ConfirmBid_saleArtwork on SaleArtwork
  @refetchable(queryName: "ConfirmBidSaleArtworkQuery") {
    id
    internalID
    sale {
      internalID
      slug
      liveStartAt
      endAt
      isBenefit
      cascadingEndTimeIntervalMinutes
      partner {
        name
      }
      bidder {
        id
      }
    }
    artwork {
      slug
      title
      date
      artistNames
      image {
        url(version: "small")
      }
    }
    lotLabel
    endAt
    extendedBiddingEndAt
    ...BidResult_saleArtwork
  }
`

const confirmBidMeFragment = graphql`
  fragment ConfirmBid_me on Me @refetchable(queryName: "ConfirmBidMeQuery") {
    hasQualifiedCreditCards
  }
`

// TODO: Clean up old code
/*
@screenTrack({
  context_screen: Schema.PageNames.BidFlowConfirmBidPage,
  context_screen_owner_type: null,
})
export class ConfirmBid extends React.Component<ConfirmBidProps, ConfirmBidState> {
  private pollCount = 0

  constructor(props: ConfirmBidProps) {
    super(props)

    const { has_qualified_credit_cards } = this.props.me
    const bidder = this.props.sale_artwork?.sale?.bidder
    const { requiresCheckbox, requiresPaymentInformation } = this.determineDisplayRequirements(
      !!bidder,
      !!has_qualified_credit_cards
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

  /** Make a bid * /
  async setupBidderPosition() {
    await this.createBidderPosition()
  }

  /** Run through the full flow setting up the user account and making a bid  * /
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
   * /
  async updatePhoneNumber() {
    return new Promise<void>((done, reject) => {
      const phoneNumber = this.state.billingAddress?.phoneNumber
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

  // TODO: 🪓
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
          saleID: this.props.sale_artwork.sale?.slug as string,
          artworkID: this.props.sale_artwork.artwork?.slug as string,
          maxBidAmountCents: this.selectedBid().cents,
        },
      },
    })
  }

  verifyBidderPosition(results: ConfirmBidCreateBidderPositionMutation["response"]) {
    const data = results.createBidderPosition

    if (data?.result && data?.result?.status === "SUCCESS") {
      this.bidPlacedSuccessfully(data.result.position?.internalID as string)
    } else {
      this.presentBidResult(data?.result as any)
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
    const bidderPosition = data?.me?.bidder_position

    if (bidderPosition?.status === "PENDING" && this.pollCount < MAX_POLL_ATTEMPTS) {
      // initiating new request here (vs setInterval) to make sure we wait for the previous call to return before making a new one
      const wait = __TEST__ ? (cb: any) => cb() : setTimeout
      wait(() => {
        bidderPositionQuery(bidderPosition.position?.internalID as string)
          .then(this.checkBidderPosition.bind(this))
          .catch((error) => this.presentErrorResult(error))
      }, 1000)

      this.pollCount += 1
    } else {
      this.presentBidResult(bidderPosition as any)
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
      { saleID: this.props.sale_artwork.sale?.slug },
      null,
      (error) => {
        if (error) {
          console.error("ConfirmBid.tsx", error.message)
        }
        const { has_qualified_credit_cards } = this.props.me
        const bidder = this.props.sale_artwork?.sale?.bidder

        const { requiresCheckbox, requiresPaymentInformation } = this.determineDisplayRequirements(
          !!bidder,
          !!has_qualified_credit_cards
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
      ARAuctionID: this.props.sale_artwork.sale?.slug,
      ARAuctionArtworkID: this.props.sale_artwork.artwork?.slug,
    })
    LegacyNativeModules.ARNotificationsManager.postNotificationName(
      "ARAuctionArtworkRegistrationUpdated",
      {
        ARAuctionID: this.props.sale_artwork.sale?.slug,
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

    if (!sale || !artwork) {
      return null
    }

    const { requiresPaymentInformation, requiresCheckbox, isLoading } = this.state
    const artworkImage = artwork.image

    const websocketEnabled = !!sale?.cascadingEndTimeIntervalMinutes

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
          <NavigationHeader onLeftButtonPress={() => this.props.navigator?.pop()}>
            Confirm your bid
          </NavigationHeader>
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
                {!!artworkImage?.url && (
                  <Image
                    resizeMode="contain"
                    style={{ width: 50, height: 50 }}
                    source={{ uri: artworkImage.url }}
                  />
                )}

                <Text
                  variant="sm-display"
                  mt={4}
                  weight="medium"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {artwork.artist_names}
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
                  testID="artwork-title"
                >
                  {artwork.title}
                  {!!artwork.date && <Text variant="xs">, {artwork.date}</Text>}
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
                        : () => this.onGeneralTermsAndConditionsOfSaleLinkPressed()
                    }
                  >
                    {partnerName(sale)} General Terms and Conditions of Sale
                  </LinkText>
                  . I understand that all bids are binding and may not be retracted.
                </Text>
              </Checkbox>
            ) : (
              <Flex alignItems="center" px={4} testID="disclaimer-text">
                <Text variant="xs" mt={2} color="black60">
                  I agree to{" "}
                  <LinkText
                    variant="xs"
                    onPress={
                      isLoading
                        ? undefined
                        : () => this.onGeneralTermsAndConditionsOfSaleLinkPressed()
                    }
                  >
                    {partnerName(sale)} General Terms and Conditions of Sale
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

  private determineDisplayRequirements(hasBidder: boolean, hasQualifiedCreditCards: boolean) {
    const requiresCheckbox = !hasBidder
    const requiresPaymentInformation = !(hasBidder || hasQualifiedCreditCards)
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
          bidder {
            id
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
      }
    `,
  },
  graphql`
    query ConfirmBidRefetchQuery {
      me {
        has_qualified_credit_cards: hasQualifiedCreditCards
      }
    }
  `
)
*/
