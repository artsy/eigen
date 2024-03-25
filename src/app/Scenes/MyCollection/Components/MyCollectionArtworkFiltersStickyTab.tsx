import {
  useSpace,
  Flex,
  TouchableHighlightColor,
  FilterIcon,
  bullet,
  Text,
  Input2,
} from "@artsy/palette-mobile"
import SearchIcon from "app/Components/Icons/SearchIcon"
import { MyCollectionArtworksKeywordStore } from "app/Scenes/MyCollection/Components/MyCollectionArtworksKeywordStore"
import { FiltersProps } from "app/Scenes/MyCollection/Components/MyCollectionStickyHeader"
import { debounce } from "lodash"
import { useState, useEffect } from "react"

export const MyCollectionArtworkFilters: React.FC<FiltersProps> = (props) => {
  const space = useSpace()
  const { showModal, filtersCount } = props
  const keyword = MyCollectionArtworksKeywordStore.useStoreState((state) => state.keyword)
  const [query, setQuery] = useState(keyword)

  const setKeyword = debounce(
    MyCollectionArtworksKeywordStore.useStoreActions((actions) => actions.setKeyword),
    200
  )

  useEffect(() => {
    // We're making the update here to avoid having a laggy experience when typing
    setKeyword(query)
  }, [query])

  return (
    <Flex backgroundColor="white100" flexDirection="row" pb={1}>
      <Input2
        testID="MyCollectionSearchBarInput"
        icon={<SearchIcon width={18} height={18} />}
        placeholder="Search Your Artworks"
        onChangeText={setQuery}
        enableClearButton
        value={query}
        returnKeyType="done"
        autoCorrect={false}
        style={{
          marginLeft: space(2),
        }}
        accessibilityLabel="Search Your Artworks"
      />

      <Flex px={2} justifyContent="center">
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
