import { Flex, Join, Separator, Spacer, Text } from "palette"
import React from "react"
import { RefreshControl, ScrollView } from "react-native"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"

import { MyBids_me$data } from "__generated__/MyBids_me.graphql"
import { MyBidsQuery } from "__generated__/MyBidsQuery.graphql"

import { OwnerType } from "@artsy/cohesion"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { useScreenDimensions } from "shared/hooks"
import { MyBidsPlaceholder, SaleCardFragmentContainer } from "./Components"
import { LotStatusListItemContainer } from "./Components/LotStatusListItem"
import { NoBids } from "./Components/NoBids"

export interface MyBidsProps {
  me: MyBids_me$data
  isActiveTab: boolean
  relay: RelayRefetchProp
}

const MyBids: React.FC<MyBidsProps> = (props) => {
  const [isFetching, setIsFetching] = React.useState<boolean>(false)
  const { relay, isActiveTab, me } = props
  const { isSmallScreen } = useScreenDimensions()

  const refreshMyBids = (withSpinner: boolean = false) => {
    if (withSpinner) {
      setIsFetching(true)
    }
    relay.refetch({}, null, (error) => {
      if (error) {
        console.error("MyBids/index.tsx #refreshMyBids", error.message)
        // FIXME: Handle error
      }
      setIsFetching(false)
    })
  }

  React.useEffect(() => {
    if (isActiveTab) {
      refreshMyBids()
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
      <ScrollView
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
            <Join separator={<Spacer my={1} />}>
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
                        <Text color="black60" py={1} textAlign="center">
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
            <Flex mt={2} px={1.5}>
              <Join separator={<Separator my={2} />}>
                {closed
                  .filter((closedSale) => closedSale?.saleArtworks?.length)
                  .map((closedSale) => {
                    const { saleArtworks } = closedSale!

                    return (
                      <Join
                        key={`${closedSale?.sale?.internalID}-join`}
                        separator={<Separator my={2} />}
                      >
                        {saleArtworks!.map((saleArtwork) => {
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
        <Spacer my={2} />
      </ScrollView>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

const BidTitle: React.FC<{ topBorder?: boolean }> = (props) => (
  <Flex bg="white100">
    <Text variant="md" mx={1.5} my={2}>
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
    environment={defaultEnvironment}
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
