import { FilterIcon } from "@artsy/icons/native"
import {
  Flex,
  INPUT_MIN_HEIGHT,
  Input,
  Text,
  TouchableHighlightColor,
  bullet,
  useScreenDimensions,
  useSpace,
} from "@artsy/palette-mobile"
import SearchIcon from "app/Components/Icons/SearchIcon"
import { MyCollectionArtworksKeywordStore } from "app/Scenes/MyCollection/Components/MyCollectionArtworksKeywordStore"
import { debounce } from "lodash"
import { useEffect, useState } from "react"

export interface FiltersProps {
  filtersCount: number
  showModal: () => void
}

const FILTER_ICON_WIDTH = 40

export const MyCollectionArtworkFilters: React.FC<FiltersProps> = (props) => {
  const space = useSpace()
  const { showModal, filtersCount } = props
  const keyword = MyCollectionArtworksKeywordStore.useStoreState((state) => state.keyword)
  const [query, setQuery] = useState(keyword)

  const setKeyword = debounce(
    MyCollectionArtworksKeywordStore.useStoreActions((actions) => actions.setKeyword),
    200
  )

  const { width: screenWidth } = useScreenDimensions()

  useEffect(() => {
    // We're making the update here to avoid having a laggy experience when typing
    setKeyword(query)
  }, [query])

  return (
    <Flex backgroundColor="mono0" pb={1} px={2}>
      <Flex width={screenWidth - 2 * space(2) - FILTER_ICON_WIDTH}>
        <Input
          testID="MyCollectionSearchBarInput"
          icon={<SearchIcon width={18} height={18} />}
          placeholder="Search Your Artworks"
          onChangeText={setQuery}
          enableClearButton
          value={query}
          returnKeyType="done"
          autoCorrect={false}
          accessibilityLabel="Search Your Artworks"
        />
      </Flex>

      <Flex
        right={`${space(2)}px`}
        width={FILTER_ICON_WIDTH}
        alignItems="flex-end"
        justifyContent="center"
        position="absolute"
        height={INPUT_MIN_HEIGHT}
      >
        <TouchableHighlightColor
          haptic
          onPress={showModal}
          testID="sort-and-filter-button"
          render={({ color }) => (
            <Flex flexDirection="row" alignItems="center">
              <FilterIcon fill={color} width={26} height={26} />
              {filtersCount > 0 && (
                <Text variant="xs" color="blue100">
                  {` ${bullet} ${filtersCount}`}
                </Text>
              )}
            </Flex>
          )}
        />
      </Flex>
    </Flex>
  )
}
