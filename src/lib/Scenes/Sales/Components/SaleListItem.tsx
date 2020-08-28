import React from "react"
import { TouchableOpacity, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import Switchboard from "lib/NativeModules/SwitchBoard"

import { SaleListItem_sale } from "__generated__/SaleListItem_sale.graphql"
import { capitalize } from "lodash"
import { Sans } from "palette"

interface Props {
  sale: SaleListItem_sale
  containerWidth: number
}

export class SaleListItem extends React.Component<Props> {
  handleTap = () => {
    const {
      sale: { liveURLIfOpen, href },
    } = this.props
    const url = (liveURLIfOpen || href) as string
    Switchboard.presentNavigationViewController(this, url)
  }

  render() {
    const sale = this.props.sale
    const image = sale.coverImage
    const timestamp = capitalize(sale.displayTimelyAt?.replace(/M$/, "mo").toLowerCase())
    const containerWidth = this.props.containerWidth

    return (
      <TouchableOpacity onPress={this.handleTap}>
        <View style={{ width: containerWidth, marginBottom: 20 }}>
          <OpaqueImageView
            style={{
              width: containerWidth,
              height: containerWidth,
              borderRadius: 2,
              overflow: "hidden",
              marginBottom: 5,
            }}
            imageURL={image && image.url}
          />
          <Sans size="3t" numberOfLines={2} weight="medium">
            {sale.name}
          </Sans>
          <Sans size="3" color="black60">
            {timestamp}
          </Sans>
        </View>
      </TouchableOpacity>
    )
  }
}

export default createFragmentContainer(SaleListItem, {
  sale: graphql`
    fragment SaleListItem_sale on Sale {
      name
      href
      liveURLIfOpen
      liveStartAt
      displayTimelyAt
      coverImage {
        url(version: "large")
      }
    }
  `,
})
