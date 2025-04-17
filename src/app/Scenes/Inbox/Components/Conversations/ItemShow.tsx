import { Flex, Box, Text, Separator, Touchable } from "@artsy/palette-mobile"
import { ItemShow_show$data } from "__generated__/ItemShow_show.graphql"
import { ImageWithFallback } from "app/Components/ImageWithFallback/ImageWithFallback"
import { navigate } from "app/system/navigation/navigate"
import { createFragmentContainer, graphql } from "react-relay"

interface ItemShowProps {
  show: ItemShow_show$data
}

export const ItemShow: React.FC<ItemShowProps> = ({ show }) => {
  return (
    <>
      <Flex flexDirection="column" p={2}>
        <Text variant="sm-display" mb={2} weight="medium">
          Show
        </Text>

        <Touchable onPress={() => show.href && navigate(show.href)}>
          <Flex flexDirection="row">
            <Box height="100px" width="100px" justifyContent="center" backgroundColor="pink">
              <ImageWithFallback
                testID="showImage"
                src={show.image?.thumbnailUrl}
                width={100}
                height={100}
              />
            </Box>
            <Flex flexDirection="column" ml={2} flexShrink={1}>
              <Text variant="sm" numberOfLines={1}>
                {show.name}
              </Text>
              {!!show.partner && (
                <Text variant="sm" color="mono60" numberOfLines={1}>
                  {show.partner.name}
                </Text>
              )}
              <Text variant="sm" color="mono60" numberOfLines={1}>
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
