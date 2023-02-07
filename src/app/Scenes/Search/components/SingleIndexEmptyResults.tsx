import { apostrophe, quoteLeft, quoteRight, Spacer, Text } from "@artsy/palette-mobile"
import { SINGLE_INDICES_WITH_AN_ARTICLE } from "app/Scenes/Search/constants"
import { AlgoliaIndexKey, PillType } from "app/Scenes/Search/types"
import { Box } from "palette"

interface SingleIndexEmptyResultsMessageProps {
  query: string
  selectedPill: PillType
}

export const SingleIndexEmptyResultsMessage: React.FC<SingleIndexEmptyResultsMessageProps> = ({
  query,
  selectedPill,
}) => {
  const article = SINGLE_INDICES_WITH_AN_ARTICLE.includes(selectedPill.key as AlgoliaIndexKey)
    ? "an"
    : "a"

  return (
    <Box px={2} py={1}>
      <Spacer mt={4} />
      <Text variant="sm-display" textAlign="center">
        {`Sorry, we couldn${apostrophe}t find ${article} ${selectedPill.displayName} for ${quoteLeft}${query}
      .${quoteRight}`}
      </Text>
      <Text variant="sm-display" color="black60" textAlign="center">
        Please try searching again with a different spelling.
      </Text>
    </Box>
  )
}
