import { Flex, Input, Spacer, useScreenDimensions } from "@artsy/palette-mobile"
import { useBottomSheet } from "@gorhom/bottom-sheet"
import { MyCollectionArtistsAutosuggestQuery } from "__generated__/MyCollectionArtistsAutosuggestQuery.graphql"
import SearchIcon from "app/Components/Icons/SearchIcon"
import { MyCollectionArtistsAutosuggestItem } from "app/Scenes/MyCollection/Components/MyCollectionArtistsPrompt/MyCollectionArtistsAutosuggestItem"
import { MyCollectionArtistsAutosuggestListHeader } from "app/Scenes/MyCollection/Components/MyCollectionArtistsPrompt/MyCollectionArtistsAutosuggestListHeader"
import { FOOTER_HEIGHT } from "app/Scenes/MyCollection/Components/MyCollectionArtistsPrompt/MyCollectionArtistsPromptFooter"
import { extractNodes } from "app/utils/extractNodes"
import { useDebouncedValue } from "app/utils/hooks/useDebouncedValue"
import { KeyboardAvoidingContainer } from "app/utils/keyboard/KeyboardAvoidingContainer"
import { useClientQuery } from "app/utils/useClientQuery"
import { FC, useState } from "react"
import { FlatList } from "react-native"
import { KeyboardController } from "react-native-keyboard-controller"
import { graphql } from "react-relay"

export const MyCollectionArtistsAutosuggest: FC = () => {
  const {
    safeAreaInsets: { bottom },
  } = useScreenDimensions()
  const { expand, collapse, animatedIndex } = useBottomSheet()
  const [query, setQuery] = useState("")

  const { debouncedValue: debouncedQuery } = useDebouncedValue({ value: query, delay: 250 })

  const { data, loading } = useClientQuery<MyCollectionArtistsAutosuggestQuery>({
    query: QUERY,
    variables: { query: debouncedQuery },
    skip: !debouncedQuery,
  })

  const matches = extractNodes(data?.matchConnection)

  const handleOnFocus = () => {
    if (animatedIndex.value === 0) {
      expand()
    }
  }

  const handleOnBlur = () => {
    if (matches.length === 0) {
      collapse()
    }
  }

  const handleOnClear = () => {
    if (!KeyboardController.isVisible()) {
      collapse()
    }
  }

  return (
    <KeyboardAvoidingContainer>
      <Flex gap={2} height="100%">
        <Flex>
          <Input
            placeholder="Search for artists on Artsy"
            icon={<SearchIcon width={18} height={18} />}
            enableClearButton
            autoCorrect={false}
            value={query}
            onChangeText={setQuery}
            onClear={handleOnClear}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
          />
        </Flex>

        <FlatList
          data={matches}
          keyExtractor={(item) => `MyCollectionArtistsAutosuggestItem_${item.internalID}`}
          renderItem={({ item }) => <MyCollectionArtistsAutosuggestItem artist={item} />}
          ListHeaderComponent={() => (
            <MyCollectionArtistsAutosuggestListHeader
              query={query}
              debouncedQuery={debouncedQuery}
              resultsLength={matches.length}
              isLoading={loading}
            />
          )}
          ListFooterComponent={() => <Flex height={FOOTER_HEIGHT + bottom} />}
          ItemSeparatorComponent={() => <Spacer y={2} />}
        />
      </Flex>
    </KeyboardAvoidingContainer>
  )
}

const QUERY = graphql`
  query MyCollectionArtistsAutosuggestQuery($query: String!) {
    matchConnection(term: $query, entities: ARTIST, mode: AUTOSUGGEST, first: 7) {
      edges {
        node {
          ...MyCollectionArtistsAutosuggestItem_artist
          __typename
          ... on Artist {
            internalID @required(action: NONE)
          }
        }
      }
    }
  }
`
