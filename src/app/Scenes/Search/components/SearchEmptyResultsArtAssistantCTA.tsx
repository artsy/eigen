import { ContextModule, OwnerType } from "@artsy/cohesion"
import { SparklesMessageIcon } from "@artsy/icons/native"
import { Button, Flex, Text } from "@artsy/palette-mobile"
import { tappedArtAssistant } from "app/Components/GlobalSearchInput/artAssistantTracks"
import { RouterLink } from "app/system/navigation/RouterLink"
import { useTracking } from "react-tracking"

interface SearchEmptyResultsArtAssistantCTAProps {
  contextModule: ContextModule
  query: string
}

// Replaces the "no results" message when Art Assistant is enabled. Callers are responsible for
// checking `useEnableArtAssistant` and falling back to their regular empty message.
export const SearchEmptyResultsArtAssistantCTA: React.FC<
  SearchEmptyResultsArtAssistantCTAProps
> = ({ contextModule, query }) => {
  const { trackEvent } = useTracking()

  const handlePress = () => {
    trackEvent(
      tappedArtAssistant({
        contextModule,
        contextScreenOwnerType: OwnerType.search,
        type: "button",
      })
    )
  }

  return (
    <Flex alignItems="center" px={2} testID="search-empty-results-art-assistant-cta">
      <Text variant="sm-display" textAlign="center">
        Not finding what you’re looking for?
      </Text>
      <Text variant="sm-display" color="mono60" textAlign="center">
        Describe it and Art Assistant will help you find it.
      </Text>

      <RouterLink
        to="/art-assistant"
        navigationProps={{ initialPrompt: query.trim(), sendInitialPrompt: true }}
        disablePrefetch
        hasChildTouchable
        onPress={handlePress}
      >
        <Button
          accessibilityLabel="Ask Art Assistant"
          icon={<SparklesMessageIcon />}
          mt={2}
          size="small"
          variant="outline"
        >
          Ask Art Assistant
        </Button>
      </RouterLink>
    </Flex>
  )
}
