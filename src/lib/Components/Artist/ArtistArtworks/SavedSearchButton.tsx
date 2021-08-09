import { captureMessage } from "@sentry/react-native"
import { SavedSearchButton_me } from "__generated__/SavedSearchButton_me.graphql"
import { SavedSearchButtonQuery } from "__generated__/SavedSearchButtonQuery.graphql"
import {
  getAllowedFiltersForSavedSearchInput,
  getSearchCriteriaFromFilters,
} from "lib/Components/ArtworkFilter/SavedSearch/searchCriteriaHelpers"
import { usePopoverMessage } from "lib/Components/PopoverMessage/popoverMessageHooks"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { CreateSavedSearchAlert } from "lib/Scenes/SavedSearchAlert/CreateSavedSearchAlert"
import { SavedSearchAlertFormPropsBase } from "lib/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { BellIcon, Button } from "palette"
import React, { useState } from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface SavedSearchButtonProps extends SavedSearchAlertFormPropsBase {
  me?: SavedSearchButton_me | null
  loading?: boolean
  isEmptyCriteria: boolean
}

export const SavedSearchButton: React.FC<SavedSearchButtonProps> = ({
  me,
  loading,
  isEmptyCriteria,
  artist,
  filters,
  aggregations,
}) => {
  const [visibleForm, setVisibleForm] = useState(false)
  const popover = usePopoverMessage()
  const isSavedSearch = !!me?.savedSearch?.internalID

  const handleOpenForm = () => setVisibleForm(true)
  const handleCloseForm = () => setVisibleForm(false)

  const handleComplete = () => {
    handleCloseForm()

    popover.show({
      title: "Your alert has been created.",
      message: "You can edit your alerts with your Profile.",
    })
  }

  return (
    <>
      <Button
        variant="primaryBlack"
        size="small"
        icon={<BellIcon fill="white100" mr={0.5} width="16px" height="16px" />}
        disabled={isSavedSearch || isEmptyCriteria}
        loading={loading}
        onPress={handleOpenForm}
        haptic
      >
        Create Alert
      </Button>
      <CreateSavedSearchAlert
        artist={artist}
        visible={visibleForm}
        onClosePress={handleCloseForm}
        onComplete={handleComplete}
        filters={filters}
        aggregations={aggregations}
      />
    </>
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

export const SavedSearchButtonQueryRenderer: React.FC<SavedSearchAlertFormPropsBase> = (props) => {
  const { filters, artist } = props
  const allowedFilters = getAllowedFiltersForSavedSearchInput(filters)
  const isEmptyCriteria = allowedFilters.length === 0

  if (isEmptyCriteria) {
    return <SavedSearchButton loading={false} isEmptyCriteria={true} {...props} />
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
            isEmptyCriteria={isEmptyCriteria}
            {...props}
          />
        )
      }}
      variables={{
        criteria: getSearchCriteriaFromFilters(artist.id, filters),
      }}
    />
  )
}
