import { ActionType, OwnerType, ToggledSavedSearch } from "@artsy/cohesion"
import { captureMessage } from "@sentry/react-native"
import { SavedSearchBanner_me } from "__generated__/SavedSearchBanner_me.graphql"
import { SavedSearchBannerCreateSavedSearchMutation } from "__generated__/SavedSearchBannerCreateSavedSearchMutation.graphql"
import { SavedSearchBannerDeleteSavedSearchMutation } from "__generated__/SavedSearchBannerDeleteSavedSearchMutation.graphql"
import { SavedSearchBannerQuery } from "__generated__/SavedSearchBannerQuery.graphql"
import { FilterParams, prepareFilterParamsForSaveSearchInput } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { SearchCriteriaAttributes } from "lib/Components/ArtworkFilter/SavedSearch/types"
import { usePopoverMessage } from "lib/Components/PopoverMessage/popoverMessageHooks"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PushAuthorizationStatus } from "lib/Scenes/MyProfile/MyProfilePushNotifications"
import { Button, Flex, Text } from "palette"
import React, { useState } from "react"
import { Alert, Linking, Platform } from "react-native"
import { commitMutation, createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { useTracking } from "react-tracking"

interface SavedSearchBannerProps {
  me?: SavedSearchBanner_me | null
  artistId: string
  artistSlug: string
  attributes: SearchCriteriaAttributes
  loading?: boolean
  relay: RelayRefetchProp
}

export const SavedSearchBanner: React.FC<SavedSearchBannerProps> = ({
  me,
  artistId,
  artistSlug,
  attributes,
  loading,
  relay,
}) => {
  const [saving, setSaving] = useState(false)
  const popoverMessage = usePopoverMessage()
  const enabled = !!me?.savedSearch?.internalID
  const inProcess = loading || saving
  const tracking = useTracking()

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

  const checkNotificationPermissionsAndCreate = () => {
    if (Platform.OS === "android") {
      // TODO:- When android Push notification setup is ready add check for permission
      // NotificationManagerCompat.from(getReactApplicationContext()).areNotificationsEnabled();
      createSavedSearch()
      return
    }
    LegacyNativeModules.ARTemporaryAPIModule.fetchNotificationPermissions((_, result: PushAuthorizationStatus) => {
      switch (result) {
        case PushAuthorizationStatus.Authorized:
          return createSavedSearch()
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

  const handleSaveSearchFiltersPress = () => {
    if (inProcess) {
      return
    }

    if (enabled) {
      deleteSavedSearch()
    } else {
      checkNotificationPermissionsAndCreate()
    }
  }

  const trackToggledSavedSearchEvent = (modified: boolean, searchCriteriaId: string | undefined) => {
    if (searchCriteriaId) {
      tracking.trackEvent(tracks.toggleSavedSearch(modified, artistId, artistSlug, searchCriteriaId))
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
        {enabled ? "Remove alert with these filters" : "Set alert with these filters"}
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

export const SavedSearchBannerQueryRender: React.FC<{
  filters: FilterParams
  artistId: string
  artistSlug: string
}> = ({ filters, artistId, artistSlug }) => {
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
      render={({ props, error }) => {
        if (error) {
          if (__DEV__) {
            console.error(error)
          } else {
            captureMessage(error.stack!)
          }
        }

        return (
          <SavedSearchBannerRefetchContainer
            me={props?.me ?? null}
            loading={props === null && error === null}
            attributes={attributes}
            artistId={artistId}
            artistSlug={artistSlug}
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
