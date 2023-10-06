import { Flex, Join, Separator, Text } from "@artsy/palette-mobile"
import { useNavigation } from "@react-navigation/native"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { NewArtworkFilterAppliedFilters as AppliedFilters } from "app/Components/NewArtworkFilter/NewArtworkFilterAppliedFilters"
import { NewArtworkFilterRarity as Rarity } from "app/Components/NewArtworkFilter/NewArtworkFilterRarity"
import {
  NewArtworkFiltersStoreProvider,
  getNewArtworkFilterStoreModel,
} from "app/Components/NewArtworkFilter/NewArtworkFilterStore"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { Alert, TouchableOpacity } from "react-native"

export const AddFiltersScreen: React.FC<{}> = () => {
  const navigation = useNavigation()

  return (
    <Flex>
      <FancyModalHeader
        hideBottomDivider
        onLeftButtonPress={navigation.goBack}
        renderRightButton={ClearAllButton}
        // rightButtonText="Clear All"
        // TODO: Improve fancy modal header logic not to rely on this prop
        // in case renderRightButton is present
        onRightButtonPress={() => {}}
      >
        Filters
      </FancyModalHeader>
      <Join separator={<Separator my={2} borderColor="black10" />}>
        <AppliedFilters includeArtistNames />
        <Rarity />
      </Join>
    </Flex>
  )
}

export const AddFiltersScreenWrapper: React.FC<{}> = () => {
  const aggregations = SavedSearchStore.useStoreState((state) => state.aggregations)

  return (
    <NewArtworkFiltersStoreProvider
      runtimeModel={{
        ...getNewArtworkFilterStoreModel(),
        aggregations,
      }}
    >
      <AddFiltersScreen />
    </NewArtworkFiltersStoreProvider>
  )
}

export const ClearAllButton = () => {
  const disabled = false

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => {
        Alert.alert("Are you sure you want to clear all filters?", "Not yet supported", [
          {
            text: "Cancel",
            onPress() {
              // Do nothing
            },
          },

          {
            text: "Clear All",
            onPress() {
              // Trigger action to clear all filters
            },
            style: "destructive",
          },
        ])
      }}
    >
      <Text underline color={disabled ? "black30" : "black100"}>
        Clear All
      </Text>
    </TouchableOpacity>
  )
}
