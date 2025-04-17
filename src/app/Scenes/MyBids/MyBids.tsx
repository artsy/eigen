import { OwnerType } from "@artsy/cohesion"
import { Spacer, Flex, Text, Separator, Join, Tabs } from "@artsy/palette-mobile"
import { captureException } from "@sentry/react-native"
import { MyBidsQuery } from "__generated__/MyBidsQuery.graphql"
import { MyBids_me$data } from "__generated__/MyBids_me.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { useScreenDimensions } from "app/utils/hooks"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import useAppState from "app/utils/useAppState"
import { useEffect, useState } from "react"
import { RefreshControl } from "react-native"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { useInterval } from "react-use"
import { MyBidsPlaceholder, SaleCardFragmentContainer } from "./Components"
import { LotStatusListItemContainer } from "./Components/LotStatusListItem"
import { NoBids } from "./Components/NoBids"

const MY_BIDS_REFRESH_INTERVAL_MS = 10 * 1000

export interface MyBidsProps {
  me: MyBids_me$data
  isActiveTab: boolean
  relay: RelayRefetchProp
}

const MyBids: React.FC<MyBidsProps> = (props) => {
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [appIsInForeground, setAppIsInForeground] = useState(true)
  const [hasViewedScreen, setViewedScreen] = useState(false)
  const { relay, isActiveTab, me } = props
  const { isSmallScreen } = useScreenDimensions()

  const refreshMyBids = (withSpinner = false) => {
    if (withSpinner) {
      setIsFetching(true)
    }
    relay.refetch(
      {},
      null,
      (error) => {
        if (error) {
          console.error("MyBids/index.tsx #refreshMyBids", error.message)
          captureException(error, { tags: { source: "MyBids/index.tsx #refreshMyBids" } })
        }
        setIsFetching(false)
      },
      { force: true }
    )
  }

  useAppState({
    onChange: (state) => {
      setAppIsInForeground(state === "active")
    },
  })

  useInterval(
    () => {
      refreshMyBids()
    },
    // starts when the tab is active, but only pauses when the app goes to the background
    hasViewedScreen && appIsInForeground ? MY_BIDS_REFRESH_INTERVAL_MS : null
  )

  useEffect(() => {
    if (isActiveTab) {
      refreshMyBids()
    }

    if (isActiveTab && !hasViewedScreen) {
      setViewedScreen(true)
    }
  }, [isActiveTab])

  const active = me?.myBids?.active ?? []
  const closed = me?.myBids?.closed ?? []

  const hasClosedBids = closed.length > 0
  const hasActiveSales = active.length > 0

  const somethingToShow = hasClosedBids || hasActiveSales

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.inboxBids,
        // TODO: How to correctly pass the screen that was in view before the Inbox tab was tapped?
        // context_screen_referrer_type: ,
      })}
    >
      <Tabs.ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: !somethingToShow ? "center" : "flex-start",
        }}
        stickyHeaderIndices={[0, 2]}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={() => {
              refreshMyBids(true)
            }}
          />
        }
      >
        {!somethingToShow && <NoBids headerText="Discover works for you at auction." />}
        {!!hasActiveSales && <BidTitle>Active Bids</BidTitle>}
        {!!hasActiveSales && (
          <Flex testID="active-section">
            <Join separator={<Spacer y={1} />}>
              {active.map((activeSale) => {
                if (!activeSale) {
                  return null
                }

                const { sale, saleArtworks } = activeSale

                if (!sale || !saleArtworks) {
                  return null
                }

                const showNoBids =
                  !saleArtworks.length || !sale?.registrationStatus?.qualifiedForBidding
                return (
                  <SaleCardFragmentContainer
                    key={sale.internalID}
                    sale={sale}
                    me={me}
                    smallScreen={isSmallScreen}
                    hideChildren={!(showNoBids || saleArtworks.length)}
                  >
                    <Join separator={<Separator my={1} />}>
                      {!!showNoBids && (
                        <Text color="mono60" py={1} textAlign="center">
                          You haven't placed any bids on this sale
                        </Text>
                      )}
                      {saleArtworks.map((saleArtwork) => {
                        if (!saleArtwork) {
                          return <></>
                        }

                        return (
                          <LotStatusListItemContainer
                            key={saleArtwork.internalID}
                            saleArtwork={saleArtwork}
                          />
                        )
                      })}
                    </Join>
                  </SaleCardFragmentContainer>
                )
              })}
            </Join>
          </Flex>
        )}
        {!!hasClosedBids && <BidTitle>Closed Bids</BidTitle>}
        {!!hasClosedBids && (
          <Flex testID="closed-section">
            <Flex mt={2} px={2}>
              <Join separator={<Separator my={2} />}>
                {closed
                  .filter((closedSale) => closedSale?.saleArtworks?.length)
                  .map((closedSale) => {
                    return (
                      <Join
                        key={`${closedSale?.sale?.internalID}-join`}
                        separator={<Separator my={2} />}
                      >
                        {closedSale?.saleArtworks?.map((saleArtwork) => {
                          if (!saleArtwork) {
                            return null
                          }

                          return (
                            <LotStatusListItemContainer
                              saleIsClosed
                              key={saleArtwork.internalID}
                              saleArtwork={saleArtwork}
                            />
                          )
                        })}
                      </Join>
                    )
                  })}
              </Join>
            </Flex>
          </Flex>
        )}
        <Spacer y={2} />
      </Tabs.ScrollView>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

const BidTitle: React.FC<{ topBorder?: boolean }> = (props) => (
  <Flex bg="mono0">
    <Text variant="sm-display" mx={2} my={2}>
      {props.children}
    </Text>
    <Separator />
  </Flex>
)

export const MyBidsContainer = createRefetchContainer(
  MyBids,
  {
    me: graphql`
      fragment MyBids_me on Me {
        ...SaleCard_me
        myBids {
          active {
            sale {
              ...SaleCard_sale
              internalID
              registrationStatus {
                qualifiedForBidding
              }
            }
            saleArtworks {
              ...LotStatusListItem_saleArtwork
              internalID
            }
          }
          closed {
            sale {
              ...SaleCard_sale
              internalID
              registrationStatus {
                qualifiedForBidding
              }
            }
            saleArtworks {
              ...LotStatusListItem_saleArtwork
              internalID
            }
          }
        }
      }
    `,
  },
  graphql`
    query MyBidsRefetchQuery {
      me {
        ...MyBids_me
      }
    }
  `
)

export const MyBidsQueryRenderer: React.FC = () => (
  <QueryRenderer<MyBidsQuery>
    environment={getRelayEnvironment()}
    query={graphql`
      query MyBidsQuery {
        me {
          ...MyBids_me
        }
      }
    `}
    render={renderWithPlaceholder({
      Container: MyBidsContainer,
      renderPlaceholder: () => <MyBidsPlaceholder />,
    })}
    variables={{}}
  />
)
