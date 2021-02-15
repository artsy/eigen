import { ItemInfo_item } from "__generated__/ItemInfo_item.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { Box, Flex, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

const ImageView = styled(OpaqueImageView)`
  width: 80px;
  height: 80px;
  border-radius: 2px;
`
interface Props {
  item: ItemInfo_item
}

type ItemInfoKyes = "imageURL" | "line1" | "line2" | "line3" | "line4"

export const ItemInfo: React.FC<Props> = (props) => {
  const { item } = props
  let itemInfo: Partial<Record<ItemInfoKyes, string>> = {}
  if (item.__typename === "Artwork") {
    itemInfo = {
      imageURL: item.image?.thumbnailUrl!,
      line1: item.artistNames!,
      line2: [item.title, item.date].join(", "),
      line3: item?.partner?.name!,
      line4: item.saleMessage!,
    }
  } else if (item.__typename === "Show") {
    itemInfo = {
      imageURL: item.image?.thumbnailUrl!,
      line1: item?.name!,
      line2: item?.partner?.name!,
      line3: item.exhibitionPeriod!,
    }
  }
  return (
    <Flex flexDirection="row">
      <Box height={80} width={80}>
        <ImageView imageURL={itemInfo.imageURL} />
      </Box>
      <Flex flexDirection="column" ml="2" flexShrink={1}>
        <Text variant="mediumText" numberOfLines={1}>
          {itemInfo.line1}
        </Text>
        <Text variant="caption" color="black60" numberOfLines={1}>
          {itemInfo.line2}
        </Text>
        <Text variant="caption" color="black60" numberOfLines={1}>
          {itemInfo.line3}
        </Text>
        <Text variant="caption" color="black60" numberOfLines={1}>
          {itemInfo.line4}
        </Text>
      </Flex>
    </Flex>
  )
}

export const ItemInfoFragmentContainer = createFragmentContainer(ItemInfo, {
  item: graphql`
    fragment ItemInfo_item on ConversationItemType {
      __typename
      ... on Artwork {
        href
        image {
          thumbnailUrl: url(version: "small")
        }
        title
        artistNames
        date
        saleMessage
        partner {
          name
        }
      }
      ... on Show {
        name
        href
        exhibitionPeriod
        partner {
          ... on Partner {
            name
          }
        }
        image: coverImage {
          thumbnailUrl: url(version: "small")
        }
      }
    }
  `,
})
