import { OwnerType } from "@artsy/cohesion"
import { EditSavedSearchAlert_artist } from "__generated__/EditSavedSearchAlert_artist.graphql"
import { EditSavedSearchAlert_artworksConnection } from "__generated__/EditSavedSearchAlert_artworksConnection.graphql"
import { EditSavedSearchAlertQuery } from "__generated__/EditSavedSearchAlertQuery.graphql"
import { SavedSearchAlertQueryResponse } from "__generated__/SavedSearchAlertQuery.graphql"
import { emitSavedSearchRefetchEvent } from "lib/Components/Artist/ArtistArtworks/SavedSearchButton"
import { ArtsyKeyboardAvoidingView } from "lib/Components/ArtsyKeyboardAvoidingView"
import { Aggregations } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { goBack } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import React from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { EditSavedSearchFormPlaceholder } from "./Components/EditSavedSearchAlertPlaceholder"
import { SavedSearchAlertQueryRenderer } from "./SavedSearchAlert"
import { SavedSearchAlertForm } from "./SavedSearchAlertForm"
import { SavedSearchStoreProvider } from "./SavedSearchStore"

interface EditSavedSearchAlertBaseProps {
  savedSearchAlertId: string
}

interface EditSavedSearchAlertProps {
  me: SavedSearchAlertQueryResponse["me"]
  artist: EditSavedSearchAlert_artist
  savedSearchAlertId: string
  artworksConnection: EditSavedSearchAlert_artworksConnection
}

export const EditSavedSearchAlert: React.FC<EditSavedSearchAlertProps> = (props) => {
  const { me, artist, artworksConnection, savedSearchAlertId } = props
  const aggregations = (artworksConnection.aggregations ?? []) as Aggregations
  const { userAlertSettings } = me?.savedSearch ?? {}

  const onComplete = () => {
    goBack()
    emitSavedSearchRefetchEvent()
  }

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
          <SavedSearchStoreProvider initialData={{ attributes: me?.savedSearch ?? {}, aggregations }}>
            <SavedSearchAlertForm
              initialValues={{
                name: userAlertSettings?.name ?? "",
                email: userAlertSettings?.email ?? false,
                push: userAlertSettings?.push ?? false,
              }}
              artistId={artist.internalID}
              artistName={artist.name!}
              savedSearchAlertId={savedSearchAlertId}
              userAllowsEmails={me?.emailFrequency !== "none"}
              onComplete={onComplete}
              onDeleteComplete={onComplete}
            />
          </SavedSearchStoreProvider>
        </PageWithSimpleHeader>
      </ArtsyKeyboardAvoidingView>
    </ProvideScreenTracking>
  )
}

export const EditSavedSearchAlertFragmentContainer = createFragmentContainer(EditSavedSearchAlert, {
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
})

export const EditSavedSearchAlertQueryRenderer: React.FC<EditSavedSearchAlertBaseProps> = (props) => {
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
            variables={{ artistID: relayProps.me?.savedSearch?.artistID! }}
            render={renderWithPlaceholder({
              Container: EditSavedSearchAlertFragmentContainer,
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
