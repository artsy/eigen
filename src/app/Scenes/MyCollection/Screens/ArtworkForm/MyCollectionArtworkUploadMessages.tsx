import { Flex } from "@artsy/palette-mobile"
import { Tab } from "app/Scenes/MyCollection/MyCollection"
import {
  AddedArtworkWithInsightsMessage,
  AddedArtworkWithoutAnyCollectionInsightsMessage,
  AddedArtworkWithoutInsightsMessage,
} from "app/Scenes/MyCollection/Screens/Insights/MyCollectionMessages"
import { setVisualClueAsSeen, useVisualClue } from "app/utils/hooks/useVisualClue"

interface MyCollectionArtworkUploadMessagesProps {
  sourceTab: Tab
  hasMarketSignals: boolean
}

export const MyCollectionArtworkUploadMessages: React.FC<
  MyCollectionArtworkUploadMessagesProps
> = ({ sourceTab, hasMarketSignals }) => {
  const { showVisualClue } = useVisualClue()

  const tabPrefix = sourceTab === Tab.collection ? "MyCTab" : "InsightsTab"

  const showAddedArtworkWithInsightsMessage = showVisualClue(
    `AddedArtworkWithInsightsMessage_${tabPrefix}`
  )
  const showAddedArtworkWithoutInsightsMessage = showVisualClue(
    `AddedArtworkWithoutInsightsMessage_${tabPrefix}`
  )

  if (!showAddedArtworkWithInsightsMessage && !showAddedArtworkWithoutInsightsMessage) {
    return null
  }

  return (
    <Flex>
      {!!showAddedArtworkWithInsightsMessage && (
        <AddedArtworkWithInsightsMessage
          onClose={() => setVisualClueAsSeen(`AddedArtworkWithInsightsMessage_${tabPrefix}`)}
        />
      )}
      {!!showAddedArtworkWithoutInsightsMessage &&
        (hasMarketSignals ? (
          <AddedArtworkWithoutInsightsMessage
            onClose={() => setVisualClueAsSeen(`AddedArtworkWithoutInsightsMessage_${tabPrefix}`)}
          />
        ) : (
          <AddedArtworkWithoutAnyCollectionInsightsMessage
            onClose={() => setVisualClueAsSeen(`AddedArtworkWithoutInsightsMessage_${tabPrefix}`)}
          />
        ))}
    </Flex>
  )
}
