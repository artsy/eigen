import { Box, Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
import { RouteProp, useRoute } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import {
  ConfirmationScreenArtworkMatchesQuery,
  FilterArtworksInput,
} from "__generated__/ConfirmationScreenArtworkMatchesQuery.graphql"
import { ConfirmationScreenCriteriaQuery } from "__generated__/ConfirmationScreenCriteriaQuery.graphql"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import GenericGrid, { GenericGridPlaceholder } from "app/Components/ArtworkGrids/GenericGrid"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Pill } from "app/Components/Pill"
import { CreateSavedSearchAlertNavigationStack } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/hooks/useScreenDimensions"
import { PlaceholderBox } from "app/utils/placeholders"
import React, { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

type Props = StackScreenProps<CreateSavedSearchAlertNavigationStack, "ConfirmationScreen">

export const ConfirmationScreen: React.FC<Props> = (props) => {
  const { navigation } = props
  const route = useRoute<RouteProp<CreateSavedSearchAlertNavigationStack, "ConfirmationScreen">>()
  const { searchCriteriaID, alertAttributes } = route.params
  const handleLeftButtonPress = () => {
    navigation.pop()
  }

  return (
    <Box flex={1}>
      <FancyModalHeader hideBottomDivider useXButton onLeftButtonPress={handleLeftButtonPress} />
      <Box px={2}>
        <Text variant="lg">Your alert has been saved</Text>
        <Spacer y={1} />
        <Text variant="sm" color="black60">
          We’ll let you know when matching works are added to Artsy.
        </Text>
        <Spacer y={2} />
        <CriteriaAndMatches searchCriteriaID={searchCriteriaID} alertAttributes={alertAttributes} />
      </Box>
    </Box>
  )
}

const CriteriaAndMatches: React.FC<{
  searchCriteriaID: string
  alertAttributes: SearchCriteriaAttributes
}> = ({ searchCriteriaID, alertAttributes }) => {
  return (
    <Suspense fallback={<CriteriaPlaceholder />}>
      <Criteria searchCriteriaID={searchCriteriaID} alertAttributes={alertAttributes} />
    </Suspense>
  )
}

const CriteriaPlaceholder: React.FC = () => {
  return (
    <Flex flexDirection="row" flexWrap="wrap">
      <PlaceholderBox width={120} height={30} />
      <Spacer x={1} />
      <PlaceholderBox width={70} height={30} />
      <Spacer x={1} />
      <PlaceholderBox width={70} height={30} />
    </Flex>
  )
}

const criteriaQuery = graphql`
  query ConfirmationScreenCriteriaQuery($searchCriteriaID: ID!) {
    me {
      savedSearch(id: $searchCriteriaID) {
        labels {
          displayValue
          field
          value
        }
      }
    }
  }
`

const Criteria: React.FC<{
  searchCriteriaID: string
  alertAttributes: SearchCriteriaAttributes
}> = ({ searchCriteriaID, alertAttributes }) => {
  const data = useLazyLoadQuery<ConfirmationScreenCriteriaQuery>(criteriaQuery, {
    searchCriteriaID,
  })

  const labels = data?.me?.savedSearch?.labels ?? []

  return (
    <>
      <Flex flexDirection="row" flexWrap="wrap">
        <Join separator={<Spacer x={1} />}>
          {labels.map((label) => {
            return (
              <Pill key={label.field} block>
                {label.displayValue}
              </Pill>
            )
          })}
        </Join>
      </Flex>
      <Spacer y={2} />
      <Matches alertAttributes={alertAttributes} />
    </>
  )
}

const Matches: React.FC<{ alertAttributes: SearchCriteriaAttributes }> = ({ alertAttributes }) => {
  const screen = useScreenDimensions()

  return (
    <Suspense fallback={<GenericGridPlaceholder width={screen.width - 40} />}>
      <ArtworkMatches alertAttributes={alertAttributes} />
    </Suspense>
  )
}

const artworkMatchesQuery = graphql`
  query ConfirmationScreenArtworkMatchesQuery($input: FilterArtworksInput) {
    artworksConnection(first: 20, input: $input) {
      counts {
        total
      }
      edges {
        node {
          ...GenericGrid_artworks
        }
      }
    }
  }
`

const ArtworkMatches: React.FC<{ alertAttributes: SearchCriteriaAttributes }> = (props) => {
  const { alertAttributes } = props
  console.log("WHOA", { alertAttributes })
  const data = useLazyLoadQuery<ConfirmationScreenArtworkMatchesQuery>(artworkMatchesQuery, {
    input: alertAttributes as FilterArtworksInput,
  })

  const artworks = extractNodes(data.artworksConnection)
  const total = data?.artworksConnection?.counts?.total

  return (
    <Box borderTopWidth={1} borderTopColor="black30" pt={1}>
      <Text variant="sm" color="black60">
        You might like these {total} works currently on Artsy that match your criteria
      </Text>
      <Spacer y={2} />
      <GenericGrid artworks={artworks} />
    </Box>
  )
}
