import { ActionType, OwnerType, TappedCreateAlert, ToggledSavedSearch } from "@artsy/cohesion"
import { captureMessage } from "@sentry/react-native"
import { SavedSearchButton_me } from "__generated__/SavedSearchButton_me.graphql"
import { SavedSearchButtonQuery } from "__generated__/SavedSearchButtonQuery.graphql"
import { EventEmitter } from "events"
import { Aggregations, FilterData } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { getSearchCriteriaFromFilters } from "lib/Components/ArtworkFilter/SavedSearch/searchCriteriaHelpers"
import { SearchCriteriaAttributes } from "lib/Components/ArtworkFilter/SavedSearch/types"
import { usePopoverMessage } from "lib/Components/PopoverMessage/popoverMessageHooks"
import { navigate, NavigateOptions } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { useEnableMyCollection } from "lib/Scenes/MyCollection/MyCollection"
import { CreateSavedSearchAlert } from "lib/Scenes/SavedSearchAlert/CreateSavedSearchAlert"
import {
  CreateSavedSearchAlertParams,
  SavedSearchAlertFormPropsBase,
  SavedSearchAlertMutationResult,
} from "lib/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { BellIcon, Box, Button } from "palette"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { useTracking } from "react-tracking"

interface SavedSearchButtonProps extends SavedSearchAlertFormPropsBase {
  me?: SavedSearchButton_me | null
  loading?: boolean
  relay: RelayRefetchProp
  criteria: SearchCriteriaAttributes
  filters: FilterData[]
  aggregations: Aggregations
  artistSlug: string
}

interface SavedSearchButtonQueryRendererProps extends SavedSearchAlertFormPropsBase {
  artistSlug: string
  filters: FilterData[]
  aggregations: Aggregations
}

export const savedSearchEvents = new EventEmitter()

export const emitSavedSearchRefetchEvent = () => {
  savedSearchEvents.emit("refetch")
}

export const SavedSearchButton: React.FC<SavedSearchButtonProps> = ({
  me,
  loading,
  artistId,
  artistName,
  artistSlug,
  filters,
  aggregations,
  relay,
  criteria,
}) => {
  const tracking = useTracking()
  const shouldDisplayMyCollection = useEnableMyCollection()
  const [visibleForm, setVisibleForm] = useState(false)
  const [refetching, setRefetching] = useState(false)
  const popover = usePopoverMessage()
  const isSavedSearch = !!me?.savedSearch?.internalID

  const refetch = useCallback(() => {
    setRefetching(true)
    relay.refetch(
      { criteria },
      null,
      () => {
        setRefetching(false)
      },
      { force: true }
    )
  }, [criteria])

  const handleOpenForm = () => setVisibleForm(true)
  const handleCloseForm = () => setVisibleForm(false)

  const handleComplete = (result: SavedSearchAlertMutationResult) => {
    tracking.trackEvent(tracks.toggleSavedSearch(true, artistId, artistSlug, result.id))

    refetch()
    handleCloseForm()

    popover.show({
      title: "Your alert has been created.",
      message: "You can edit your alerts with your Profile.",
      onPress: async () => {
        const options: NavigateOptions = {
          popToRootTabView: true,
          showInTabName: "profile",
        }

        if (shouldDisplayMyCollection) {
          await navigate("/my-profile/settings", options)
          setTimeout(() => {
            navigate("/my-profile/saved-search-alerts")
          }, 100)

          return
        }

        navigate("/my-profile/saved-search-alerts", options)
      },
    })
  }

  const handleCreateAlertPress = () => {
    handleOpenForm()
    tracking.trackEvent(tracks.tappedCreateAlert(artistId, artistSlug))
  }

  useEffect(() => {
    savedSearchEvents.addListener("refetch", refetch)
    return () => {
      savedSearchEvents.removeListener("refetch", refetch)
    }
  }, [refetch])

  const params: CreateSavedSearchAlertParams = {
    artistId,
    artistName,
    filters,
    aggregations,
    me,
    onClosePress: handleCloseForm,
    onComplete: handleComplete,
  }

  return (
    <Box>
      <Button
        variant="fillDark"
        size="small"
        icon={<BellIcon fill="white100" width="16px" height="16px" />}
        disabled={isSavedSearch || filters.length === 0}
        loading={loading || refetching}
        onPress={handleCreateAlertPress}
        haptic
      >
        Create Alert
      </Button>
      <CreateSavedSearchAlert visible={visibleForm} params={params} />
    </Box>
  )
}

export const SavedSearchButtonRefetchContainer = createRefetchContainer(
  SavedSearchButton,
  {
    me: graphql`
      fragment SavedSearchButton_me on Me
      @argumentDefinitions(criteria: { type: "SearchCriteriaAttributes" }) {
        ...CreateSavedSearchContentContainerV1_me
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

export const SavedSearchButtonQueryRenderer: React.FC<SavedSearchButtonQueryRendererProps> = (
  props
) => {
  const { filters, artistId } = props
  const criteria = useMemo(
    () => getSearchCriteriaFromFilters(artistId, filters),
    [artistId, filters]
  )

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
          />
        )
      }}
      variables={{
        criteria,
      }}
      cacheConfig={{ force: true }}
    />
  )
}

export const tracks = {
  tappedCreateAlert: (artistId: string, artistSlug: string): TappedCreateAlert => ({
    action: ActionType.tappedCreateAlert,
    context_screen_owner_type: OwnerType.artist,
    context_screen_owner_id: artistId,
    context_screen_owner_slug: artistSlug,
  }),
  toggleSavedSearch: (
    enabled: boolean,
    artistId: string,
    artistSlug: string,
    searchCriteriaId: string
  ): ToggledSavedSearch => ({
    action: ActionType.toggledSavedSearch,
    context_screen_owner_type: OwnerType.artist,
    context_screen_owner_id: artistId,
    context_screen_owner_slug: artistSlug,
    modified: enabled,
    original: !enabled,
    search_criteria_id: searchCriteriaId,
  }),
}
