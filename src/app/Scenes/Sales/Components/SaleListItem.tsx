import { Flex, Text } from "@artsy/palette-mobile"
import { SaleListItem_sale$data } from "__generated__/SaleListItem_sale.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "app/system/navigation/navigate"
import { TouchableOpacity, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  sale: SaleListItem_sale$data
  containerWidth: number
  index: number
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

  const { sale, containerWidth, index, columnCount } = props
  const image = sale.coverImage
  const timestamp = sale.formattedStartDateTime
  const isFirstItemInRow = index === 0 || index % columnCount === 0
  const marginLeft = isFirstItemInRow ? 0 : 20

  return (
    <TouchableOpacity onPress={handleTap}>
      <View
        style={{
          width: containerWidth,
          marginBottom: 20,
          marginLeft,
        }}
      >
        {!!image && !!image.url && (
          <Flex
            height={containerWidth}
            width={containerWidth}
            borderRadius={2}
            overflow="hidden"
            mb={0.5}
          >
            <OpaqueImageView
              style={{
                width: containerWidth,
                height: containerWidth,
              }}
              imageURL={image.url}
            />
          </Flex>
        )}
        <Text variant="sm" numberOfLines={2} weight="medium">
          {sale.name}
        </Text>
        <Text variant="sm" color="black60">
          {timestamp}
        </Text>
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
      formattedStartDateTime
      coverImage {
        url(version: "large")
      }
    }
  `,
})
