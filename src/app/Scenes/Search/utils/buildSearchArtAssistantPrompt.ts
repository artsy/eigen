import {
  FilterArray,
  FilterDisplayName,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"

const FILTER_LABELS: Partial<Record<FilterParamName, string>> = {
  [FilterParamName.additionalGeneIDs]: FilterDisplayName.additionalGeneIDs,
  [FilterParamName.artistNationalities]: FilterDisplayName.artistNationalities,
  [FilterParamName.attributionClass]: FilterDisplayName.attributionClass,
  [FilterParamName.colors]: FilterDisplayName.colors,
  [FilterParamName.locationCities]: FilterDisplayName.locationCities,
  [FilterParamName.materialsTerms]: FilterDisplayName.materialsTerms,
  [FilterParamName.medium]: FilterDisplayName.medium,
  [FilterParamName.partnerIDs]: FilterDisplayName.partnerIDs,
  [FilterParamName.priceRange]: FilterDisplayName.priceRange,
  [FilterParamName.sizes]: FilterDisplayName.sizes,
  [FilterParamName.sort]: FilterDisplayName.sort,
  [FilterParamName.timePeriod]: FilterDisplayName.timePeriod,
  [FilterParamName.waysToBuyBid]: FilterDisplayName.waysToBuy,
  [FilterParamName.waysToBuyContactGallery]: FilterDisplayName.waysToBuy,
  [FilterParamName.waysToBuyMakeOffer]: FilterDisplayName.waysToBuy,
  [FilterParamName.waysToBuyPurchase]: FilterDisplayName.waysToBuy,
}

interface BuildSearchArtAssistantPromptOptions {
  query: string
  filters: FilterArray
}

// Turns the current search into the first message for Art Assistant. Returns an empty string when
// there is nothing to carry over.
export const buildSearchArtAssistantPrompt = ({
  query,
  filters,
}: BuildSearchArtAssistantPromptOptions): string => {
  const trimmedQuery = query.trim()
  const filterSummary = summarizeFilters(filters)

  if (!trimmedQuery && !filterSummary) {
    return ""
  }

  const queryPart = trimmedQuery ? ` for "${trimmedQuery}"` : ""
  const filterPart = filterSummary ? ` with these filters: ${filterSummary}` : ""

  return `Find artworks${queryPart}${filterPart}.`
}

const summarizeFilters = (filters: FilterArray) => {
  const displayTextsByLabel = new Map<string, string[]>()
  const unlabeledDisplayTexts: string[] = []

  filters.forEach(({ paramName, displayText }) => {
    const label = FILTER_LABELS[paramName]

    if (!label) {
      unlabeledDisplayTexts.push(displayText)
      return
    }

    displayTextsByLabel.set(label, [...(displayTextsByLabel.get(label) ?? []), displayText])
  })

  return [
    ...Array.from(displayTextsByLabel, ([label, texts]) => `${label}: ${texts.join(", ")}`),
    ...unlabeledDisplayTexts,
  ].join("; ")
}
