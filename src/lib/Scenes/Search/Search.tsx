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
import React, { useEffect, useState } from "react"
import {
  Configure,
  connectInfiniteHits,
  connectStats,
  InfiniteHitsProvided,
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

const List: React.FC<InfiniteHitsProvided> = (props) => {
  const { hits, hasMore, refineNext } = props

  const loadMore = () => {
    if (hasMore) {
      refineNext()
    }
  }

  return (
    <FlatList
      data={hits}
      keyExtractor={(hit) => hit.objectID}
      renderItem={({ item }) => {
        return (
          <Box p={2}>
            <Text>{item.name}</Text>
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

const ConnectedList = connectInfiniteHits(List)
const ConnectedHeader = connectStats(Header)

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
  return filters.reduce((acc, filter) => {
    const facetKey = facetKeyByFilterParamName[filter.paramName]

    if (facetKey) {
      if (Array.isArray(filter.paramValue)) {
        const facets = filter.paramValue.map((value) => {
          return `${facetKey}:${value}`
        })

        return [...acc, facets]
      }
    }

    return acc
  }, [] as any)
}

export const Search: React.FC<SearchProps> = (props) => {
  const { system, relay, onFilterPress } = props
  const setAggregations = ArtworksFiltersStore.useStoreActions((action) => action.setAggregationsAction)
  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)

  const [query, setQuery] = useState("Ennui")
  const [facetFilters, setFacetFilters] = useState([])

  const { searchClient } = useAlgoliaClient(system?.algolia?.appID!, system?.algolia?.apiKey!)

  useEffect(() => {
    const getFacets = async () => {
      try {
        const results = await searchClient!.initIndex(INDEX_NAME).search(query, {
          facets: ["*"],
        })
        const aggregations = convertFacetsToAggregations(results.facets ?? {})

        console.log("[debug] results", results)

        setAggregations(aggregations)
      } catch (error) {
        console.log("[debug] error", error)
      }
    }

    if (searchClient) {
      getFacets()
    }
  }, [searchClient, query])

  useEffect(() => {
    const facets = convertFiltersToFacetFilters(appliedFilters)
    setFacetFilters(facets)
  }, [appliedFilters])

  if (searchClient) {
    return (
      <Box flex={1}>
        <Box pt={2} pb={1} px={2}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            style={{ borderColor: "black", borderWidth: 1, padding: 10 }}
          />
        </Box>
        <InstantSearch searchClient={searchClient} indexName={INDEX_NAME}>
          <ConnectedHeader onFilterPress={onFilterPress} />
          <RefetchWhenApiKeyExpiredContainer relay={relay} />
          <Configure hitsPerPage={HITS_PER_PAGE} query={query} facetFilters={facetFilters} />
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

        return <SearchRefetchContainer system={props?.system ?? null} />
      }}
      variables={{}}
    />
  )
}
