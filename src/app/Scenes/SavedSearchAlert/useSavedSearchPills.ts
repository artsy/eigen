import {
  SearchCriteria,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { useEffect } from "react"
import { fetchQuery, graphql } from "react-relay"
import { SavedSearchStore } from "./SavedSearchStore"

export interface PillPreview {
  label: string
  paramName: SearchCriteria
  value: string
}

export const useSavedSearchPills = () => {
  const attributes = SavedSearchStore.useStoreState((state) => state.attributes)

  const setPreview = SavedSearchStore.useStoreActions((actions) => actions.setPreviewAction)
  const preview = SavedSearchStore.useStoreState((state) => state.preview)

  const {
    dimensionRange: _dimensionRange,
    displayName: _displayName,
    ...cleanAttributes
  } = attributes as { [key: string]: any }

  useEffect(() => {
    fetchPreview(cleanAttributes).then((data) => {
      if (data?.viewer?.previewSavedSearch?.labels) {
        setPreview(data.viewer.previewSavedSearch.labels)
      }
    })
  }, [attributes])

  return preview
}

export const fetchPreview = (attributes: SearchCriteriaAttributes) => {
  return fetchQuery<any>(
    getRelayEnvironment(),
    graphql`
      query useSavedSearchPillsPreviewQuery($attributes: PreviewSavedSearchAttributes) {
        viewer {
          previewSavedSearch(attributes: $attributes) {
            labels {
              label: displayValue
              paramName: field
              value
            }
          }
        }
      }
    `,
    { attributes: attributes }
  ).toPromise()
}
