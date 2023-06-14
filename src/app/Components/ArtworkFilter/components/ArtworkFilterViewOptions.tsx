import { Box, Flex, Text, Touchable } from "@artsy/palette-mobile"
import { GridViewIcon } from "app/Components/Icons/GridViewIcon"
import { ListViewIcon } from "app/Components/Icons/ListViewIcon"
import { ViewOption } from "app/Scenes/Search/UserPrefsModel"
import { GlobalStore } from "app/store/GlobalStore"

export const ArtworkFilterViewOptions = () => {
  const selectedViewOption = GlobalStore.useAppState((state) => state.userPrefs.artworkViewOption)

  const onViewOptionChange = (selectedViewOption: ViewOption) => {
    GlobalStore.actions.userPrefs.setArtworkViewOption(selectedViewOption)
  }

  return (
    <Flex flexDirection="row" alignItems="center" justifyContent="center">
      <ArtworkFilterViewOptionItem
        viewOption="grid"
        selectedViewOption={selectedViewOption}
        onPress={onViewOptionChange}
      />

      <Box width="1" height={20} backgroundColor="black15" mx={2} />

      <ArtworkFilterViewOptionItem
        viewOption="list"
        selectedViewOption={selectedViewOption}
        onPress={onViewOptionChange}
      />
    </Flex>
  )
}

interface ArtworkFilterViewOptionItem {
  viewOption: ViewOption
  selectedViewOption: ViewOption
  onPress: (viewOption: ViewOption) => void
}

const ArtworkFilterViewOptionItem: React.FC<ArtworkFilterViewOptionItem> = ({
  viewOption,
  selectedViewOption,
  onPress,
}) => {
  const displayText = viewOption === "grid" ? "Grid View" : "List View"
  const isSelected = viewOption === selectedViewOption
  const Icon = viewOption === "grid" ? GridViewIcon : ListViewIcon
  const color = isSelected ? "black100" : "black60"

  return (
    <Touchable haptic onPress={() => onPress(viewOption)}>
      <Flex flexDirection="row" alignItems="center" p={1}>
        <Icon width={24} height={24} color={color} />

        <Text ml={1} variant="xs" color={color}>
          {displayText}
        </Text>
      </Flex>
    </Touchable>
  )
}
