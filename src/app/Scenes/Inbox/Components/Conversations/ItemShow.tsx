import { ItemShow_show$data } from "__generated__/ItemShow_show.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "app/navigation/navigate"
import { Box, Flex, Separator, Text, Touchable } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface ItemShowProps {
  show: ItemShow_show$data
}

export const ItemShow: React.FC<ItemShowProps> = ({ show }) => {
  return (
    <>
      <Flex flexDirection="column" p={2}>
        <Text variant="md" mb={2} weight="medium">
          Show
        </Text>

        <Touchable onPress={() => show.href && navigate(show.href)}>
          <Flex flexDirection="row">
            <Box height="100px" width="100px" justifyContent="center" backgroundColor="pink">
              <OpaqueImageView
                testID="showImage"
                imageURL={show.image?.thumbnailUrl}
                width={100}
                height={100}
              />
            </Box>
            <Flex flexDirection="column" ml={2} flexShrink={1}>
              <Text variant="sm" numberOfLines={1}>
                {show.name}
              </Text>
              {!!show.partner && (
                <Text variant="sm" color="black60" numberOfLines={1}>
                  {show.partner.name}
                </Text>
              )}
              <Text variant="sm" color="black60" numberOfLines={1}>
                {show.exhibitionPeriod}
              </Text>
            </Flex>
          </Flex>
        </Touchable>
      </Flex>
      <Separator my={1} />
    </>
  )
}

export const ItemShowFragmentContainer = createFragmentContainer(ItemShow, {
  show: graphql`
    fragment ItemShow_show on Show {
      name
      href
      exhibitionPeriod(format: SHORT)
      partner {
        ... on Partner {
          name
        }
      }
      image: coverImage {
        thumbnailUrl: url(version: "small")
      }
    }
  `,
})
