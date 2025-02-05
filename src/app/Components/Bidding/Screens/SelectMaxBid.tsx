import { Button, Flex, useScreenDimensions } from "@artsy/palette-mobile"
import { SelectMaxBidQuery } from "__generated__/SelectMaxBidQuery.graphql"
import { SelectMaxBid_me$key } from "__generated__/SelectMaxBid_me.graphql"
import { SelectMaxBid_saleArtwork$key } from "__generated__/SelectMaxBid_saleArtwork.graphql"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { Select } from "app/Components/Select"
import { dismissModal } from "app/system/navigation/navigate"
import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { NoFallback, SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { compact } from "lodash"
import React, { useMemo, useState } from "react"
import { graphql, useFragment, useLazyLoadQuery, useRefetchableFragment } from "react-relay"
import { ConfirmBid } from "./ConfirmBid"

interface SelectMaxBidProps {
  saleArtwork: SelectMaxBid_saleArtwork$key
  me: SelectMaxBid_me$key
  navigator: NavigatorIOS
}

export const SelectMaxBid: React.FC<SelectMaxBidProps> = ({ navigator, me, saleArtwork }) => {
  const { height } = useScreenDimensions()
  const [selectedBidIndex, setSelectedBidIndex] = useState(0)

  const [saleArtworkData, refetch] = useRefetchableFragment(
    selectMaxBidSaleArtworkFragment,
    saleArtwork
  )
  const meData = useFragment(selectMaxBidMeFragment, me)

  const handleRefresh = () => {
    refetch({}, { fetchPolicy: "network-only" })
  }

  const handleNext = () => {
    navigator.push({
      component: ConfirmBid,
      passProps: {
        me: meData,
        saleArtwork: saleArtworkData,
        increments: saleArtworkData.increments,
        selectedBidIndex,
        refreshSaleArtwork: handleRefresh,
      },
    })
  }
  const bids = compact(saleArtworkData.increments) || []

  const bidOptions = useMemo(
    () => bids.map((b) => ({ label: b.display || "", value: b.cents })),
    [bids]
  )

  return (
    <Flex flex={1} mx={2}>
      <Flex flexGrow={1} justifyContent="center">
        <Select
          title="Your max bid"
          maxModalHeight={height * 0.75}
          value={bids[selectedBidIndex]?.cents ?? null}
          options={bidOptions}
          onSelectValue={(_, index) => setSelectedBidIndex(index)}
        />
      </Flex>

      <Button testID="next-button" block onPress={handleNext} flexGrow={0}>
        Next
      </Button>
    </Flex>
  )
}

interface SelectMaxBidQRProps {
  artworkID: string
  saleID: string
  navigator: NavigatorIOS
}

export const SelectMaxBidQueryRenderer = withSuspense<SelectMaxBidQRProps>({
  Component: (props) => {
    const initialData = useLazyLoadQuery<SelectMaxBidQuery>(selectMaxBidQuery, {
      artworkID: props.artworkID,
      saleID: props.saleID,
    })

    if (!initialData || !initialData.artwork?.saleArtwork || !initialData.me) {
      return null
    }

    // TODO: we should add this into Cohesion
    //   <ProvideScreenTrackingWithCohesionSchema
    //   info={screen({ context_screen_owner_type: OwnerType.maxBidFlow })}
    // >
    return (
      <>
        <NavigationHeader useXButton onLeftButtonPress={() => dismissModal()}>
          Place a max bid
        </NavigationHeader>

        <SelectMaxBid
          me={initialData.me}
          saleArtwork={initialData.artwork.saleArtwork}
          {...props}
        />
      </>
    )
  },
  ErrorFallback: NoFallback,
  LoadingFallback: SpinnerFallback,
})

const selectMaxBidQuery = graphql`
  query SelectMaxBidQuery($artworkID: String!, $saleID: String!) {
    artwork(id: $artworkID) {
      saleArtwork(saleID: $saleID) {
        ...SelectMaxBid_saleArtwork
      }
    }
    me {
      ...SelectMaxBid_me
    }
  }
`

const selectMaxBidSaleArtworkFragment = graphql`
  fragment SelectMaxBid_saleArtwork on SaleArtwork
  @refetchable(queryName: "SelectMaxBidRefetchQuery") {
    id
    increments(useMyMaxBid: true) {
      display
      cents
    }
    ...ConfirmBid_saleArtwork
  }
`

const selectMaxBidMeFragment = graphql`
  fragment SelectMaxBid_me on Me {
    ...ConfirmBid_me
  }
`

// TODO: Clean up old code

/*
@screenTrack({
  context_screen: Schema.PageNames.BidFlowMaxBidPage,
  context_screen_owner_type: null,
})
export class SelectMaxBid extends React.Component<SelectMaxBidProps, SelectMaxBidState> {
  state = {
    selectedBidIndex: 0,
    isRefreshingSaleArtwork: false,
  }

  refreshSaleArtwork = () => {
    this.setState({ isRefreshingSaleArtwork: true })
    this.props.relay.refetch(
      { saleArtworkNodeID: this.props.sale_artwork.id },
      null,
      () => {
        this.setState({ isRefreshingSaleArtwork: false })
      },
      { force: true }
    )
  }

  _test_refreshSaleArtwork = (value: boolean) => {
    this.setState({ isRefreshingSaleArtwork: value })
  }

  onPressNext = () => {
    this.props.navigator.push({
      component: ConfirmBidScreen,
      title: "",
      passProps: {
        ...this.props,
        increments: this.props.sale_artwork.increments,
        selectedBidIndex: this.state.selectedBidIndex,
        refreshSaleArtwork: this.refreshSaleArtwork,
      },
    })
  }

  render() {
    const bids = compact(this.props.sale_artwork && this.props.sale_artwork.increments) || []

    return (
      <Flex flex={1} m={2}>
        <View style={{ flexGrow: 1, justifyContent: "center" }}>
          {this.state.isRefreshingSaleArtwork ? (
            <ActivityIndicator testID="spinner" />
          ) : (
            <ScreenDimensionsContext.Consumer>
              {({ height }) => (
                <Select
                  title="Your max bid"
                  maxModalHeight={height * 0.75}
                  value={bids[this.state.selectedBidIndex]?.cents ?? null}
                  options={bids.map((b) => ({ label: b.display || "", value: b.cents }))}
                  onSelectValue={(_, index) => this.setState({ selectedBidIndex: index })}
                />
              )}
            </ScreenDimensionsContext.Consumer>
          )}
        </View>

        <Button testID="next-button" block onPress={this.onPressNext} style={{ flexGrow: 0 }}>
          Next
        </Button>
      </Flex>
    )
  }
}

export const SelectMaxBidContainer = createRefetchContainer(
  SelectMaxBid,
  {
    sale_artwork: graphql`
      fragment SelectMaxBid_sale_artwork on SaleArtwork {
        id
        increments(useMyMaxBid: true) {
          display
          cents # Used on the ConfirmBid screen
        }
        ...ConfirmBid_sale_artwork
      }
    `,
    me: graphql`
      fragment SelectMaxBid_me on Me {
        ...ConfirmBid_me
      }
    `,
  },
  graphql`
    query SelectMaxBidRefetchQuery($saleArtworkNodeID: ID!) {
      node(id: $saleArtworkNodeID) {
        ...SelectMaxBid_sale_artwork
      }
    }
  `
)

export const SelectMaxBidQueryRenderer: React.FC<{
  artworkID: string
  saleID: string
  navigator: NavigatorIOS
}> = memo(({ artworkID, saleID, navigator }) => {
  // TODO: artworkID can be nil, so omit that part of the query if it is.
  return (
    <Flex flex={1}>
      <NavigationHeader useXButton onLeftButtonPress={() => dismissModal()}>
        Place a max bid
      </NavigationHeader>
      <QueryRenderer<SelectMaxBidQuery>
        environment={getRelayEnvironment()}
        query={graphql`
          query SelectMaxBidQuery($artworkID: String!, $saleID: String!) {
            artwork(id: $artworkID) {
              sale_artwork: saleArtwork(saleID: $saleID) {
                ...SelectMaxBid_sale_artwork
              }
            }
            me {
              ...SelectMaxBid_me
            }
          }
        `}
        cacheConfig={{ force: true }} // We want to always fetch latest bid increments.
        variables={{
          artworkID,
          saleID,
        }}
        render={renderWithLoadProgress<SelectMaxBidQuery["response"]>((props) => {
          if (!props?.artwork?.sale_artwork || !props?.me) {
            return null
          }

          return (
            <SelectMaxBidContainer
              me={props.me}
              sale_artwork={props.artwork.sale_artwork}
              navigator={navigator}
            />
          )
        })}
      />
    </Flex>
  )
})
*/
