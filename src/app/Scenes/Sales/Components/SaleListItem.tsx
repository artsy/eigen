import { Flex, Image, Text } from "@artsy/palette-mobile"
import { SaleListItem_sale$data } from "__generated__/SaleListItem_sale.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  sale: SaleListItem_sale$data
  containerWidth: number
  index: number
  columnCount: number
}

export const SaleListItem: React.FC<Props> = (props) => {
  const { sale, containerWidth, index, columnCount } = props
  const image = sale.coverImage
  const timestamp = sale.formattedStartDateTime
  const isFirstItemInRow = index === 0 || index % columnCount === 0
  const marginLeft = isFirstItemInRow ? 0 : 20

  const {
    sale: { liveURLIfOpen, href },
  } = props
  const url = (liveURLIfOpen || href) as string

  return (
    <RouterLink to={url}>
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
            <Image width={containerWidth} height={containerWidth} src={image.url} />
          </Flex>
        )}
        <Text variant="sm" numberOfLines={2} weight="medium">
          {sale.name}
        </Text>
        <Text variant="sm" color="mono60">
          {timestamp}
        </Text>
      </View>
    </RouterLink>
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
