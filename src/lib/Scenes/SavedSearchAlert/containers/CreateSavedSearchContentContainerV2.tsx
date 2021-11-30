import { StackNavigationProp } from "@react-navigation/stack"
import { captureMessage } from "@sentry/react-native"
import { CreateSavedSearchContentContainerV2_me } from "__generated__/CreateSavedSearchContentContainerV2_me.graphql"
import { CreateSavedSearchContentContainerV2Query } from "__generated__/CreateSavedSearchContentContainerV2Query.graphql"
import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import {
  getAllowedFiltersForSavedSearchInput,
  getSearchCriteriaFromFilters,
} from "lib/Components/ArtworkFilter/SavedSearch/searchCriteriaHelpers"
import { SearchCriteriaAttributes } from "lib/Components/ArtworkFilter/SavedSearch/types"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import React, { useMemo } from "react"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { CreateSavedSearchContent } from "../Components/CreateSavedSearchContent"
import { CreateSavedSearchAlertNavigationStack, CreateSavedSearchAlertParams } from "../SavedSearchAlertModel"

interface CreateSavedSearchAlertContentQueryRendererProps
  extends Omit<CreateSavedSearchAlertParams, "me" | "onClosePress"> {
  navigation: StackNavigationProp<CreateSavedSearchAlertNavigationStack, "CreateSavedSearchAlert">
  artistId: string
  artistName: string
}

interface CreateSavedSearchAlertContentProps extends CreateSavedSearchAlertContentQueryRendererProps {
  relay: RelayRefetchProp
  me?: CreateSavedSearchContentContainerV2_me | null
  loading: boolean
  criteria: SearchCriteriaAttributes
}

const Container: React.FC<CreateSavedSearchAlertContentProps> = (props) => {
  const { me, loading, ...other } = props

  return <CreateSavedSearchContent userAllowsEmails={me?.emailFrequency !== "none"} isLoading={loading} {...other} />
}

const CreateSavedSearchContentContainerV2 = createRefetchContainer(
  Container,
  {
    me: graphql`
      fragment CreateSavedSearchContentContainerV2_me on Me
      @argumentDefinitions(criteria: { type: "SearchCriteriaAttributes" }) {
        emailFrequency
        savedSearch(criteria: $criteria) {
          internalID
        }
      }
    `,
  },
  graphql`
    query CreateSavedSearchContentContainerV2RefetchQuery($criteria: SearchCriteriaAttributes) {
      me {
        ...CreateSavedSearchContentContainerV2_me @arguments(criteria: $criteria)
      }
    }
  `
)

export const CreateSavedSearchAlertContentQueryRenderer: React.FC<CreateSavedSearchAlertContentQueryRendererProps> = (
  props
) => {
  const { artistId } = props
  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const aggregations = ArtworksFiltersStore.useStoreState((state) => state.aggregations)
  const filters = useMemo(() => getAllowedFiltersForSavedSearchInput(appliedFilters), [appliedFilters])
  const criteria = useMemo(() => getSearchCriteriaFromFilters(artistId, filters), [artistId, filters])

  return (
    <QueryRenderer<CreateSavedSearchContentContainerV2Query>
      environment={defaultEnvironment}
      query={graphql`
        query CreateSavedSearchContentContainerV2Query($criteria: SearchCriteriaAttributes!) {
          me {
            ...CreateSavedSearchContentContainerV2_me @arguments(criteria: $criteria)
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
          <CreateSavedSearchContentContainerV2
            {...props}
            me={relayProps?.me ?? null}
            loading={relayProps === null && error === null}
            criteria={criteria}
            filters={filters}
            aggregations={aggregations}
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
