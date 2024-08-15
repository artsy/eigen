import { ActionType, ContextModule, OwnerType, TappedArtworkGroup } from "@artsy/cohesion"
import { Box, Button, Flex, Spacer, Text, useTheme, Pill } from "@artsy/palette-mobile"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import {
  ConfirmationScreenMatchingArtworksQuery,
  ConfirmationScreenMatchingArtworksQuery$data,
  FilterArtworksInput,
} from "__generated__/ConfirmationScreenMatchingArtworksQuery.graphql"
import GenericGrid, { GenericGridPlaceholder } from "app/Components/ArtworkGrids/GenericGrid"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { CreateSavedSearchAlertNavigationStack } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { useSavedSearchPills } from "app/Scenes/SavedSearchAlert/useSavedSearchPills"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/hooks/useScreenDimensions"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { PlaceholderRaggedText } from "app/utils/placeholders"
import { pluralize } from "app/utils/pluralize"
import { useEffect } from "react"
import { ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, useLazyLoadQuery } from "react-relay"

export const NUMBER_OF_ARTWORKS_TO_SHOW = 10

export const ConfirmationScreen: React.FC = () => {
  const navigation =
    useNavigation<NavigationProp<CreateSavedSearchAlertNavigationStack, "ConfirmationScreen">>()
  const route = useRoute<RouteProp<CreateSavedSearchAlertNavigationStack, "ConfirmationScreen">>()
  const { closeModal } = route.params
  const { bottom: bottomInset } = useSafeAreaInsets()

  const pills = useSavedSearchPills()

  const { space } = useTheme()

  useEffect(() => {
    const backListener = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault()
    })
    return backListener
  }, [])

  const handleLeftButtonPress = () => {
    closeModal?.()
  }

  const handleManageAlerts = () => {
    closeModal?.()
    requestAnimationFrame(() => {
      navigate("/settings/alerts")
    })
  }

  return (
    <Box flex={1}>
      <FancyModalHeader hideBottomDivider useXButton onLeftButtonPress={handleLeftButtonPress} />
      <Box flex={1}>
        <Text variant="lg" px={2}>
          Your alert has been saved
        </Text>

        <Spacer y={1} />

        <ScrollView
          contentContainerStyle={{
            paddingBottom: bottomInset,
            paddingHorizontal: space(2),
          }}
        >
          <Text variant="sm" color="black60">
            We’ll let you know when matching works are added to Artsy.
          </Text>

          <Spacer y={2} />

          <Flex flexDirection="row" flexWrap="wrap">
            {pills.map((pill) => {
              return (
                <Pill
                  key={`param-${pill.paramName}-value-${pill.value}`}
                  variant="filter"
                  disabled
                  mr={1}
                  mb={1}
                >
                  {pill.label}
                </Pill>
              )
            })}
          </Flex>

          <Spacer y={1} />

          <MatchingArtworksContainer closeModal={closeModal} />

          <Button onPress={handleManageAlerts} block variant="outline">
            Manage your alerts
          </Button>
        </ScrollView>
      </Box>
    </Box>
  )
}

const MatchingArtworksPlaceholder: React.FC = () => {
  const screen = useScreenDimensions()
  const { space } = useTheme()
  return (
    <Box testID="MatchingArtworksPlaceholder" borderTopWidth={1} borderTopColor="black30" pt={1}>
      <PlaceholderRaggedText numLines={2} textHeight={20} />
      <Spacer y={2} />
      <GenericGridPlaceholder width={screen.width - space(4)} />
    </Box>
  )
}

const MatchingArtworksContainer: React.FC<{ closeModal?: () => void }> = withSuspense(
  ({ closeModal }) => {
    // TODO: instead of using artworksConnection and passing attributes from the store, use `alert.artworksConnection` field instead.
    const attributes = SavedSearchStore.useStoreState((state) => state.attributes)
    const currentArtworkID = SavedSearchStore.useStoreState((state) => state.currentArtworkID)
    const data = useLazyLoadQuery<ConfirmationScreenMatchingArtworksQuery>(matchingArtworksQuery, {
      first: NUMBER_OF_ARTWORKS_TO_SHOW,
      input: {
        ...attributes,
        forSale: true,
        sort: "-published_at",
        excludeArtworkIDs: currentArtworkID ? [currentArtworkID] : undefined,
      } as FilterArtworksInput,
    })

    return <MatchingArtworks artworksConnection={data.artworksConnection} closeModal={closeModal} />
  },
  MatchingArtworksPlaceholder
)

const matchingArtworksQuery = graphql`
  query ConfirmationScreenMatchingArtworksQuery($input: FilterArtworksInput, $first: Int) {
    artworksConnection(first: $first, input: $input) {
      counts {
        total
      }
      edges {
        node {
          slug
          ...GenericGrid_artworks
        }
      }
    }
  }
`
interface MatchingArtworksProps {
  artworksConnection: ConfirmationScreenMatchingArtworksQuery$data["artworksConnection"]
  closeModal?: () => void
}

const MatchingArtworks: React.FC<MatchingArtworksProps> = ({ artworksConnection, closeModal }) => {
  const screen = useScreenDimensions()
  const { space } = useTheme()
  const route = useRoute<RouteProp<CreateSavedSearchAlertNavigationStack, "ConfirmationScreen">>()
  const artworks = extractNodes(artworksConnection)
  const total = artworksConnection?.counts?.total
  const attributes = SavedSearchStore.useStoreState((state) => state.attributes)

  const areMoreMatchesAvailable =
    total > NUMBER_OF_ARTWORKS_TO_SHOW && attributes?.artistIDs?.length === 1

  const handleSeeAllMatchingWorks = () => {
    closeModal?.()
    requestAnimationFrame(() => {
      navigate(`/artist/${attributes.artistIDs?.[0]}`, {
        passProps: {
          search_criteria_id: route.params.searchCriteriaID,
        },
      })
    })
  }

  if (total === 0) {
    return (
      <Text mb={2} p={2} bg="black10" color="black60">
        There aren't any works available that meet the criteria at this time.
      </Text>
    )
  }

  const numWorks = `${total} ${pluralize("work", total)}`

  const message = !!areMoreMatchesAvailable
    ? `${numWorks} currently on Artsy match your criteria. See our top picks for you:`
    : `You might like ${pluralize(
        "this",
        total,
        "these"
      )} ${numWorks} currently on Artsy that match your criteria:`

  return (
    <Box borderTopWidth={1} borderTopColor="black30" pt={1}>
      <Text variant="sm" color="black60">
        {message}
      </Text>

      <Spacer y={2} />

      <GenericGrid
        width={screen.width - space(2)}
        artworks={artworks}
        hideSaveIcon
        onPress={(slug: string, withPartnerOffer: boolean) => {
          closeModal?.()
          tracks.tappedArtworkGroup(slug, withPartnerOffer)
          requestAnimationFrame(() => {
            navigate?.(`artwork/${slug}`)
          })
        }}
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

const tracks = {
  tappedArtworkGroup: (slug: string, withPartnerOffer: boolean): TappedArtworkGroup => ({
    action: ActionType.tappedArtworkGroup,
    context_module: ContextModule.alertConfirmation,
    context_screen_owner_type: OwnerType.alertConfirmation,
    destination_screen_owner_type: OwnerType.artwork,
    destination_screen_owner_slug: slug,
    type: "thumbnail",
    signal_labels: withPartnerOffer ? "Limited-Time Offer" : undefined,
  }),
}
