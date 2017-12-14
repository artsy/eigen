import React from "react"
import { SectionList, StyleSheet } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import LotsByFollowedArtists from "./Components/LotsByFollowedArtists"
import { SaleList } from "./Components/SaleList"
import { ZeroState } from "./Components/ZeroState"

class Sales extends React.Component<Props> {
  get data() {
    const { viewer } = this.props
    const liveAuctions = viewer.sales.filter(a => !!a.live_start_at)
    const timedAuctions = viewer.sales.filter(a => !a.live_start_at)

    return {
      liveAuctions,
      timedAuctions,
      viewer,
    }
  }

  hasData() {
    const { liveAuctions, timedAuctions, viewer } = this.data
    return liveAuctions.length > 0 || timedAuctions.length > 0 || viewer.sales.length > 0
  }

  render() {
    if (!this.hasData()) {
      return <ZeroState />
    }

    const sections = [
      {
        data: [{ data: this.data.liveAuctions }],
        title: "Current Live Auctions",
        renderItem: props => <SaleList {...props} />,
      },
      {
        data: [{ data: this.data.timedAuctions }],
        title: "Current Timed Auctions",
        renderItem: props => <SaleList {...props} />,
      },
      {
        data: [{ data: this.data.viewer }],
        title: "Lots by Artists You Follow",
        renderItem: props => <LotsByFollowedArtists title={props.section.title} viewer={props.item.data} />,
      },
    ]

    return (
      <SectionList
        contentContainerStyle={SectionListStyles.contentContainer}
        stickySectionHeadersEnabled={false}
        sections={sections}
        keyExtractor={item => item.id}
      />
    )
  }
}

export default createFragmentContainer(
  Sales,
  graphql`
    fragment Sales_viewer on Viewer {
      sales(live: true, is_auction: true, size: 100) {
        ...SaleListItem_sale
        href
        live_start_at
      }
      ...LotsByFollowedArtists_viewer
    }
  `
)

const SectionListStyles = StyleSheet.create({
  contentContainer: {
    justifyContent: "space-between",
    paddingTop: 2,
    padding: 10,
    display: "flex",
  },
})

interface Props {
  viewer: {
    sales: Array<{
      href: string | null
      live_start_at: string | null
    }>
  }
}
