import { EditSavedSearchAlert_artist } from "__generated__/EditSavedSearchAlert_artist.graphql"
import { EditSavedSearchAlert_me } from "__generated__/EditSavedSearchAlert_me.graphql"
import { EditSavedSearchAlertQuery } from "__generated__/EditSavedSearchAlertQuery.graphql"
import { EditSavedSearchAlertUpdateSavedSearchMutation } from "__generated__/EditSavedSearchAlertUpdateSavedSearchMutation.graphql"
import { SearchCriteriaAttributes } from "__generated__/SavedSearchBannerCreateSavedSearchMutation.graphql"
import { Aggregations } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { convertSavedSearchCriteriaToFilterParams } from "lib/Components/ArtworkFilter/SavedSearch/convertersToFilterParams"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { goBack } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { useTheme } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { commitMutation, createFragmentContainer, Environment, graphql, QueryRenderer } from "react-relay"
import { EditSavedSearchFormPlaceholder } from "./Components/EditSavedSearchAlertPlaceholder"
import { SavedSearchAlertForm } from "./SavedSearchAlertForm"
import { SavedSearchAlertFormValues } from "./SavedSearchAlertModel"

interface EditSavedSearchAlertBaseProps {
  artistID: string
  savedSearchAlertId: string
}

interface EditSavedSearchAlertProps {
  me: EditSavedSearchAlert_me
  artist: EditSavedSearchAlert_artist
  savedSearchAlertId: string
  enviroment: Environment
}

export const EditSavedSearchAlert: React.FC<EditSavedSearchAlertProps> = (props) => {
  const { me, artist, savedSearchAlertId, enviroment = defaultEnvironment } = props
  const { space } = useTheme()
  const aggregations = (artist.filterArtworksConnection?.aggregations ?? []) as Aggregations
  const { userAlertSettings, ...savedSearchCriteria } = me.savedSearch ?? {}
  const filters = convertSavedSearchCriteriaToFilterParams(
    savedSearchCriteria as SearchCriteriaAttributes,
    aggregations
  )

  const handleDeletePress = () => {
    goBack()
  }

  const updateMutation = async (values: SavedSearchAlertFormValues) => {
    return new Promise((resolve, reject) => {
      commitMutation<EditSavedSearchAlertUpdateSavedSearchMutation>(enviroment, {
        mutation: graphql`
          mutation EditSavedSearchAlertUpdateSavedSearchMutation($input: UpdateSavedSearchInput!) {
            updateSavedSearch(input: $input) {
              savedSearchOrErrors {
                ... on SearchCriteria {
                  internalID
                  userAlertSettings {
                    name
                  }
                }
              }
            }
          }
        `,
        variables: {
          input: {
            searchCriteriaID: savedSearchAlertId,
            userAlertSettings: {
              name: values.name,
            },
          },
        },
        onCompleted: (response) => {
          resolve(response)
          goBack()
        },
        onError: (error) => {
          reject(error)
        },
      })
    })
  }

  return (
    <PageWithSimpleHeader title="Edit your Alert">
      <ScrollView contentContainerStyle={{ padding: space(2) }}>
        <SavedSearchAlertForm
          initialValues={{ name: userAlertSettings?.name ?? "" }}
          mode="update"
          artist={{ name: artist.name!, id: artist.internalID }}
          filters={filters}
          aggregations={aggregations}
          mutation={updateMutation}
          onDeletePress={handleDeletePress}
        />
      </ScrollView>
    </PageWithSimpleHeader>
  )
}

export const EditSavedSearchAlertFragmentContainer = createFragmentContainer(EditSavedSearchAlert, {
  me: graphql`
    fragment EditSavedSearchAlert_me on Me @argumentDefinitions(savedSearchAlertId: { type: "ID" }) {
      savedSearch(id: $savedSearchAlertId) {
        internalID
        acquireable
        additionalGeneIDs
        artistID
        atAuction
        attributionClass
        colors
        dimensionRange
        height
        inquireableOnly
        internalID
        locationCities
        majorPeriods
        materialsTerms
        offerable
        partnerIDs
        priceRange
        userAlertSettings {
          name
        }
        width
      }
    }
  `,
  artist: graphql`
    fragment EditSavedSearchAlert_artist on Artist {
      internalID
      name
      filterArtworksConnection(first: 1, aggregations: [LOCATION_CITY, MATERIALS_TERMS, MEDIUM, PARTNER]) {
        aggregations {
          slice
          counts {
            count
            name
            value
          }
        }
      }
    }
  `,
})

export const EditSavedSearchAlertQueryRenderer: React.FC<EditSavedSearchAlertBaseProps> = (props) => {
  const { savedSearchAlertId, artistID } = props

  return (
    <QueryRenderer<EditSavedSearchAlertQuery>
      environment={defaultEnvironment}
      query={graphql`
        query EditSavedSearchAlertQuery($savedSearchAlertId: ID!, $artistID: String!) {
          me {
            ...EditSavedSearchAlert_me @arguments(savedSearchAlertId: $savedSearchAlertId)
          }
          artist(id: $artistID) {
            ...EditSavedSearchAlert_artist
          }
        }
      `}
      variables={{ savedSearchAlertId, artistID }}
      render={renderWithPlaceholder({
        Container: EditSavedSearchAlertFragmentContainer,
        renderPlaceholder: () => <EditSavedSearchFormPlaceholder />,
        initialProps: { savedSearchAlertId },
      })}
    />
  )
}
