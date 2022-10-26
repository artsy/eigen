import { ContextCard_artwork$data } from "__generated__/ContextCard_artwork.graphql"
import { navigate } from "app/navigation/navigate"
import { track as _track } from "app/utils/track"
import { Avatar, Box, Flex, Text } from "palette"
import { TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"

interface ContextCardProps {
  artwork: ContextCard_artwork$data
  relay: RelayProp
}

export const ContextCard: React.FC<ContextCardProps> = (props) => {
  let meta = null
  let header = ""
  let imageUrl = ""

  const {
    artwork: { context },
  } = props

  // Don't display a context card ever if the work is in a non-auction sale as the existing
  // sale page is not built for this purpose.
  if (context && context.__typename === "Sale" && context.isAuction === false) {
    return null
  }

  if (context) {
    switch (context.__typename) {
      case "Sale":
        header = "Auction"
        meta = context.formattedStartDateTime
        imageUrl = context.coverImage && context.coverImage.url ? context.coverImage.url : ""
        break
      default:
        return null
    }
  } else {
    return null
  }

  return (
    <>
      <Box mb={2}>
        <Text variant="md" color="black100">
          {header}
        </Text>
      </Box>
      <Flex>
        <TouchableWithoutFeedback onPress={() => navigate(context.href!)}>
          <Flex flexDirection="row" flexWrap="nowrap" accessibilityLabel="Context Card Image">
            {!!imageUrl && (
              <Flex mr={1} justifyContent="center">
                <Avatar size="xs" src={imageUrl} />
              </Flex>
            )}
            <Flex justifyContent="space-between" width={0} flexGrow={1}>
              <Text variant="sm-display">{context.name!}</Text>
              <Text variant="sm">{meta}</Text>
            </Flex>
          </Flex>
        </TouchableWithoutFeedback>
      </Flex>
    </>
  )
}

export const ContextCardFragmentContainer = createFragmentContainer(ContextCard, {
  artwork: graphql`
    fragment ContextCard_artwork on Artwork {
      id
      context {
        __typename
        ... on Sale {
          id
          name
          isLiveOpen
          href
          formattedStartDateTime
          isAuction
          coverImage {
            url
          }
        }
      }
    }
  `,
})
