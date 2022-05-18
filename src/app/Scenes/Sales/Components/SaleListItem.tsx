import React from "react"
import { TouchableOpacity, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "app/navigation/navigate"

import { SaleListItem_sale } from "__generated__/SaleListItem_sale.graphql"
import { formatDisplayTimelyAt } from "app/Scenes/Sale/helpers"
import { Flex, Text, useSpace } from "palette"
import { useScreenDimensions } from "shared/hooks"

interface Props {
  sale: SaleListItem_sale
  columnCount: number
}

export const SaleListItem: React.FC<Props> = (props) => {
  const handleTap = () => {
    const {
      sale: { liveURLIfOpen, href },
    } = props
    const url = (liveURLIfOpen || href) as string
    navigate(url)
  }

  const { sale, columnCount } = props
  const image = sale.coverImage
  const timestamp = formatDisplayTimelyAt(sale.displayTimelyAt)

  const { width: screenWidth } = useScreenDimensions()

  const space = useSpace()

  const maxWidth = columnCount > 0 ? screenWidth / columnCount - space(2) : 0

  return (
    <TouchableOpacity onPress={handleTap}>
      <View
        style={{
          width: maxWidth,
          alignSelf: "center",
          marginBottom: space(2),
        }}
      >
        <OpaqueImageView
          style={{
            width: maxWidth,
            height: maxWidth,
            alignContent: "center",
            justifyContent: "center",
            borderRadius: 2,
            marginBottom: 5,
          }}
          imageURL={image && image.url}
          resizeMode="contain"
        />
        <Text numberOfLines={2} weight="medium">
          {sale.name}
        </Text>
        <Text color="black60">{timestamp}</Text>
      </View>
    </TouchableOpacity>
  )
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

export const SaleItemPadder: React.FC<{ columnCount: number }> = ({ columnCount }) => {
  const { width: screenWidth } = useScreenDimensions()
  const space = useSpace()
  const maxWidth = columnCount > 0 ? screenWidth / columnCount - space(2) : 0

  return (
    <Flex
      style={{
        width: maxWidth,
        alignSelf: "center",
        marginBottom: space(2),
      }}
    >
      <Flex width={maxWidth} height={maxWidth} marginBottom={5} />
    </Flex>
  )
}
