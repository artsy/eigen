import { captureMessage } from "@sentry/react-native"
import { Search_system } from "__generated__/Search_system.graphql"
import { SearchQuery } from "__generated__/SearchQuery.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "lib/Components/ArtworkFilter"
import { FilterArray, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFiltersStoreProvider, ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { useSelectedFiltersCount } from "lib/Components/ArtworkFilter/useArtworkFilters"
import { ArtworksFilterHeader } from "lib/Components/ArtworkGrids/ArtworksFilterHeader"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { useAlgoliaClient } from "lib/utils/useAlgoliaClient"
import { Box, Separator, Text } from "palette"
import React, { useEffect, useRef, useState } from "react"
import {
  Configure,
  connectInfiniteHits,
  connectRefinementList,
  connectScrollTo,
  connectStats,
  InfiniteHitsProvided,
  SearchState,
  StatsProvided,
} from "react-instantsearch-core"
import { InstantSearch } from "react-instantsearch-native"
import { FlatList, TextInput } from "react-native"
import { createRefetchContainer, QueryRenderer, RelayRefetchProp } from "react-relay"
import { graphql } from "relay-runtime"
import { RefetchWhenApiKeyExpiredContainer } from "./RefetchWhenApiKeyExpired"

const INDEX_NAME = "Artwork_staging"
const HITS_PER_PAGE = 30

interface SearchContainerProps {
  system: Search_system | null
  relay: RelayRefetchProp
}

interface SearchProps extends SearchContainerProps {
  onFilterPress: () => void
}

interface HeaderProps extends StatsProvided {
  onFilterPress: () => void
}

interface ListProps extends InfiniteHitsProvided {
  scrollOn: string
  hasNotChanged: boolean
  value: any
}

const List: React.FC<ListProps> = (props) => {
  const { hits, hasMore, hasNotChanged, value, refineNext } = props
  const ref = useRef<FlatList | null>(null)

  useEffect(() => {
    if (!hasNotChanged && value === 1) {
      ref.current?.scrollToOffset({
        offset: 0,
        animated: false,
      })
    }
  }, [hasNotChanged, value])

  const loadMore = () => {
    if (hasMore) {
      refineNext()
    }
  }

  return (
    <FlatList
      ref={ref}
      data={hits}
      keyExtractor={(hit) => hit.objectID}
      renderItem={({ item, index }) => {
        return (
          <Box p={2}>
            <Text>
              [{index + 1}] {item.name}
            </Text>
          </Box>
        )
      }}
      ItemSeparatorComponent={() => <Separator />}
      onEndReached={loadMore}
    />
  )
}

const Header: React.FC<HeaderProps> = (props) => {
  const { nbHits, onFilterPress } = props
  const appliedFiltersCount = useSelectedFiltersCount()

  return (
    <ArtworksFilterHeader onFilterPress={onFilterPress} selectedFiltersCount={appliedFiltersCount}>
      <Text variant="xs">Total: {nbHits}</Text>
    </ArtworksFilterHeader>
  )
}

const aggregationKeyByFacetKey: Record<string, string> = {
  materials_terms: "MATERIALS_TERMS",
}
const facetKeyByFilterParamName: Partial<Record<FilterParamName, string>> = {
  [FilterParamName.materialsTerms]: "materials_terms",
}

const ConnectedScrollToList = connectScrollTo(List)
const ConnectedList = connectInfiniteHits(ConnectedScrollToList)
const ConnectedHeader = connectStats(Header)
const VirtualRefinementList = connectRefinementList(() => null)

const convertFacetsToAggregations = (facets: Record<string, Record<string, number>>) => {
  return Object.entries(facets).reduce((acc, entry) => {
    const [facetKey, facetValues] = entry
    const aggregationKey = aggregationKeyByFacetKey[facetKey]

    if (aggregationKey) {
      const counts = Object.entries(facetValues).map((entryValue) => {
        const [name, count] = entryValue

        return {
          count,
          name,
          value: name,
        }
      })
      const aggregation = {
        slice: aggregationKey,
        counts,
      }

      return [...acc, aggregation]
    }

    return acc
  }, [] as any)
}

const convertFiltersToFacetFilters = (filters: FilterArray) => {
  const facets: Record<string, any> = {}

  filters.forEach((filter) => {
    const facetKey = facetKeyByFilterParamName[filter.paramName]

    if (facetKey) {
      facets[facetKey] = filter.paramValue
    }
  })

  return facets
}

export const Search: React.FC<SearchProps> = (props) => {
  const { system, relay, onFilterPress } = props
  const setAggregations = ArtworksFiltersStore.useStoreActions((action) => action.setAggregationsAction)
  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const resetFilters = ArtworksFiltersStore.useStoreActions((action) => action.clearFiltersZeroStateAction)

  const [searchState, setSearchState] = useState<SearchState>({
    query: "banksy",
    hitsPerPage: HITS_PER_PAGE,
  })
  const [facetNames, setFacetNames] = useState<string[]>([])

  const { searchClient } = useAlgoliaClient(system?.algolia?.appID!, system?.algolia?.apiKey!)

  useEffect(() => {
    const getFacets = async () => {
      try {
        const results = await searchClient!.initIndex(INDEX_NAME).search(searchState.query!, {
          facets: ["*"],
          hitsPerPage: 0,
          analytics: false,
        })
        const aggregations = convertFacetsToAggregations(results.facets ?? {})

        setAggregations(aggregations)
        setFacetNames(Object.keys(results.facets ?? {}))
      } catch (error) {
        console.log("[debug] error", error)
      }
    }

    if (searchClient) {
      getFacets()
    }
  }, [searchClient, searchState.query])

  useEffect(() => {
    const refinementList = convertFiltersToFacetFilters(appliedFilters)

    setSearchState({
      ...searchState,
      refinementList,
      page: 1,
    })
  }, [appliedFilters])

  const onSearchStateChange = (updatedState: SearchState) => {
    console.log("[debug] updatedState", updatedState)
    setSearchState(updatedState)
  }

  const onChangeQuery = (query: string) => {
    resetFilters()
    setSearchState({
      ...searchState,
      query,
      page: 1,
    })
  }

  if (searchClient) {
    return (
      <Box flex={1}>
        <Box pt={2} pb={1} px={2}>
          <TextInput
            value={searchState.query}
            onChangeText={onChangeQuery}
            autoCorrect={false}
            style={{ borderColor: "black", borderWidth: 1, padding: 10 }}
          />
        </Box>
        <InstantSearch
          searchClient={searchClient}
          indexName={INDEX_NAME}
          searchState={searchState}
          onSearchStateChange={onSearchStateChange}
        >
          <Configure hitsPerPage={searchState.hitsPerPage} query={searchState.query} />
          <ConnectedHeader onFilterPress={onFilterPress} />
          <RefetchWhenApiKeyExpiredContainer relay={relay} />
          {facetNames.map((facetName) => (
            <VirtualRefinementList key={facetName} attribute={facetName} />
          ))}
          <ConnectedList />
        </InstantSearch>
      </Box>
    )
  }

  return null
}

export const SearchContainer: React.FC<SearchContainerProps> = (props) => {
  const [visible, setVisible] = useState(false)

  const closeFilterNavigator = () => {
    setVisible(false)
  }
  const openFilterNavigator = () => {
    setVisible(true)
  }

  return (
    <ArtworkFiltersStoreProvider>
      <Search onFilterPress={openFilterNavigator} {...props} />
      <ArtworkFilterNavigator
        visible={visible}
        exitModal={closeFilterNavigator}
        closeModal={closeFilterNavigator}
        mode={FilterModalMode.Search}
      />
    </ArtworkFiltersStoreProvider>
  )
}

const SearchRefetchContainer = createRefetchContainer(
  SearchContainer,
  {
    system: graphql`
      fragment Search_system on System {
        __typename
        algolia {
          appID
          apiKey
          indices {
            name
            displayName
            key
          }
        }
      }
    `,
  },
  graphql`
    query SearchRefetchQuery {
      system {
        ...Search_system
      }
    }
  `
)

export const SearchScreenQuery = graphql`
  query SearchQuery {
    system {
      ...Search_system
    }
  }
`

export const SearchQueryRenderer: React.FC<{}> = ({}) => {
  return (
    <QueryRenderer<SearchQuery>
      environment={defaultEnvironment}
      query={SearchScreenQuery}
      render={({ props, error }) => {
        if (error) {
          if (__DEV__) {
            console.error(error)
          } else {
            captureMessage(error.stack!)
          }
        }

        if (props?.system) {
          return <SearchRefetchContainer system={props.system} />
        }
        return null
      }}
      variables={{}}
      cacheConfig={{
        force: true,
      }}
    />
  )
}
