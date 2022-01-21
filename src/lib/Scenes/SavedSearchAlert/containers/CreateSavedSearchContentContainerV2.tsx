import { useFocusEffect } from "@react-navigation/core"
import { StackNavigationProp } from "@react-navigation/stack"
import { captureMessage } from "@sentry/react-native"
import { CreateSavedSearchContentContainerV2_me } from "__generated__/CreateSavedSearchContentContainerV2_me.graphql"
import { CreateSavedSearchContentContainerV2Query } from "__generated__/CreateSavedSearchContentContainerV2Query.graphql"
import { getUnitedSelectedAndAppliedFilters } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import {
  getAllowedFiltersForSavedSearchInput,
  getSearchCriteriaFromFilters,
} from "lib/Components/ArtworkFilter/SavedSearch/searchCriteriaHelpers"
import { SearchCriteriaAttributes } from "lib/Components/ArtworkFilter/SavedSearch/types"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import React, { useCallback, useRef, useState } from "react"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { CreateSavedSearchContent } from "../Components/CreateSavedSearchContent"
import {
  CreateSavedSearchAlertNavigationStack,
  SavedSearchAlertFormPropsBase,
  SavedSearchAlertMutationResult,
} from "../SavedSearchAlertModel"

interface CreateSavedSearchAlertContentQueryRendererProps {
  navigation: StackNavigationProp<CreateSavedSearchAlertNavigationStack, "CreateSavedSearchAlert">
  artistId: string
  artistName: string
  onClosePress: () => void
  onComplete: (response: SavedSearchAlertMutationResult) => void
}

interface CreateSavedSearchAlertContentProps
  extends CreateSavedSearchAlertContentQueryRendererProps,
    SavedSearchAlertFormPropsBase {
  relay: RelayRefetchProp
  me?: CreateSavedSearchContentContainerV2_me | null
  loading: boolean
  criteria: SearchCriteriaAttributes
}

const Container: React.FC<CreateSavedSearchAlertContentProps> = (props) => {
  const { me, loading, relay, criteria, navigation, ...other } = props
  const isPreviouslyFocused = useRef(false)
  const [refetching, setRefetching] = useState(false)
  const isPreviouslySaved = !!me?.savedSearch?.internalID

  const handleUpdateEmailPreferencesPress = () => {
    navigation.navigate("EmailPreferences")
  }

  const refetch = () => {
    setRefetching(true)
    relay.refetch(
      criteria,
      null,
      () => {
        setRefetching(false)
      },
      { force: true }
    )
  }

  // make refetch only when toggles are displayed
  useFocusEffect(
    useCallback(() => {
      if (isPreviouslyFocused.current) {
        refetch()
      }

      isPreviouslyFocused.current = true
    }, [])
  )

  return (
    <CreateSavedSearchContent
      userAllowsEmails={me?.emailFrequency !== "none"}
      isLoading={loading || refetching}
      isPreviouslySaved={isPreviouslySaved}
      onUpdateEmailPreferencesPress={handleUpdateEmailPreferencesPress}
      {...other}
    />
  )
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

export const CreateSavedSearchAlertContentQueryRenderer: React.FC<
  CreateSavedSearchAlertContentQueryRendererProps
> = (props) => {
  const { artistId } = props
  const filterState = ArtworksFiltersStore.useStoreState((state) => state)
  const unitedFilters = getUnitedSelectedAndAppliedFilters(filterState)
  const filters = getAllowedFiltersForSavedSearchInput(unitedFilters)
  const criteria = getSearchCriteriaFromFilters(artistId, filters)

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
