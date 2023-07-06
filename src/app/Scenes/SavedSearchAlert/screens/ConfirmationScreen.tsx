import { Box, Button, Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
import { RouteProp, useRoute } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import {
  ConfirmationScreenMatchingArtworksQuery,
  FilterArtworksInput,
} from "__generated__/ConfirmationScreenMatchingArtworksQuery.graphql"
import GenericGrid, { GenericGridPlaceholder } from "app/Components/ArtworkGrids/GenericGrid"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Pill } from "app/Components/Pill"
import { CreateSavedSearchAlertNavigationStack } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { useSavedSearchPills } from "app/Scenes/SavedSearchAlert/useSavedSearchPills"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/hooks/useScreenDimensions"
import { PlaceholderRaggedText } from "app/utils/placeholders"
import { Suspense } from "react"
import { ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, useLazyLoadQuery } from "react-relay"

const NUMBER_OF_ARTWORKS_TO_SHOW = 10

type Props = StackScreenProps<CreateSavedSearchAlertNavigationStack, "ConfirmationScreen">

export const ConfirmationScreen: React.FC<Props> = (props) => {
  const { route } = props
  const { closeModal } = route.params
  const { bottom: bottomInset } = useSafeAreaInsets()
  const pills = useSavedSearchPills()

  const handleLeftButtonPress = () => {
    closeModal?.()
  }

  const handleManageAlerts = () => {
    closeModal?.()
    navigate("/my-profile/saved-search-alerts")
  }

  return (
    <Box flex={1}>
      <FancyModalHeader hideBottomDivider useXButton onLeftButtonPress={handleLeftButtonPress} />
      <Box px={2} flex={1}>
        <Text variant="lg">Your alert has been saved</Text>

        <Spacer y={1} />

        <ScrollView contentContainerStyle={{ paddingBottom: bottomInset }}>
          <Text variant="sm" color="black60">
            We’ll let you know when matching works are added to Artsy.
          </Text>

          <Spacer y={2} />

          <Flex flexDirection="row" flexWrap="wrap">
            <Join separator={<Spacer x={1} />}>
              {pills.map((pill) => {
                return (
                  <Pill key={`param-${pill.paramName}-value-${pill.value}`} block>
                    {pill.label}
                  </Pill>
                )
              })}
            </Join>
          </Flex>

          <Spacer y={2} />

          <MatchingArtworksContainer closeModal={closeModal} />

          <Button onPress={handleManageAlerts} block variant="outline">
            Manage your alerts
          </Button>
        </ScrollView>
      </Box>
    </Box>
  )
}

const MatchingArtworksContainer: React.FC<{ closeModal?: () => void }> = ({ closeModal }) => {
  return (
    <Suspense fallback={<MatchingArtworksPlaceholder />}>
      <MatchingArtworks closeModal={closeModal} />
    </Suspense>
  )
}

const matchingArtworksQuery = graphql`
  query ConfirmationScreenMatchingArtworksQuery($input: FilterArtworksInput, $first: Int) {
    artworksConnection(first: $first, input: $input) {
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

const MatchingArtworksPlaceholder: React.FC = () => {
  const screen = useScreenDimensions()
  return (
    <Box borderTopWidth={1} borderTopColor="black30" pt={1}>
      <PlaceholderRaggedText numLines={2} textHeight={20} />
      <Spacer y={2} />
      <GenericGridPlaceholder width={screen.width - 40} />
    </Box>
  )
}

const MatchingArtworks: React.FC<{ closeModal?: () => void }> = ({ closeModal }) => {
  const screen = useScreenDimensions()
  const route = useRoute<RouteProp<CreateSavedSearchAlertNavigationStack, "ConfirmationScreen">>()
  const attributes = SavedSearchStore.useStoreState((state) => state.attributes)

  const data = useLazyLoadQuery<ConfirmationScreenMatchingArtworksQuery>(matchingArtworksQuery, {
    first: NUMBER_OF_ARTWORKS_TO_SHOW,
    input: {
      ...attributes,
      forSale: true,
      sort: "-published_at",
    } as FilterArtworksInput,
  })

  const artworks = extractNodes(data.artworksConnection)
  const total = data?.artworksConnection?.counts?.total // TODO: handle zero state

  const areMoreMatchesAvailable =
    total > NUMBER_OF_ARTWORKS_TO_SHOW && attributes?.artistIDs?.length === 1

  const handleSeeAllMatchingWorks = () => {
    closeModal?.()
    navigate(`/artist/${attributes.artistIDs?.[0]}`, {
      passProps: {
        searchCriteriaID: route.params.searchCriteriaID,
      },
    })
  }

  return (
    <Box borderTopWidth={1} borderTopColor="black30" pt={1}>
      <Text variant="sm" color="black60">
        You might like these {total} works currently on Artsy that match your criteria
      </Text>

      <Spacer y={2} />

      <GenericGrid
        width={screen.width} // important to include this
        artworks={artworks}
      />

      <Spacer y={4} />

      {!!areMoreMatchesAvailable && (
        <Button onPress={handleSeeAllMatchingWorks} block mb={1}>
          See all matching works
        </Button>
      )}
    </Box>
  )
}
