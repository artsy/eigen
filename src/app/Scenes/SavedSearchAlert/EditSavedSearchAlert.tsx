import { OwnerType } from "@artsy/cohesion"
import { EditSavedSearchAlert_artist } from "__generated__/EditSavedSearchAlert_artist.graphql"
import { EditSavedSearchAlert_artworksConnection } from "__generated__/EditSavedSearchAlert_artworksConnection.graphql"
import { EditSavedSearchAlert_user } from "__generated__/EditSavedSearchAlert_user.graphql"
import { EditSavedSearchAlertQuery } from "__generated__/EditSavedSearchAlertQuery.graphql"
import { SavedSearchAlertQueryResponse } from "__generated__/SavedSearchAlertQuery.graphql"
import { emitSavedSearchRefetchEvent } from "app/Components/Artist/ArtistArtworks/SavedSearchButton"
import { ArtsyKeyboardAvoidingView } from "app/Components/ArtsyKeyboardAvoidingView"
import { Aggregations } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { goBack, GoBackProps, navigationEvents } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import React, { useCallback, useEffect } from "react"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { EditSavedSearchFormPlaceholder } from "./Components/EditSavedSearchAlertPlaceholder"
import { SavedSearchAlertQueryRenderer } from "./SavedSearchAlert"
import { SavedSearchAlertForm } from "./SavedSearchAlertForm"
import { SavedSearchStoreProvider } from "./SavedSearchStore"

interface EditSavedSearchAlertBaseProps {
  savedSearchAlertId: string
}

interface EditSavedSearchAlertProps {
  me: SavedSearchAlertQueryResponse["me"]
  user: EditSavedSearchAlert_user
  artist: EditSavedSearchAlert_artist
  savedSearchAlertId: string
  artworksConnection: EditSavedSearchAlert_artworksConnection
  relay: RelayRefetchProp
}

export const EditSavedSearchAlert: React.FC<EditSavedSearchAlertProps> = (props) => {
  const { me, user, artist, artworksConnection, savedSearchAlertId, relay } = props
  const aggregations = (artworksConnection.aggregations ?? []) as Aggregations
  const { userAlertSettings, internalID, ...attributes } = me?.savedSearch ?? {}

  const onComplete = () => {
    goBack({
      previousScreen: "EditSavedSearchAlert",
    })
    emitSavedSearchRefetchEvent()
  }

  const refetch = useCallback(
    (backProps?: GoBackProps) => {
      if (backProps?.previousScreen === "Unsubscribe") {
        relay.refetch({}, null, null, { force: true })
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

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.SavedSearchEdit,
        context_screen_owner_id: savedSearchAlertId,
        context_screen_owner_type: OwnerType.savedSearch,
      }}
    >
      <ArtsyKeyboardAvoidingView>
        <PageWithSimpleHeader title="Edit your Alert">
          <SavedSearchStoreProvider initialData={{ attributes, aggregations }}>
            <SavedSearchAlertForm
              initialValues={{
                name: userAlertSettings?.name ?? "",
                email: userAlertSettings?.email ?? false,
                push: userAlertSettings?.push ?? false,
              }}
              artistId={artist.internalID}
              artistName={artist.name!}
              savedSearchAlertId={savedSearchAlertId}
              userAllowsEmails={user?.emailFrequency !== "none"}
              onComplete={onComplete}
              onDeleteComplete={onComplete}
            />
          </SavedSearchStoreProvider>
        </PageWithSimpleHeader>
      </ArtsyKeyboardAvoidingView>
    </ProvideScreenTracking>
  )
}

export const EditSavedSearchAlertRefetchContainer = createRefetchContainer(
  EditSavedSearchAlert,
  {
    user: graphql`
      fragment EditSavedSearchAlert_user on Me {
        emailFrequency
      }
    `,
    artist: graphql`
      fragment EditSavedSearchAlert_artist on Artist {
        internalID
        name
      }
    `,
    artworksConnection: graphql`
      fragment EditSavedSearchAlert_artworksConnection on FilterArtworksConnection {
        aggregations {
          slice
          counts {
            count
            name
            value
          }
        }
      }
    `,
  },
  graphql`
    query EditSavedSearchAlertRefetchQuery {
      user: me {
        ...EditSavedSearchAlert_user
      }
    }
  `
)

export const EditSavedSearchAlertQueryRenderer: React.FC<EditSavedSearchAlertBaseProps> = (
  props
) => {
  const { savedSearchAlertId } = props

  return (
    <SavedSearchAlertQueryRenderer
      savedSearchAlertId={savedSearchAlertId}
      render={renderWithPlaceholder({
        render: (relayProps: SavedSearchAlertQueryResponse) => (
          <QueryRenderer<EditSavedSearchAlertQuery>
            environment={defaultEnvironment}
            query={graphql`
              query EditSavedSearchAlertQuery($artistID: String!) {
                user: me {
                  ...EditSavedSearchAlert_user
                }
                artist(id: $artistID) {
                  ...EditSavedSearchAlert_artist
                }
                artworksConnection(
                  first: 0
                  artistID: $artistID
                  aggregations: [ARTIST, LOCATION_CITY, MATERIALS_TERMS, MEDIUM, PARTNER, COLOR]
                ) {
                  ...EditSavedSearchAlert_artworksConnection
                }
              }
            `}
            variables={{ artistID: relayProps.me?.savedSearch?.artistIDs?.[0]! }}
            render={renderWithPlaceholder({
              Container: EditSavedSearchAlertRefetchContainer,
              renderPlaceholder: () => <EditSavedSearchFormPlaceholder />,
              initialProps: { savedSearchAlertId, ...relayProps },
            })}
            cacheConfig={{ force: true }}
          />
        ),
        renderPlaceholder: () => <EditSavedSearchFormPlaceholder />,
      })}
    />
  )
}
