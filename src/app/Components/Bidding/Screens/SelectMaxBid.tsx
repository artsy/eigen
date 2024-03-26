import { Flex, Button } from "@artsy/palette-mobile"
import { SelectMaxBidQuery } from "__generated__/SelectMaxBidQuery.graphql"
import { SelectMaxBid_me$data } from "__generated__/SelectMaxBid_me.graphql"
import { SelectMaxBid_sale_artwork$data } from "__generated__/SelectMaxBid_sale_artwork.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Select } from "app/Components/Select"
import { dismissModal } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { ScreenDimensionsContext } from "app/utils/hooks"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { Schema, screenTrack } from "app/utils/track"
import { compact } from "lodash"
import React, { memo } from "react"
import { ActivityIndicator, View, ViewProps } from "react-native"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { ConfirmBidScreen } from "./ConfirmBid"

interface SelectMaxBidProps extends ViewProps {
  sale_artwork: SelectMaxBid_sale_artwork$data
  me: SelectMaxBid_me$data
  navigator: NavigatorIOS
  relay: RelayRefetchProp
}

interface SelectMaxBidState {
  selectedBidIndex: number
  isRefreshingSaleArtwork: boolean
}

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
      <FancyModalHeader useXButton onLeftButtonPress={() => dismissModal()}>
        Place a max bid
      </FancyModalHeader>
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
          if (props.artwork?.sale_artwork && props.me) {
            return (
              <SelectMaxBidContainer
                me={props.me}
                sale_artwork={props.artwork.sale_artwork}
                navigator={navigator}
              />
            )
          }
          return null
        })}
      />
    </Flex>
  )
})
