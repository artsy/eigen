import { OwnerType } from "@artsy/cohesion"
import { Screen, useColor } from "@artsy/palette-mobile"
import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native"
import { TransitionPresets, createStackNavigator } from "@react-navigation/stack"
import { EditSavedSearchAlertQuery } from "__generated__/EditSavedSearchAlertQuery.graphql"
import { EditSavedSearchAlert_artists$data } from "__generated__/EditSavedSearchAlert_artists.graphql"
import { EditSavedSearchAlert_viewer$data } from "__generated__/EditSavedSearchAlert_viewer.graphql"
import { SavedSearchAlertQuery } from "__generated__/SavedSearchAlertQuery.graphql"
import {
  SavedSearchEntity,
  SavedSearchEntityArtist,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import { useNavigationTheme } from "app/Navigation/useNavigationTheme"
import { AlertArtworks } from "app/Scenes/SavedSearchAlert/AlertArtworks"
import { EditSavedSearchAlertContent } from "app/Scenes/SavedSearchAlert/EditSavedSearchAlertContent"
import {
  EditSavedSearchAlertNavigationStack,
  EditSavedSearchAlertParams,
} from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { localizeHeightAndWidthAttributes } from "app/Scenes/SavedSearchAlert/helpers"
import { AlertPriceRangeScreenQueryRenderer } from "app/Scenes/SavedSearchAlert/screens/AlertPriceRangeScreen"
import { EmailPreferencesScreen } from "app/Scenes/SavedSearchAlert/screens/EmailPreferencesScreen"
import { SavedSearchFilterScreen } from "app/Scenes/SavedSearchAlert/screens/SavedSearchFilterScreen"
import { GoBackProps, goBack, navigationEvents } from "app/system/navigation/navigate"
import {
  EDIT_SAVED_ARTWORK_NAVIGATION_STACK_STATE_KEY,
  useReloadedDevNavigationState,
} from "app/system/navigation/useReloadedDevNavigationState"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { useLocalizedUnit } from "app/utils/useLocalizedUnit"
import React, { useCallback, useEffect } from "react"
import { KeyboardAvoidingView } from "react-native"
import { QueryRenderer, RelayRefetchProp, createRefetchContainer, graphql } from "react-relay"
import { EditSavedSearchFormPlaceholder } from "./Components/EditSavedSearchAlertPlaceholder"
import { SavedSearchAlertQueryRenderer } from "./SavedSearchAlert"
import { SavedSearchStoreProvider, savedSearchModel } from "./SavedSearchStore"

interface EditSavedSearchAlertBaseProps {
  savedSearchAlertId: string
}

interface EditSavedSearchAlertProps {
  me: SavedSearchAlertQuery["response"]["me"]
  viewer: EditSavedSearchAlert_viewer$data
  artists: EditSavedSearchAlert_artists$data
  savedSearchAlertId: string
  relay: RelayRefetchProp
}

const Stack = createStackNavigator<EditSavedSearchAlertNavigationStack>()

export const EditSavedSearchAlert: React.FC<EditSavedSearchAlertProps> = (props) => {
  const theme = useNavigationTheme()
  const color = useColor()

  const { me, viewer, artists, savedSearchAlertId, relay } = props
  const { localizedUnit } = useLocalizedUnit()

  const { isReady, initialState, saveSession } = useReloadedDevNavigationState(
    EDIT_SAVED_ARTWORK_NAVIGATION_STACK_STATE_KEY
  )

  const { settings, ...attributes } = me?.alert ?? {}
  const isCustomAlertsNotificationsEnabled = viewer?.notificationPreferences?.some((preference) => {
    return (
      preference.channel === "email" &&
      preference.name === "custom_alerts" &&
      preference.status === "SUBSCRIBED"
    )
  })
  const userAllowsEmails = isCustomAlertsNotificationsEnabled ?? false

  const formattedArtists: SavedSearchEntityArtist[] = artists.map((artist) => ({
    id: artist.internalID,
    name: artist.name || "",
  }))
  const entity: SavedSearchEntity = {
    artists: formattedArtists,
    owner: {
      type: OwnerType.savedSearch,
      id: savedSearchAlertId,
      slug: "",
    },
  }

  const onComplete = () => {
    goBack({
      previousScreen: "EditSavedSearchAlert",
    })
  }

  const refetch = useCallback(
    (backProps?: GoBackProps) => {
      if (backProps?.previousScreen === "Unsubscribe") {
        relay.refetch({}, null, null)
      }
    },
    [relay]
  )

  useEffect(() => {
    navigationEvents.addListener("goBack", refetch)

    return () => {
      navigationEvents.removeListener("goBack", refetch)
    }
  }, [])

  if (!isReady) {
    return null
  }

  const params: EditSavedSearchAlertParams = {
    userAlertSettings: settings,
    savedSearchAlertId,
    userAllowsEmails,
    onComplete,
    onDeleteComplete: onComplete,
  }

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.SavedSearchEdit,
        context_screen_owner_id: savedSearchAlertId,
        context_screen_owner_type: OwnerType.savedSearch,
      }}
    >
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <SavedSearchStoreProvider
          runtimeModel={{
            ...savedSearchModel,
            currentAlertID: savedSearchAlertId,
            attributes: localizeHeightAndWidthAttributes({
              attributes: attributes as SearchCriteriaAttributes,
              // Sizes are always injected in inches
              from: "in",
              to: localizedUnit,
            }),
            entity,
            unit: localizedUnit,
          }}
        >
          <NavigationIndependentTree>
            <NavigationContainer
              initialState={initialState}
              onStateChange={(state) => {
                saveSession(state)
              }}
              theme={theme}
            >
              <Stack.Navigator
                // force it to not use react-native-screens, which is broken inside a react-native Modal for some reason
                detachInactiveScreens={false}
                screenOptions={{
                  ...TransitionPresets.SlideFromRightIOS,
                  headerShown: false,
                  cardStyle: { backgroundColor: color("background") },
                }}
              >
                <Stack.Screen
                  name="EditSavedSearchAlertContent"
                  component={EditSavedSearchAlertContent}
                  initialParams={params}
                />
                <Stack.Screen
                  name="AlertArtworks"
                  component={AlertArtworks}
                  initialParams={{ alertId: savedSearchAlertId }}
                />
                <Stack.Screen name="EmailPreferences" component={EmailPreferencesScreen} />
                <Stack.Screen
                  name="AlertPriceRange"
                  component={AlertPriceRangeScreenQueryRenderer}
                  options={{
                    // Avoid PanResponser conflicts between the slider and the slide back gesture
                    gestureEnabled: false,
                  }}
                />
                <Stack.Screen
                  name="SavedSearchFilterScreen"
                  component={SavedSearchFilterScreen}
                  options={{
                    gestureEnabled: false,
                  }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </NavigationIndependentTree>
        </SavedSearchStoreProvider>
      </KeyboardAvoidingView>
    </ProvideScreenTracking>
  )
}

