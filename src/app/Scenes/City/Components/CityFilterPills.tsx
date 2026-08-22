import { Pill, useSpace } from "@artsy/palette-mobile"
import { cityTabs } from "app/Scenes/City/cityTabs"
import { MapTab } from "app/utils/cityGuide/types"
import { FC } from "react"
import { ScrollView } from "react-native"

interface CityFilterPillsProps {
  selectedTabId: MapTab["id"]
  onSelectTab: (tab: MapTab) => void
}

export const CityFilterPills: FC<CityFilterPillsProps> = ({ selectedTabId, onSelectTab }) => {
  const space = useSpace()

  return (
    <ScrollView
      horizontal
      accessible
      accessibilityLabel="Scroll view for city guide filter pills"
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingHorizontal: space(2) }}
    >
      {cityTabs.map((tab) => {
        const selected = tab.id === selectedTabId

        return (
          <Pill
            key={tab.id}
            mr={0.5}
            variant="search"
            selected={selected}
            accessibilityState={{ selected }}
            onPress={() => onSelectTab(tab)}
          >
            {tab.text}
          </Pill>
        )
      })}
    </ScrollView>
  )
}
