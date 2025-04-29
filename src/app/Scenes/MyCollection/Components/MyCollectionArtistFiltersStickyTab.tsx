import { Flex, Input } from "@artsy/palette-mobile"
import SearchIcon from "app/Components/Icons/SearchIcon"
import { MyCollectionArtworksKeywordStore } from "app/Scenes/MyCollection/Components/MyCollectionArtworksKeywordStore"
import { debounce } from "lodash"
import { useEffect, useState } from "react"

export const MyCollectionArtistFilters: React.FC<{}> = () => {
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
    <Flex pb={1}>
      <Input
        testID="MyCollectionSearchBarInput"
        icon={<SearchIcon width={18} height={18} />}
        placeholder="Search Your Artists"
        onChangeText={setQuery}
        enableClearButton
        value={query}
        returnKeyType="done"
        autoCorrect={false}
        accessibilityLabel="Search Your Artists"
      />
    </Flex>
  )
}
