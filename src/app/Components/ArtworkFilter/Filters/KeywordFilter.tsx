import { ActionType, ContextModule } from "@artsy/cohesion"
import {
  filterArtworksParams,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import SearchIcon from "app/Icons/SearchIcon"
import { OwnerEntityTypes, PageNames } from "app/utils/track/schema"
import { debounce, throttle } from "lodash"
import { Input } from "palette"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { Platform } from "react-native"
import { useTracking } from "react-tracking"
import usePrevious from "react-use/lib/usePrevious"

export const DEBOUNCE_DELAY = 400

interface KeywordFilterProps {
  artistId: string
  artistSlug: string
  onFocus?: () => void
  loading?: boolean
  onTypingStart?: () => void
}

export const KeywordFilter: React.FC<KeywordFilterProps> = ({
  artistId,
  artistSlug,
  loading,
  onFocus,
  onTypingStart,
}) => {
  const { trackEvent } = useTracking()

  const appliedFiltersState = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const applyFilters = ArtworksFiltersStore.useStoreState((state) => state.applyFilters)

  const selectFiltersAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.selectFiltersAction
  )
  const applyFiltersAction = ArtworksFiltersStore.useStoreActions(
    (action) => action.applyFiltersAction
  )
  const appliedFiltersParams = filterArtworksParams(appliedFiltersState, "auctionResult")
  const [keyword, setKeyword] = useState("")
  const prevKeyword = usePrevious(keyword)

  const inputRef = useRef(null)

  const updateKeywordFilter = (text: string) => {
    setKeyword(text)
  }

  const handleChangeText = useMemo(
    () => debounce(updateKeywordFilter, DEBOUNCE_DELAY),
    [appliedFiltersParams]
  )
  const handleTypingStart = useMemo(
    () => throttle(() => onTypingStart?.(), DEBOUNCE_DELAY),
    [onTypingStart]
  )

  // clear input text when keyword filter is reseted
  useEffect(() => {
    const appliedKeywordFilter = appliedFiltersState?.find(
      (filter) => filter.paramName === FilterParamName.keyword
    )

    if (appliedKeywordFilter?.paramValue || !inputRef.current) {
      return
    }
  }, [appliedFiltersState])

  useEffect(() => {
    if (prevKeyword === keyword) {
      return
    }

    selectFiltersAction({
      paramName: FilterParamName.keyword,
      displayText: keyword,
      paramValue: keyword,
    })

    trackEvent(tracks.changeKeywordFilter(appliedFiltersParams, keyword, artistId, artistSlug))
    applyFiltersAction()
  }, [applyFilters, keyword, prevKeyword])

  // Stop the invocation of the debounced function after unmounting
  useEffect(() => {
    return () => handleChangeText.cancel()
  }, [])

  // Truncate placeholder for Android to prevent new line.
  const placeholder =
    Platform.OS === "android" && loading
      ? "Search by artwork title, series..."
      : "Search by artwork title, series, or description"

  return (
    <Input
      loading={loading}
      icon={<SearchIcon width={18} height={18} />}
      placeholder={placeholder}
      onChangeText={(e) => {
        handleTypingStart()
        handleChangeText(e)
      }}
      autoCorrect={false}
      enableClearButton
      ref={inputRef}
      onFocus={onFocus}
    />
  )
}

const tracks = {
  changeKeywordFilter: (
    appliedFiltersParams: any,
    text: string,
    artistId: string,
    artistSlug: string
  ) => {
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
