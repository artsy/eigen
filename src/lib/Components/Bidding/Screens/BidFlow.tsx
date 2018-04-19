import React from "react"

import { NavigatorIOS, ViewProperties } from "react-native"
import { SelectMaxBid } from "./SelectMaxBid"

interface BidFlowProps extends ViewProperties {
  saleArtworkID: string
}

export class BidFlow extends React.Component<BidFlowProps> {
  render() {
    return (
      <NavigatorIOS
        navigationBarHidden={true}
        initialRoute={{
          component: SelectMaxBid,
          title: "", // title is required, though we don't use it because our navigation bar is hidden.
          passProps: {
            saleArtworkID: this.props.saleArtworkID,
          },
        }}
        style={{ flex: 1 }}
      />
    )
  }
}
