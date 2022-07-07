import { InfoModal } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/InfoModal/InfoModal"
import { Flex, Text, Touchable } from "palette"
import React, { useState } from "react"

export const MarketSignalsSectionHeader: React.FC<{}> = () => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <Flex justifyContent="space-between" flexDirection="row" mb={2} alignItems="center" px={2}>
      <Text variant="lg">Market Signals</Text>
      <Touchable onPress={() => setIsVisible(true)} haptic>
        <Text style={{ textDecorationLine: "underline" }} variant="xs" color="black60">
          What is this?
        </Text>
      </Touchable>
      <InfoModal title="Market Signals" visible={isVisible} onDismiss={() => setIsVisible(false)}>
        <Flex mt={1}>
          <Text caps>what are artsy insights?</Text>
          <Text>
            Artsy insights are free, at-a glance insights into the market and career of artists in
            your collection.
          </Text>
          <Text caps mt={2}>
            where do insights come from?
          </Text>
          <Text>
            Our market data comes from the Artsy price database, which includes millions of results
            from leading auction houses across the globe.
          </Text>
          <Text caps mt={2}>
            will I see insights on my entire collection?
          </Text>
          <Text>
            Our database covers 300,000 artists — and counting. Not all artists in your collection
            will have insights right now, but we're adding more all the time.
          </Text>
        </Flex>
      </InfoModal>
    </Flex>
  )
}
