import { Box, Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
import { RouteProp, useRoute } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import { ConfirmationScreenMatchingArtworksQuery } from "__generated__/ConfirmationScreenMatchingArtworksQuery.graphql"
import { ConfirmationScreenQuery } from "__generated__/ConfirmationScreenQuery.graphql"
import GenericGrid, { GenericGridPlaceholder } from "app/Components/ArtworkGrids/GenericGrid"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Pill } from "app/Components/Pill"
import { CreateSavedSearchAlertNavigationStack } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/hooks/useScreenDimensions"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { QueryRenderer, graphql } from "react-relay"
type Props = StackScreenProps<CreateSavedSearchAlertNavigationStack, "ConfirmationScreen">

export const ConfirmationScreen: React.FC<Props> = (props) => {
  const { navigation } = props
  const route = useRoute<RouteProp<CreateSavedSearchAlertNavigationStack, "ConfirmationScreen">>()
  const { searchCriteriaID } = route.params
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
        <SavedSearchQR searchCriteriaID={searchCriteriaID} />
      </Box>
    </Box>
  )
}

const SavedSearchQR: React.FC<{ searchCriteriaID: string }> = ({ searchCriteriaID }) => {
  return (
    <QueryRenderer<ConfirmationScreenQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query ConfirmationScreenQuery($searchCriteriaID: ID!) {
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
      `}
      variables={{ searchCriteriaID }}
      render={renderWithLoadProgress<ConfirmationScreenQuery["response"]>((props) => {
        if (!props?.me?.savedSearch?.labels) return null

        const { labels } = props.me.savedSearch

        return (
          <>
            <Flex flexDirection="row" flexWrap="wrap">
              <Join separator={<Spacer x={1} />}>
                {labels.map((label, index) => {
                  return (
                    <Pill key={`filter-label-${index}`} block>
                      {label.displayValue}
                    </Pill>
                  )
                })}
              </Join>
            </Flex>
            <Spacer y={2} />
            <MatchingArtworksQR />
          </>
        )
      })}
    />
  )
}

const MatchingArtworksQR = () => {
  const screen = useScreenDimensions()
  return (
    <QueryRenderer<ConfirmationScreenMatchingArtworksQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query ConfirmationScreenMatchingArtworksQuery {
          # TODO: actual filter input props to be parsed from labels' fields & values
          artworksConnection(first: 20) {
            edges {
              node {
                ...GenericGrid_artworks
              }
            }
          }
        }
      `}
      variables={{}}
      render={renderWithLoadProgress<ConfirmationScreenMatchingArtworksQuery["response"]>(
        (props) => {
          const artworks = extractNodes(props.artworksConnection)
          if (artworks.length === 0) {
            return <GenericGridPlaceholder width={screen.width - 40} />
          } else {
            return (
              <Box borderTopWidth={1} borderTopColor="black30" pt={1}>
                <Text variant="sm" color="black60">
                  {/* TODO: actual artworks count */}
                  You might like these 000 works currently on Artsy that match your criteria
                </Text>
                <Spacer y={2} />
                <GenericGrid artworks={artworks} />
              </Box>
            )
          }
        }
      )}
    />
  )
}
