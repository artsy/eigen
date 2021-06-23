import { ActionType, OwnerType, ToggledSavedSearch } from "@artsy/cohesion"
import { captureMessage } from "@sentry/react-native"
import { SavedSearchBanner_me } from "__generated__/SavedSearchBanner_me.graphql"
import { SavedSearchBannerCreateSavedSearchMutation } from "__generated__/SavedSearchBannerCreateSavedSearchMutation.graphql"
import { SavedSearchBannerCriteriaByIdQuery } from "__generated__/SavedSearchBannerCriteriaByIdQuery.graphql"
import { SavedSearchBannerDeleteSavedSearchMutation } from "__generated__/SavedSearchBannerDeleteSavedSearchMutation.graphql"
import { SavedSearchBannerQuery } from "__generated__/SavedSearchBannerQuery.graphql"
import {
  Aggregations,
  FilterArray,
  FilterParams,
  prepareFilterParamsForSaveSearchInput,
} from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { convertSavedSearchCriteriaToFilterParams } from "lib/Components/ArtworkFilter/SavedSearch/convertersToFilterParams"
import { SearchCriteriaAttributes } from "lib/Components/ArtworkFilter/SavedSearch/types"
import { usePopoverMessage } from "lib/Components/PopoverMessage/popoverMessageHooks"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PushAuthorizationStatus } from "lib/Scenes/MyProfile/MyProfilePushNotifications"
import { Button, Flex, Text } from "palette"
import React, { useState } from "react"
import { useEffect } from "react"
import { Alert, Linking, Platform } from "react-native"
import {
  commitMutation,
  createRefetchContainer,
  fetchQuery,
  graphql,
  QueryRenderer,
  RelayRefetchProp,
} from "react-relay"
import { useTracking } from "react-tracking"

interface SavedSearchBaseProps {
  artistId: string
  searchCriteriaId?: string
  aggregations?: Aggregations
  loading?: boolean
  shouldFetchCriteria?: boolean
  updateFilters: (params: FilterArray) => void
}

interface SavedSearchBannerQueryRenderProps extends SavedSearchBaseProps {
  filters: FilterParams
}

interface SavedSearchBannerProps extends SavedSearchBaseProps {
  me?: SavedSearchBanner_me | null
  attributes: SearchCriteriaAttributes
  relay: RelayRefetchProp
}

const getSearchCriteriaById = graphql`
  query SavedSearchBannerCriteriaByIdQuery($criteriaId: ID!) {
    me {
      email
      savedSearch(id: $criteriaId) {
        acquireable
        additionalGeneIDs
        artistID
        atAuction
        attributionClass
        colors
        dimensionRange
        height
        inquireableOnly
        locationCities
        majorPeriods
        materialsTerms
        offerable
        partnerIDs
        priceRange
        width
      }
    }
  }
`

