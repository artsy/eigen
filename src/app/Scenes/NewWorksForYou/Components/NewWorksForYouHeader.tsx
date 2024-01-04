import { Flex, Text } from "@artsy/palette-mobile"
import { pluralize } from "app/utils/pluralize"

export const NewWorksForYouHeaderComponent: React.FC<{
  artworksCount: number
}> = ({ artworksCount }) => {
  return (
    <Flex mb={1}>
      <Text variant="lg-display">New Works For You</Text>
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text variant="xs" mt={1}>
          {artworksCount} {pluralize("Artwork", artworksCount)}
        </Text>
      </Flex>
    </Flex>
  )
}
