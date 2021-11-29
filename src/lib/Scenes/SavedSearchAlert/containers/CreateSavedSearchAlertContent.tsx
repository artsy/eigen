import { StackNavigationProp } from "@react-navigation/stack"
import { captureMessage } from "@sentry/react-native"
import { CreateSavedSearchAlertContent_me } from "__generated__/CreateSavedSearchAlertContent_me.graphql"
import { CreateSavedSearchAlertContentQuery } from "__generated__/CreateSavedSearchAlertContentQuery.graphql"
import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import {
  getAllowedFiltersForSavedSearchInput,
  getSearchCriteriaFromFilters,
} from "lib/Components/ArtworkFilter/SavedSearch/searchCriteriaHelpers"
import { SearchCriteriaAttributes } from "lib/Components/ArtworkFilter/SavedSearch/types"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import React, { useMemo } from "react"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { Content } from "../Components/Content"
import { CreateSavedSearchAlertNavigationStack, CreateSavedSearchAlertParams } from "../SavedSearchAlertModel"

interface CreateSavedSearchAlertContentQueryRendererProps
  extends Omit<CreateSavedSearchAlertParams, "me" | "onClosePress"> {
  navigation: StackNavigationProp<CreateSavedSearchAlertNavigationStack, "CreateSavedSearchAlert">
  artistId: string
  artistName: string
}

interface CreateSavedSearchAlertContentProps extends CreateSavedSearchAlertContentQueryRendererProps {
  relay: RelayRefetchProp
  me?: CreateSavedSearchAlertContent_me | null
  loading: boolean
  criteria: SearchCriteriaAttributes
}

const Container: React.FC<CreateSavedSearchAlertContentProps> = (props) => {
  const { me, loading, ...other } = props

  return <Content userAllowsEmails={me?.emailFrequency !== "none"} isLoading={loading} {...other} />
}

const CreateSavedSearchAlertContentRefetchContainer = createRefetchContainer(
  Container,
  {
    me: graphql`
      fragment CreateSavedSearchAlertContent_me on Me
      @argumentDefinitions(criteria: { type: "SearchCriteriaAttributes" }) {
        emailFrequency
        savedSearch(criteria: $criteria) {
          internalID
        }
      }
    `,
  },
  graphql`
    query CreateSavedSearchAlertContentRefetchQuery($criteria: SearchCriteriaAttributes) {
      me {
        ...CreateSavedSearchAlertContent_me @arguments(criteria: $criteria)
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
    <QueryRenderer<CreateSavedSearchAlertContentQuery>
      environment={defaultEnvironment}
      query={graphql`
        query CreateSavedSearchAlertContentQuery($criteria: SearchCriteriaAttributes!) {
          me {
            ...CreateSavedSearchAlertContent_me @arguments(criteria: $criteria)
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
          <CreateSavedSearchAlertContentRefetchContainer
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