export const SavedSearchBanner: React.FC<SavedSearchBannerProps> = (props) => {
  const {
    me,
    artistId,
    attributes,
    searchCriteriaId,
    loading,
    shouldFetchCriteria,
    aggregations,
    updateFilters,
    relay,
  } = props
  const [saving, setSaving] = useState(false)
  const popoverMessage = usePopoverMessage()
  const enabled = !!me?.savedSearch?.internalID
  const inProcess = loading || saving
  const tracking = useTracking()

  useEffect(() => {
    if (shouldFetchCriteria && searchCriteriaId && aggregations?.length! > 0) {
      const fetchCriteriaAndUpdateFilters = async () => {
        try {
          const response = await fetchQuery<SavedSearchBannerCriteriaByIdQuery>(
            relay.environment,
            getSearchCriteriaById,
            {
              criteriaId: searchCriteriaId,
            },
            { force: true }
          )
          const searchCriteriaAttributes = response.me?.savedSearch as SearchCriteriaAttributes

          if (searchCriteriaAttributes) {
            const filterParams = convertSavedSearchCriteriaToFilterParams(searchCriteriaAttributes, aggregations!)
            updateFilters(filterParams)
          }
        } catch (error) {
          if (error) {
            if (__DEV__) {
              console.error(error)
            } else {
              captureMessage(error.stack!)
            }
          }
        }
      }

      fetchCriteriaAndUpdateFilters()
    }
  }, [shouldFetchCriteria, aggregations, searchCriteriaId])

  // doing refetch as opposed to updating `enabled` in state with savedSearch internalID
  // because change in applied filters will update the `me` prop in the QueryRenderer
  const doRefetch = () => {
    relay.refetch(
      { criteria: attributes },
      null,
      () => {
        setSaving(false)
      },
      { force: true }
    )
  }

  const showErrorPopover = () => {
    popoverMessage.show({
      title: "Sorry, an error occured.",
      message: "Please try again.",
      placement: "top",
      type: "error",
    })
  }

  const createSavedSearch = () => {
    setSaving(true)
    commitMutation<SavedSearchBannerCreateSavedSearchMutation>(relay.environment, {
      mutation: graphql`
        mutation SavedSearchBannerCreateSavedSearchMutation($input: CreateSavedSearchInput!) {
          createSavedSearch(input: $input) {
            savedSearchOrErrors {
              ... on SearchCriteria {
                internalID
              }
            }
          }
        }
      `,
      variables: {
        input: {
          attributes,
        },
      },
      onCompleted: (response) => {
        doRefetch()
        popoverMessage.show({
          title: "Your alert has been set.",
          message: "We will send you a push notification once new works are added.",
          placement: "top",
        })
        trackToggledSavedSearchEvent(true, response.createSavedSearch?.savedSearchOrErrors.internalID)
      },
      onError: () => {
        setSaving(false)
        showErrorPopover()
      },
    })
  }

  const deleteSavedSearch = () => {
    setSaving(true)
    commitMutation<SavedSearchBannerDeleteSavedSearchMutation>(relay.environment, {
      mutation: graphql`
        mutation SavedSearchBannerDeleteSavedSearchMutation($input: DeleteSavedSearchInput!) {
          deleteSavedSearch(input: $input) {
            savedSearchOrErrors {
              ... on SearchCriteria {
                internalID
              }
            }
          }
        }
      `,
      variables: {
        input: {
          searchCriteriaID: me!.savedSearch!.internalID,
        },
      },
      onCompleted: (response) => {
        doRefetch()
        popoverMessage.show({
          title: "Your alert has been removed.",
          message: "Don't worry, you can always create a new one.",
          placement: "top",
        })
        trackToggledSavedSearchEvent(false, response.deleteSavedSearch?.savedSearchOrErrors.internalID)
      },
      onError: () => {
        setSaving(false)
        showErrorPopover()
      },
    })
  }

  const handleSaveSearchFiltersPress = () => {
    if (inProcess) {
      return
    }
    const executeSaveSearch = () => {
      if (enabled) {
        deleteSavedSearch()
      } else {
        createSavedSearch()
      }
    }
    if (Platform.OS === "android") {
      // TODO:- When android Push notification setup is ready add check for permission
      // NotificationManagerCompat.from(getReactApplicationContext()).areNotificationsEnabled();
      executeSaveSearch()
      return
    }
    LegacyNativeModules.ARTemporaryAPIModule.fetchNotificationPermissions((_, result: PushAuthorizationStatus) => {
      switch (result) {
        case PushAuthorizationStatus.Authorized:
          return executeSaveSearch()
        case PushAuthorizationStatus.Denied:
          return Alert.alert(
            "Turn on notifications",
            'To receive push notification alerts from Artsy on new works by this artist, you\'ll need to enable them in your iOS Settings. Tap Notifications, and then toggle "Allow Notifications" on.',
            [
              {
                text: "Settings",
                onPress: () => Linking.openURL("App-prefs:NOTIFICATIONS_ID"),
              },
              {
                text: "Cancel",
                style: "cancel",
              },
            ]
          )
        case PushAuthorizationStatus.NotDetermined:
          return Alert.alert(
            "Turn on notifications",
            "Artsy needs your permission to send push notification alerts on new works by this artist.",
            [
              {
                text: "Proceed",
                onPress: () => LegacyNativeModules.ARTemporaryAPIModule.requestNotificationPermissions(),
              },
              {
                text: "Cancel",
                style: "cancel",
              },
            ]
          )
        default:
          return
      }
    })
  }

  const trackToggledSavedSearchEvent = (modified: boolean, id: string | undefined) => {
    if (id) {
      tracking.trackEvent(tracks.toggleSavedSearch(modified, artistId, id))
    }
  }

  return (
    <Flex
      backgroundColor="white"
      flexDirection="row"
      mx={-2}
      px={2}
      py={11}
      justifyContent="space-between"
      alignItems="center"
    >
      <Text variant="small" color="black">
        New works alert for this search
      </Text>
      <Button
        variant={enabled ? "secondaryOutline" : "primaryBlack"}
        onPress={handleSaveSearchFiltersPress}
        size="small"
        loading={inProcess}
        longestText="Disable"
        haptic
      >
        {enabled ? "Disable" : "Enable"}
      </Button>
    </Flex>
  )
}

export const SavedSearchBannerRefetchContainer = createRefetchContainer(
  SavedSearchBanner,
  {
    me: graphql`
      fragment SavedSearchBanner_me on Me @argumentDefinitions(criteria: { type: "SearchCriteriaAttributes" }) {
        savedSearch(criteria: $criteria) {
          internalID
        }
      }
    `,
  },
  graphql`
    query SavedSearchBannerRefetchQuery($criteria: SearchCriteriaAttributes) {
      me {
        ...SavedSearchBanner_me @arguments(criteria: $criteria)
      }
    }
  `
)

export const SavedSearchBannerQueryRender: React.FC<SavedSearchBannerQueryRenderProps> = (props) => {
  const { filters, artistId, searchCriteriaId, aggregations, loading, shouldFetchCriteria, updateFilters } = props
  const input = prepareFilterParamsForSaveSearchInput(filters)
  const attributes: SearchCriteriaAttributes = {
    artistID: artistId,
    ...input,
  }

  return (
    <QueryRenderer<SavedSearchBannerQuery>
      environment={defaultEnvironment}
      query={graphql`
        query SavedSearchBannerQuery($criteria: SearchCriteriaAttributes!) {
          me {
            ...SavedSearchBanner_me @arguments(criteria: $criteria)
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
          <SavedSearchBannerRefetchContainer
            me={relayProps?.me ?? null}
            loading={(relayProps === null && error === null) || !!loading}
            attributes={attributes}
            artistId={artistId}
            searchCriteriaId={searchCriteriaId}
            aggregations={aggregations}
            shouldFetchCriteria={shouldFetchCriteria}
            updateFilters={updateFilters}
          />
        )
      }}
      variables={{
        criteria: attributes,
      }}
    />
  )
}

export const tracks = {
  toggleSavedSearch: (enabled: boolean, artistId: string, searchCriteriaId: string): ToggledSavedSearch => ({
    action: ActionType.toggledSavedSearch,
    context_screen_owner_type: OwnerType.artist,
    context_screen_owner_id: artistId,
    modified: enabled,
    original: !enabled,
    search_criteria_id: searchCriteriaId,
  }),
}