export const EditSavedSearchAlertRefetchContainer = createRefetchContainer(
  EditSavedSearchAlert,
  {
    viewer: graphql`
      fragment EditSavedSearchAlert_viewer on Viewer {
        notificationPreferences {
          status
          name
          channel
        }
      }
    `,
    artists: graphql`
      fragment EditSavedSearchAlert_artists on Artist @relay(plural: true) {
        internalID
        name
      }
    `,
  },
  graphql`
    query EditSavedSearchAlertRefetchQuery {
      viewer {
        ...EditSavedSearchAlert_viewer
      }
    }
  `
)

export const EditSavedSearchAlertDetailsScreenQuery = graphql`
  query EditSavedSearchAlertQuery($artistIDs: [String]) {
    viewer {
      ...EditSavedSearchAlert_viewer
    }
    artists(ids: $artistIDs) {
      ...EditSavedSearchAlert_artists
    }
  }
`

export const EditSavedSearchAlertQueryRenderer: React.FC<EditSavedSearchAlertBaseProps> = (
  props
) => {
  const { savedSearchAlertId } = props

  return (
    <Screen>
      <SavedSearchAlertQueryRenderer
        savedSearchAlertId={savedSearchAlertId}
        render={renderWithPlaceholder({
          render: (relayProps: SavedSearchAlertQuery["response"]) => (
            <QueryRenderer<EditSavedSearchAlertQuery>
              environment={getRelayEnvironment()}
              query={EditSavedSearchAlertDetailsScreenQuery}
              variables={{ artistIDs: relayProps.me?.alert?.artistIDs as string[] }}
              render={renderWithPlaceholder({
                Container: EditSavedSearchAlertRefetchContainer,
                renderPlaceholder: () => <EditSavedSearchFormPlaceholder />,
                initialProps: { savedSearchAlertId, ...relayProps },
              })}
            />
          ),
          renderPlaceholder: () => <EditSavedSearchFormPlaceholder />,
        })}
      />
    </Screen>
  )
}
