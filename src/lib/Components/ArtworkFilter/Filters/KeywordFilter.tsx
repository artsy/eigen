import { ActionType, ContextModule } from "@artsy/cohesion"
import { filterArtworksParams, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { Input } from "lib/Components/Input/Input"
import SearchIcon from "lib/Icons/SearchIcon"
import { OwnerEntityTypes, PageNames } from "lib/utils/track/schema"
import { debounce } from "lodash"
import React, { useEffect, useMemo, useRef } from "react"
import { useTracking } from "react-tracking"

interface KeywordFilterProps {
  artistId: string
  artistSlug: string
}

export const KeywordFilter: React.FC<KeywordFilterProps> = ({ artistId, artistSlug }) => {
  const tracking = useTracking()

  const appliedFiltersState = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions((state) => state.selectFiltersAction)
  const applyFiltersAction = ArtworksFiltersStore.useStoreActions((action) => action.applyFiltersAction)
  const appliedFiltersParams = filterArtworksParams(appliedFiltersState, "auctionResult")

  const inputRef = useRef(null)

  const updateKeywordFilter = (text: string) => {
    selectFiltersAction({
      paramName: FilterParamName.keyword,
      displayText: text,
      paramValue: text,
    })

    tracking.trackEvent(tracks.changeKeywordFilter(appliedFiltersParams, text, artistId, artistSlug))

    applyFiltersAction()
  }

  const handleChangeText = useMemo(() => debounce(updateKeywordFilter, 300), [appliedFiltersParams])

  // clear input text when keyword filter is reseted
  useEffect(() => {
    const appliedKeywordFilter = appliedFiltersState?.find((filter) => filter.paramName === FilterParamName.keyword)

    if (appliedKeywordFilter?.paramValue || !inputRef.current) {
      return
    }

    ;(inputRef as any).current?.blur()
    ;(inputRef as any).current?.clear()
  }, [appliedFiltersState])

  // Stop the invocation of the debounced function after unmounting
  useEffect(() => {
    return () => handleChangeText.cancel()
  }, [])

  return (
    <Input
      icon={<SearchIcon width={18} height={18} />}
      placeholder="Search by artwork title, series, or description"
      onChangeText={handleChangeText}
      autoFocus={typeof jest === "undefined"}
      autoCorrect={false}
      enableClearButton={true}
      ref={inputRef}
    />
  )
}

const tracks = {
  changeKeywordFilter: (appliedFiltersParams: any, text: string, artistId: string, artistSlug: string) => {
    return {
      context_module: ContextModule.auctionResults,
      context_screen: PageNames.ArtistPage,
      context_screen_owner_type: OwnerEntityTypes.Artist,
      context_screen_owner_id: artistId,
      context_screen_owner_slug: artistSlug,
      current: JSON.stringify(appliedFiltersParams),
      changed: JSON.stringify({
        [FilterParamName.keyword]: text,
      }),
      action_type: ActionType.auctionResultsFilterParamsChanged,
    }
  },
}
