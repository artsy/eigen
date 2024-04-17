import { Flex, Spacer, SearchInput, Pill } from "@artsy/palette-mobile"
import { Expandable } from "app/Components/Expandable"
import { GlobalStore } from "app/store/GlobalStore"
import { FeatureDescriptor, FeatureName, features } from "app/store/config/features"
import { DevMenuButtonItem } from "app/system/devTools/DevMenu/Components/DevMenuButtonItem"
import { FeatureFlagItem } from "app/system/devTools/DevMenu/Components/FeatureFlagItem"
import { useState } from "react"

const configurableFeatureFlagKeys = Object.entries(features as { [key: string]: FeatureDescriptor })
  .filter(([_, { showInDevMenu }]) => showInDevMenu)
  .map(([k]) => k as FeatureName)

export const FeatureFlags: React.FC<{}> = () => {
  const [featureFlagQuery, setFeatureFlagQuery] = useState("")

  const [isFeatureFlagOrderReversed, setIsFeatureFlagOrderReversed] = useState(true)

  const toggleFeatureFlagDirection = () => {
    setIsFeatureFlagOrderReversed(!isFeatureFlagOrderReversed)
  }

  const filteredAndMappedKeys = configurableFeatureFlagKeys
    .filter(
      (flagKey) =>
        features[flagKey].description?.toLowerCase().includes(featureFlagQuery.toLowerCase())
    )
    .map((flagKey) => <FeatureFlagItem key={flagKey} flagKey={flagKey} />)

  return (
    <Flex mx={2}>
      <Expandable label="Feature Flags" expanded={false}>
        <Spacer y={1} />

        <Flex mb={1} flexDirection="row" alignItems="center">
          <Flex flex={1} mr={1}>
            <SearchInput onChangeText={setFeatureFlagQuery} placeholder="Search feature flags" />
          </Flex>

          <Pill onPress={toggleFeatureFlagDirection}>
            {isFeatureFlagOrderReversed ? "Sort ↓" : "Sort ↑"}
          </Pill>
        </Flex>

        <Flex mx={-2}>
          {isFeatureFlagOrderReversed ? filteredAndMappedKeys.reverse() : filteredAndMappedKeys}
          <DevMenuButtonItem
            title="Revert all feature flags to default"
            titleColor="red100"
            onPress={() => {
              GlobalStore.actions.artsyPrefs.features.clearLocalOverrides()
            }}
          />
        </Flex>
      </Expandable>
    </Flex>
  )
}
