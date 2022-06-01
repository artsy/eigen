import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { removeClue, useSessionVisualClue } from "app/store/GlobalStore"
import { Flex } from "palette"
import React from "react"
import {
  AddedArtworkWithInsightsMessage,
  AddedArtworkWithoutAnyCollectionInsightsMessage,
  AddedArtworkWithoutInsightsMessage,
} from "../Insights/MyCollectionMessages"

interface MyCollectionArtworkUploadMessagesProps {
  sourceTab: Tab
  hasMarketSignals: boolean
}

export const MyCollectionArtworkUploadMessages: React.FC<
  MyCollectionArtworkUploadMessagesProps
> = ({ sourceTab, hasMarketSignals }) => {
  const { showSessionVisualClue } = useSessionVisualClue()

  const tabPrefix = sourceTab === Tab.collection ? "MyCTab" : "InsightsTab"

  const showAddedArtworkWithInsightsMessage = showSessionVisualClue(
    `AddedArtworkWithInsightsMessage_${tabPrefix}`
  )
  const showAddedArtworkWithoutInsightsMessage = showSessionVisualClue(
    `AddedArtworkWithoutInsightsMessage_${tabPrefix}`
  )

  return (
    <Flex>
      {!!showAddedArtworkWithInsightsMessage && (
        <AddedArtworkWithInsightsMessage
          onClose={() => removeClue(`AddedArtworkWithInsightsMessage_${tabPrefix}`)}
        />
      )}
      {!!showAddedArtworkWithoutInsightsMessage &&
        (hasMarketSignals ? (
          <AddedArtworkWithoutInsightsMessage
            onClose={() => removeClue(`AddedArtworkWithoutInsightsMessage_${tabPrefix}`)}
          />
        ) : (
          <AddedArtworkWithoutAnyCollectionInsightsMessage
            onClose={() => removeClue(`AddedArtworkWithoutInsightsMessage_${tabPrefix}`)}
          />
        ))}
    </Flex>
  )
}
