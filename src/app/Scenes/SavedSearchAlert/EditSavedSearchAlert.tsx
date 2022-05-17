import { OwnerType } from "@artsy/cohesion"
import { EditSavedSearchAlert_artists } from "__generated__/EditSavedSearchAlert_artists.graphql"
import { EditSavedSearchAlert_artworksConnection } from "__generated__/EditSavedSearchAlert_artworksConnection.graphql"
import { EditSavedSearchAlert_user } from "__generated__/EditSavedSearchAlert_user.graphql"
import { EditSavedSearchAlertQuery } from "__generated__/EditSavedSearchAlertQuery.graphql"
import { SavedSearchAlertQueryResponse } from "__generated__/SavedSearchAlertQuery.graphql"
import { Aggregations } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  SavedSearchEntity,
  SavedSearchEntityArtist,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { goBack, GoBackProps, navigationEvents } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import React, { useCallback, useEffect } from "react"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { ArtsyKeyboardAvoidingView } from "shared/utils"
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
  artists: EditSavedSearchAlert_artists
  savedSearchAlertId: string
  artworksConnection: EditSavedSearchAlert_artworksConnection
  relay: RelayRefetchProp
}

export const EditSavedSearchAlert: React.FC<EditSavedSearchAlertProps> = (props) => {
  const { me, user, artists, artworksConnection, savedSearchAlertId, relay } = props
  const aggregations = (artworksConnection.aggregations ?? []) as Aggregations
  const { userAlertSettings, internalID, ...attributes } = me?.savedSearch ?? {}

  const formattedArtists: SavedSearchEntityArtist[] = artists.map((artist) => ({
    id: artist.internalID,
    name: artist.name!,
    slug: artist.slug!,
  }))
  const entity: SavedSearchEntity = {
    placeholder: formattedArtists[0].name ?? "",
    artists: formattedArtists,
    owner: {
      type: OwnerType.savedSearch,
      id: savedSearchAlertId,
      name: "",
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
          <SavedSearchStoreProvider initialData={{ attributes, aggregations, entity }}>
            <SavedSearchAlertForm
              initialValues={{
                name: userAlertSettings?.name ?? "",
                email: userAlertSettings?.email ?? false,
                push: userAlertSettings?.push ?? false,
              }}
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
    artists: graphql`
      fragment EditSavedSearchAlert_artists on Artist @relay(plural: true) {
        internalID
        name
        slug
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
              query EditSavedSearchAlertQuery($artistIDs: [String]) {
                user: me {
                  ...EditSavedSearchAlert_user
                }
                artists(ids: $artistIDs) {
                  ...EditSavedSearchAlert_artists
                }
                artworksConnection(
                  first: 0
                  artistIDs: $artistIDs
                  aggregations: [ARTIST, LOCATION_CITY, MATERIALS_TERMS, MEDIUM, PARTNER, COLOR]
                ) {
                  ...EditSavedSearchAlert_artworksConnection
                }
              }
            `}
            variables={{ artistIDs: relayProps.me?.savedSearch?.artistIDs as string[] }}
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
