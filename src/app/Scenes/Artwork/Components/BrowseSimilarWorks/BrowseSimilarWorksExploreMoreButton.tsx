import { Button } from "@artsy/palette-mobile"
;("__generated__/BrowseSimilarWorksModalExploreMoreButtonQuery.graphql")
import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import { navigate } from "app/system/navigation/navigate"
import { FC } from "react"

const BUTTON_TEXT = "Explore more on Artsy"

export const BrowseSimilarWorksExploreMoreButton: FC<{
  attributes: SearchCriteriaAttributes
}> = ({ attributes }) => {
  const primaryArtistId = attributes.artistIDs?.[0]
  const artistHref = `/artist/${primaryArtistId}`

  // Prepare the criteria attributes to be passed to the predefined filters, so that when
  // an artist's artworks page is opened, the filters are applied.
  // Remove the artistIDs from the attributes, otherwise selected filters counter will
  // show the number of filters + 1 (the artistID).
  const attributesWithoutArtistIds = Object.fromEntries(
    Object.entries(attributes).filter(([key, _]) => key !== "artistIDs")
  )
  const attributesToPredefinedFilters = Object.entries(attributesWithoutArtistIds).map(
    ([key, value]) => {
      return {
        paramValue: value as string,
        paramName: key as FilterParamName,
      }
    }
  )

  return (
    <Button
      block
      onPress={() => {
        navigate(artistHref, {
          passProps: {
            predefinedFilters: attributesToPredefinedFilters,
          },
        })
      }}
    >
      {BUTTON_TEXT}
    </Button>
  )
}
