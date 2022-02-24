import React from "react"
import { requireNativeComponent } from "react-native"

const ARTLiveAuctionView = requireNativeComponent("ARTLiveAuctionView")

export const LiveAuctionView: React.FC<{ slug: string }> = (slug) => {
  return (
    <ARTLiveAuctionView // @ts-ignore
      slug={slug}
      style={{ flex: 1 }}
    />
  )
}
