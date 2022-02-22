import React from "react"
import { TouchableOpacity, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"

import { SaleListItem_sale } from "__generated__/SaleListItem_sale.graphql"
import { formatDisplayTimelyAt } from "lib/Scenes/Sale/helpers"
import { Sans } from "palette"

interface Props {
  sale: SaleListItem_sale
  containerWidth: number
  index: number
  columnCount: number
}

export class SaleListItem extends React.Component<Props> {
  handleTap = () => {
    const {
      sale: { liveURLIfOpen, href },
    } = this.props
    const url = (liveURLIfOpen || href) as string
    navigate(url)
  }

  render() {
    const { sale, containerWidth, index, columnCount } = this.props
    const image = sale.coverImage
    const timestamp = formatDisplayTimelyAt(sale.displayTimelyAt)
    const isFirstItemInRow = index === 0 || index % columnCount === 0
    const marginLeft = isFirstItemInRow ? 0 : 20

    return (
      <TouchableOpacity onPress={this.handleTap}>
        <View
          style={{
            width: containerWidth,
            marginBottom: 20,
            marginLeft,
          }}
        >
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
