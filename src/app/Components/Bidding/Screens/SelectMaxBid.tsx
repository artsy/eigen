import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import React from "react"
import { ActivityIndicator, View, ViewProps } from "react-native"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"

import { Schema, screenTrack } from "../../../utils/track"

import { Button, Flex } from "palette"

import { ConfirmBidScreen } from "./ConfirmBid"

import { SelectMaxBid_me } from "__generated__/SelectMaxBid_me.graphql"
import { SelectMaxBid_sale_artwork } from "__generated__/SelectMaxBid_sale_artwork.graphql"
import { SelectMaxBidQuery } from "__generated__/SelectMaxBidQuery.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { dismissModal } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { ScreenDimensionsContext } from "app/utils/useScreenDimensions"
import { compact } from "lodash"
import { Select } from "palette/elements/Select"

interface SelectMaxBidProps extends ViewProps {
  sale_artwork: SelectMaxBid_sale_artwork
  me: SelectMaxBid_me
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
      <Flex flex={1} m="2">
        <View style={{ flexGrow: 1, justifyContent: "center" }}>
          {this.state.isRefreshingSaleArtwork ? (
            <ActivityIndicator />
          ) : (
            <ScreenDimensionsContext.Consumer>
              {({ height }) => (
                <Select
                  title="Your max bid"
                  showTitleLabel={false}
                  maxModalHeight={height * 0.75}
                  value={bids[this.state.selectedBidIndex]?.cents ?? null}
                  options={bids.map((b) => ({ label: b.display!, value: b.cents }))}
                  onSelectValue={(_, index) => this.setState({ selectedBidIndex: index })}
                />
              )}
            </ScreenDimensionsContext.Consumer>
          )}
        </View>

        <Button block onPress={this.onPressNext} style={{ flexGrow: 0 }}>
          Next
        </Button>
      </Flex>
    )
  }
}

const SelectMaxBidContainer = createRefetchContainer(
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
}> = ({ artworkID, saleID, navigator }) => {
  // TODO: artworkID can be nil, so omit that part of the query if it is.
  return (
    <Flex flex={1}>
      <FancyModalHeader useXButton onLeftButtonPress={dismissModal}>
        Place a max bid
      </FancyModalHeader>
      <QueryRenderer<SelectMaxBidQuery>
        environment={defaultEnvironment}
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
        render={renderWithLoadProgress<SelectMaxBidQuery["response"]>((props) => (
          <SelectMaxBidContainer
            me={props.me!}
            sale_artwork={props.artwork!.sale_artwork!}
            navigator={navigator}
          />
        ))}
      />
    </Flex>
  )
}
