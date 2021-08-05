import { captureMessage } from "@sentry/react-native"
import { SavedSearchButton_me } from "__generated__/SavedSearchButton_me.graphql"
import { SavedSearchButtonQuery } from "__generated__/SavedSearchButtonQuery.graphql"
import { FilterParams, prepareFilterParamsForSaveSearchInput } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { SearchCriteriaAttributes } from "lib/Components/ArtworkFilter/SavedSearch/types"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { BellIcon, Button } from "palette"
import React from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface SavedSearchButtonProps {
  me?: SavedSearchButton_me | null
  loading?: boolean
  attributes: SearchCriteriaAttributes
  onCreateAlertPress: () => void
}

interface SavedSearchButtonQueryRendererProps {
  filters: FilterParams
  artistId: string
  onCreateAlertPress: () => void
}

export const SavedSearchButton: React.FC<SavedSearchButtonProps> = ({ me, loading, attributes, onCreateAlertPress }) => {
  const isSavedSearch = !!me?.savedSearch?.internalID
  const emptyAttributes = Object.keys(attributes).length === 0

  const handlePress = () => {
    onCreateAlertPress()
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

export const SavedSearchButtonFragmentContainer = createFragmentContainer(SavedSearchButton, {
  me: graphql`
    fragment SavedSearchButton_me on Me @argumentDefinitions(criteria: { type: "SearchCriteriaAttributes" }) {
      savedSearch(criteria: $criteria) {
        internalID
      }
    }
  `,
})

export const SavedSearchButtonQueryRenderer: React.FC<SavedSearchButtonQueryRendererProps> = (props) => {
  const { filters, artistId, onCreateAlertPress } = props
  const input = prepareFilterParamsForSaveSearchInput(filters)
  const attributes: SearchCriteriaAttributes = {
    artistID: artistId,
    ...input,
  }

  if (Object.keys(input).length === 0) {
    return <SavedSearchButton loading={false} attributes={input} onCreateAlertPress={onCreateAlertPress} />
  }

  return (
    <QueryRenderer<SavedSearchButtonQuery>
      environment={defaultEnvironment}
      query={graphql`
        query SavedSearchButtonQuery($criteria: SearchCriteriaAttributes!) {
          me {
            ...SavedSearchButton_me @arguments(criteria: $criteria)
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
          <SavedSearchButtonFragmentContainer
            me={relayProps?.me ?? null}
            loading={relayProps === null && error === null}
            attributes={input}
            onCreateAlertPress={onCreateAlertPress}
          />
        )
      }}
      variables={{
        criteria: attributes,
      }}
    />
  )
}
