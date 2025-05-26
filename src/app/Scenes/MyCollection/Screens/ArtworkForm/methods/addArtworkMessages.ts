import { Tab } from "app/Scenes/MyCollection/MyCollection"
import { addClue, setVisualClueAsSeen } from "app/utils/hooks/useVisualClue"

export const addArtworkMessages = async ({
  hasMarketPriceInsights,
  sourceTab,
}: {
  hasMarketPriceInsights: boolean | null | undefined
  sourceTab: Tab
}) => {
  setVisualClueAsSeen("AddedArtworkWithInsightsMessage_InsightsTab")
  setVisualClueAsSeen("AddedArtworkWithInsightsMessage_MyCTab")
  setVisualClueAsSeen("AddedArtworkWithoutInsightsMessage_InsightsTab")
  setVisualClueAsSeen("AddedArtworkWithoutInsightsMessage_MyCTab")

  if (hasMarketPriceInsights) {
    if (sourceTab === Tab.collection) {
      addClue("AddedArtworkWithInsightsMessage_MyCTab")
      addClue("AddedArtworkWithInsightsVisualClueDot")
    } else {
      setVisualClueAsSeen("MyCollectionInsightsIncompleteMessage")
      addClue("AddedArtworkWithInsightsMessage_InsightsTab")
    }
  } else {
    if (sourceTab === Tab.collection) {
      addClue("AddedArtworkWithoutInsightsMessage_MyCTab")
    } else {
      setVisualClueAsSeen("MyCollectionInsightsIncompleteMessage")
      addClue("AddedArtworkWithoutInsightsMessage_InsightsTab")
    }
  }
}
