import { OwnerType } from "@artsy/cohesion"
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
import { ProvideScreenTrackingWithCohesionSchema, Schema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
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

    trackEvent({
      action_type: Schema.ActionTypes.Tap,
      action_name: Schema.ActionNames.BidFlowPlaceBid,
    })

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
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.confirmYourBid })}
    >
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
                color="mono60"
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
              <Text color="mono60" variant="xs">
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
              <Text variant="xs" mt={2} color="mono60">
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
    </ProvideScreenTrackingWithCohesionSchema>
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
