import { Spacer } from "@artsy/palette-mobile"
import { ResultWithHighlight } from "app/Scenes/Search/components/ResultWithHighlight"
import { PillType } from "app/Scenes/Search/types"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { Flex, Touchable } from "palette"
import { IMAGE_SIZE, SearchResultImage } from "./SearchResultImage"

interface ElasticSearchResult {
  __typename: string
  displayLabel: string | null
  href: string | null
  imageUrl: string | null
  internalID?: string
  slug?: string
}

interface ElasticSearchResultItemProps {
  result: ElasticSearchResult
  selectedPill: PillType
  query?: string
}

export const ElasticSearchResult: React.FC<ElasticSearchResultItemProps> = ({
  query,
  result,
  selectedPill,
}) => {
  const addArtworkToRecentSearches = () => {
    GlobalStore.actions.search.addRecentSearch({
      type: "AUTOSUGGEST_RESULT_TAPPED",
      props: {
        imageUrl: result.imageUrl,
        href: result.href,
        slug: result.slug,
        displayLabel: result.displayLabel,
        __typename: selectedPill.displayName,
        displayType: selectedPill.displayName,
      },
    })
  }

  // TODO: Re-enable tracking
  // const trackResultPress = (elasticSearchResult: ElasticSearchResult) => {
  // }

  const onPress = (): void => {
    if (result.href === null) {
      return
    }

    navigate(result.href)
    addArtworkToRecentSearches()

    // TODO: Re-enable tracking
    // trackResultPress?.(result)
  }

  return (
    <Touchable onPress={onPress}>
      <Flex height={IMAGE_SIZE} flexDirection="row" alignItems="center">
        <SearchResultImage imageURL={result.imageUrl} resultType={selectedPill.displayName} />

        <Spacer x={1} />

        <Flex flex={1}>
          <ResultWithHighlight displayLabel={result.displayLabel!} highlight={query} />
        </Flex>
      </Flex>
    </Touchable>
  )
}
