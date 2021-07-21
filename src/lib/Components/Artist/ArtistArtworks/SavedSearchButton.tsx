import { captureMessage } from "@sentry/react-native"
import { SavedSearchButtonQuery } from "__generated__/SavedSearchButtonQuery.graphql"
import { FilterParams, prepareFilterParamsForSaveSearchInput } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { SearchCriteriaAttributes } from "lib/Components/ArtworkFilter/SavedSearch/types"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { BellIcon, Button } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"

interface SavedSearchButtonProps {
  isSavedSearch: boolean
  loading?: boolean
  attributes: SearchCriteriaAttributes
}

interface SavedSearchButtonQueryRenderProps {
  filters: FilterParams
  artistId: string
}

export const SavedSearchButton: React.FC<SavedSearchButtonProps> = ({
  isSavedSearch,
  loading,
  attributes,
}) => {
  console.log('[debug] attributes', attributes)
  console.log('[debug] isSavedSearch', isSavedSearch)
  console.log('[debug] loading', loading)

  const emptyAttributes = Object.keys(attributes).length === 0

  const handlePress = () => {
    console.log('saved search button pressed')
  }

  return (
    <Button
      variant="primaryBlack"
      size="small"
      icon={<BellIcon fill="white100" mr={0.5} width="16px" height="16px" />}
      disabled={isSavedSearch || emptyAttributes}
      loading={loading}
      onPress={handlePress}
      haptic
    >
      Create Alert
    </Button>
  )
}

export const SavedSearchButtonQueryRender: React.FC<SavedSearchButtonQueryRenderProps> = (props) => {
  const { filters, artistId } = props
  const input = prepareFilterParamsForSaveSearchInput(filters)
  const attributes: SearchCriteriaAttributes = {
    artistID: artistId,
    ...input,
  }

  return (
    <QueryRenderer<SavedSearchButtonQuery>
      environment={defaultEnvironment}
      query={graphql`
        query SavedSearchButtonQuery($criteria: SearchCriteriaAttributes!) {
          me {
            savedSearch(criteria: $criteria) {
              internalID
            }
          }
        }
      `}
      render={({ props: relayProps, error }) => {
        if (error) {
          if (__DEV__) {
            console.error(error)
          } else {
            captureMessage(error.stack!)
          }
        }

        return (
          <SavedSearchButton
            isSavedSearch={!!relayProps?.me?.savedSearch?.internalID ?? false}
            loading={relayProps === null && error === null}
            attributes={input}
          />
        )
      }}
      variables={{
        criteria: attributes,
      }}
    />
  )
}

