import { captureMessage } from "@sentry/react-native"
import { SavedSearchButton_me } from "__generated__/SavedSearchButton_me.graphql"
import { SavedSearchButtonQuery } from "__generated__/SavedSearchButtonQuery.graphql"
import {
  getAllowedFiltersForSavedSearchInput,
  getSearchCriteriaFromFilters,
} from "lib/Components/ArtworkFilter/SavedSearch/searchCriteriaHelpers"
import { SearchCriteriaAttributes } from "lib/Components/ArtworkFilter/SavedSearch/types"
import { usePopoverMessage } from "lib/Components/PopoverMessage/popoverMessageHooks"
import { navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { CreateSavedSearchAlert } from "lib/Scenes/SavedSearchAlert/CreateSavedSearchAlert"
import { SavedSearchAlertFormPropsBase } from "lib/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { BellIcon, Box, Button } from "palette"
import React, { useState } from "react"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"

interface SavedSearchButtonProps extends SavedSearchAlertFormPropsBase {
  me?: SavedSearchButton_me | null
  loading?: boolean
  relay: RelayRefetchProp
  criteria: SearchCriteriaAttributes
}

export const SavedSearchButton: React.FC<SavedSearchButtonProps> = ({
  me,
  loading,
  artist,
  filters,
  aggregations,
  relay,
  criteria,
}) => {
  const [visibleForm, setVisibleForm] = useState(false)
  const [refetching, setRefetching] = useState(false)
  const popover = usePopoverMessage()
  const isSavedSearch = !!me?.savedSearch?.internalID

  const refetch = () => {
    setRefetching(true)
    relay.refetch(
      { criteria },
      null,
      () => {
        setRefetching(false)
      },
      { force: true }
    )
  }

  const handleOpenForm = () => setVisibleForm(true)
  const handleCloseForm = () => setVisibleForm(false)

  const handleComplete = () => {
    refetch()
    handleCloseForm()

    popover.show({
      title: "Your alert has been created.",
      message: "You can edit your alerts with your Profile.",
      onPress: () => {
        navigate("my-profile/saved-search-alerts", {
          popToRootTabView: true,
        })
      },
    })
  }

  return (
    <Box>
      <Button
        variant="primaryBlack"
        size="small"
        icon={<BellIcon fill="white100" mr={0.5} width="16px" height="16px" />}
        disabled={isSavedSearch || filters.length === 0}
        loading={loading || refetching}
        onPress={handleOpenForm}
        testID="create-saved-search-button"
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
    </Box>
  )
}

export const SavedSearchButtonRefetchContainer = createRefetchContainer(
  SavedSearchButton,
  {
    me: graphql`
      fragment SavedSearchButton_me on Me @argumentDefinitions(criteria: { type: "SearchCriteriaAttributes" }) {
        savedSearch(criteria: $criteria) {
          internalID
        }
      }
    `,
  },
  graphql`
    query SavedSearchButtonRefetchQuery($criteria: SearchCriteriaAttributes) {
      me {
        ...SavedSearchButton_me @arguments(criteria: $criteria)
      }
    }
  `
)

export const SavedSearchButtonQueryRenderer: React.FC<SavedSearchAlertFormPropsBase> = (props) => {
  const { filters, artist } = props
  const allowedFilters = getAllowedFiltersForSavedSearchInput(filters)
  const isEmptyCriteria = allowedFilters.length === 0
  const criteria = getSearchCriteriaFromFilters(artist.id, filters)

  if (isEmptyCriteria) {
    return <SavedSearchButtonRefetchContainer me={null} loading={false} criteria={criteria} {...props} />
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
          <SavedSearchButtonRefetchContainer
            {...props}
            me={relayProps?.me ?? null}
            loading={relayProps === null && error === null}
            criteria={criteria}
            filters={allowedFilters}
          />
        )
      }}
      variables={{
        criteria,
      }}
    />
  )
}
