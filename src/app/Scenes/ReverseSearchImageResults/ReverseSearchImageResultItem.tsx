import { ReverseSearchImageResultItem_item } from "__generated__/ReverseSearchImageResultItem_item.graphql"
import { navigate } from "app/navigation/navigate"
import { Box, Flex, Text } from "palette"
import { FC } from "react"
import { Image, TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface ReverseSearchImageResultItemProps {
  item: ReverseSearchImageResultItem_item
}

const IMAGE_SIZE = 75

const ReverseSearchImageResultItem: FC<ReverseSearchImageResultItemProps> = ({ item }) => {
  const { matchPercent, artwork } = item

  return (
    <TouchableOpacity key={artwork!.internalID} onPress={() => navigate(artwork!.href!)}>
      <Flex my={1} alignItems="center" flexDirection="row">
        <Image
          source={{ uri: artwork!.image!.url! }}
          style={{
            width: IMAGE_SIZE,
            height: IMAGE_SIZE,
            resizeMode: "contain",
          }}
        />
        <Box ml={1}>
          <Text>{artwork?.title}</Text>
          <Text variant="sm" color="black60">
            {artwork?.artistNames}
          </Text>
          <Text variant="sm" color="black60">
            Matches by {`${matchPercent}%`}
          </Text>
        </Box>
      </Flex>
    </TouchableOpacity>
  )
}

export const ReverseSearchImageResultItemFragmentContainer = createFragmentContainer(
  ReverseSearchImageResultItem,
  {
    item: graphql`
      fragment ReverseSearchImageResultItem_item on ReverseImageSearchResult {
        matchPercent
        artwork {
          internalID
          href
          title
          artistNames
          image {
            url(version: "square")
          }
        }
      }
    `,
  }
)
