import { apostrophe, quoteLeft, quoteRight, Text, Spacer, Box } from "@artsy/palette-mobile"
import { SearchEmptyResultsArtAssistantCTA } from "app/Scenes/Search/components/SearchEmptyResultsArtAssistantCTA"
import { SEARCH_PILLS_WITH_AN_ARTICLE } from "app/Scenes/Search/constants"
import { getContextModuleByPillName } from "app/Scenes/Search/helpers"
import { PillType } from "app/Scenes/Search/types"
import { useEnableArtAssistant } from "app/utils/hooks/useEnableArtAssistant"

interface SingleIndexEmptyResultsMessageProps {
  query: string
  selectedPill: PillType
}

export const SingleIndexEmptyResultsMessage: React.FC<SingleIndexEmptyResultsMessageProps> = ({
  query,
  selectedPill,
}) => {
  const showArtAssistant = useEnableArtAssistant()
  const article = SEARCH_PILLS_WITH_AN_ARTICLE.includes(selectedPill) ? "an" : "a"

  return (
    <Box px={2} py={1}>
      <Spacer y={4} />
      {showArtAssistant ? (
        <SearchEmptyResultsArtAssistantCTA
          contextModule={getContextModuleByPillName(selectedPill.displayName)}
          query={query}
        />
      ) : (
        <>
          <Text variant="sm-display" textAlign="center">
            {`Sorry, we couldn${apostrophe}t find ${article} ${selectedPill.displayName} for ${quoteLeft}${query}.${quoteRight}`}
          </Text>
          <Text variant="sm-display" color="mono60" textAlign="center">
            Please try searching again with a different spelling.
          </Text>
        </>
      )}
    </Box>
  )
}
