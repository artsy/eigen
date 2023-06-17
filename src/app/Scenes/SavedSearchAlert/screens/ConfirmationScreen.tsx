import { Box, Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
import { RouteProp, useRoute } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import { ConfirmationScreenQuery } from "__generated__/ConfirmationScreenQuery.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Pill } from "app/Components/Pill"
import { MatchingArtworks } from "app/Scenes/SavedSearchAlert/Components/ConfirmationScreenArtworks"
import { CreateSavedSearchAlertNavigationStack } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
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
            <MatchingArtworks />
          </>
        )
      })}
    />
  )
}
