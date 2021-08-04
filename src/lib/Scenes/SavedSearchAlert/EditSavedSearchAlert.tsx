import { EditSavedSearchAlert_artist } from "__generated__/EditSavedSearchAlert_artist.graphql"
import { EditSavedSearchAlert_me } from "__generated__/EditSavedSearchAlert_me.graphql"
import { EditSavedSearchAlertQuery } from "__generated__/EditSavedSearchAlertQuery.graphql"
import { SearchCriteriaAttributes } from "__generated__/SavedSearchBannerCreateSavedSearchMutation.graphql"
import { Aggregations } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { convertSavedSearchCriteriaToFilterParams } from "lib/Components/ArtworkFilter/SavedSearch/convertersToFilterParams"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { useTheme } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { SavedSearchAlertForm } from "./SavedSearchAlertForm"

interface EditSavedSearchAlertBaseProps {
  artistID: string
  savedSearchAlertId: string
}

interface EditSavedSearchAlertProps {
  me: EditSavedSearchAlert_me
  artist: EditSavedSearchAlert_artist
}

export const EditSavedSearchAlert: React.FC<EditSavedSearchAlertProps> = (props) => {
  const { me, artist } = props
  const { space } = useTheme()
  const aggregations = artist.filterArtworksConnection?.aggregations ?? []
  const { userAlertSettings, ...savedSearchCriteria } = me.savedSearch ?? {}
  const filters = convertSavedSearchCriteriaToFilterParams(
    savedSearchCriteria as SearchCriteriaAttributes,
    aggregations as Aggregations
  )

  console.log("[debug] filters", filters)

  return (
    <PageWithSimpleHeader title="Edit your Alert">
      <ScrollView contentContainerStyle={{ padding: space(2) }}>
        <SavedSearchAlertForm />
      </ScrollView>
    </PageWithSimpleHeader>
  )
}

const EditSavedSearchAlertFragmentContainer = createFragmentContainer(EditSavedSearchAlert, {
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
        renderPlaceholder: () => <></>,
      })}
    />
  )
}
