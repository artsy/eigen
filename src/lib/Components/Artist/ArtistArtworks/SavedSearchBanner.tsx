import { captureMessage } from "@sentry/react-native"
import { SavedSearchBanner_me } from "__generated__/SavedSearchBanner_me.graphql"
import { SavedSearchBannerCreateSavedSearchMutation } from "__generated__/SavedSearchBannerCreateSavedSearchMutation.graphql"
import { SavedSearchBannerDeleteSavedSearchMutation } from "__generated__/SavedSearchBannerDeleteSavedSearchMutation.graphql"
import { SavedSearchBannerQuery, SearchCriteriaAttributes } from "__generated__/SavedSearchBannerQuery.graphql"
import { FilterParams, prepareFilterParamsForSaveSearchInput } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PushAuthorizationStatus } from "lib/Scenes/MyProfile/MyProfilePushNotifications"
import { Button, Flex, Text } from "palette"
import React, { useState } from "react"
import { Alert, Linking, Platform } from "react-native"
import { commitMutation, createFragmentContainer, graphql, QueryRenderer, RelayProp } from "react-relay"

interface SavedSearchBannerProps {
  me?: SavedSearchBanner_me | null
  artistId: string
  attributes: SearchCriteriaAttributes
  loading?: boolean
  relay: RelayProp
}

export const SavedSearchBanner: React.FC<SavedSearchBannerProps> = ({ me, attributes, loading, relay }) => {
  const [saving, setSaving] = useState(false)
  const enabled = !!me?.savedSearch?.internalID
  const inProcess = loading || saving

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
      onCompleted: () => {
        setSaving(false)
      },
      onError: () => {
        setSaving(false)
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
      onCompleted: () => {
        setSaving(false)
      },
      onError: () => {
        setSaving(false)
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
      if (result === PushAuthorizationStatus.Authorized) {
        executeSaveSearch()
      } else if (result === PushAuthorizationStatus.Denied) {
        // open settings banner
        Alert.alert(
          "Turn on notifications",
          'To receive push notifications from Artsy on new works by this artist, you\'ll need enable them in your iOS Settings. Tap Notifications, and then toggle "Allow Notifications" on.',
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
      } else if (result === PushAuthorizationStatus.NotDetermined) {
        Alert.alert(
          "Turn on notifications",
          "Artsy needs your permission to send push notifications alerts on this artist.",
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
      }
    })
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

export const SavedSearchBannerFragmentContainer = createFragmentContainer(SavedSearchBanner, {
  me: graphql`
    fragment SavedSearchBanner_me on Me @argumentDefinitions(criteria: { type: "SearchCriteriaAttributes" }) {
      savedSearch(criteria: $criteria) {
        internalID
      }
    }
  `,
})

export const SavedSearchBannerQueryRender: React.FC<{ filters: FilterParams; artistId: string }> = ({
  filters,
  artistId,
}) => {
  const input = prepareFilterParamsForSaveSearchInput(filters)
  const attributes = {
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
          <SavedSearchBannerFragmentContainer
            me={props?.me ?? null}
            loading={props === null && error === null}
            attributes={attributes}
            artistId={artistId}
          />
        )
      }}
      variables={{
        criteria: attributes,
      }}
    />
  )
}
