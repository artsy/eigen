import { Flex, Box, Text } from "@artsy/palette-mobile"
import { ContextCard_artwork$data } from "__generated__/ContextCard_artwork.graphql"
import { navigate } from "app/system/navigation/navigate"
import { Avatar } from "palette"
import { TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"

interface ContextCardProps {
  artwork: ContextCard_artwork$data
  relay: RelayProp
}

export const ContextCard: React.FC<ContextCardProps> = ({ artwork: { context } }) => {
  if (context?.__typename !== "Sale" || context?.isAuction === false) {
    return null
  }

  const imageUrl = context?.coverImage?.url

  return (
    <>
      <Box mb={2}>
        <Text variant="md" color="black100">
          Auction
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
              <Text variant="sm">{context.formattedStartDateTime}</Text>
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
      internalID
      context {
        __typename
        ... on Sale {
          name
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
