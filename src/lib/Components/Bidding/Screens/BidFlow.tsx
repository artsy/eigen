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
          title: "Your max bid", // title is required, though we won't likely use/display it.
          passProps: {
            saleArtworkID: this.props.saleArtworkID,
          },
        }}
        style={{ flex: 1 }}
      />
    )
  }
}
