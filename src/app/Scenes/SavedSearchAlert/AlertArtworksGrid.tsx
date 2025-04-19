import { OwnerType } from "@artsy/cohesion"
import {
  Box,
  Button,
  Flex,
  SkeletonText,
  Spacer,
  Text,
  useScreenDimensions,
  useTheme,
} from "@artsy/palette-mobile"
import { AlertArtworksGridQuery } from "__generated__/AlertArtworksGridQuery.graphql"
import GenericGrid, { GenericGridPlaceholder } from "app/Components/ArtworkGrids/GenericGrid"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { pluralize } from "app/utils/pluralize"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { FC } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

interface AlertArtworksGridProps {
  alertId: string
  fetchKey?: number
}

const NUMBER_OF_ARTWORKS_TO_SHOW = 10

export const AlertArtworksGrid: FC<AlertArtworksGridProps> = ({ alertId, fetchKey }) => {
  const screenDimensions = useScreenDimensions()
  const { space } = useTheme()

  const data = useLazyLoadQuery<AlertArtworksGridQuery>(
    alertArtworksGridQuery,
    {
      alertId: alertId,
      first: NUMBER_OF_ARTWORKS_TO_SHOW,
    },
    {
      fetchPolicy: "network-only",
      fetchKey: fetchKey ?? 0,
    }
  )
  const artworks = extractNodes(data.me?.alert?.artworksConnection)
  const artworksCount = data.me?.alert?.artworksConnection?.counts?.total ?? 0
  const artistIDs = data.me?.alert?.artistIDs ?? []
  const areMoreMatchesAvailable =
    artworksCount > NUMBER_OF_ARTWORKS_TO_SHOW && artistIDs.length === 1

  const numWorks = `${artworksCount} ${pluralize("work", artworksCount)}`

  const handleManageAlert = () => {
    navigate(`favorites/alerts/${alertId}/edit`)
  }

  const handleSeeAllMatchingWorks = () => {
    navigate(`/artist/${artistIDs?.[0]}`, {
      passProps: {
        search_criteria_id: alertId,
      },
    })
  }

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.savedSearchArtworkMatches,
        context_screen_owner_id: alertId,
        context_screen_referrer_type: OwnerType.savedSearch,
      })}
    >
      <Flex>
        {artworksCount > 0 && (
          <Flex>
            <Text variant="sm">
              {numWorks} currently on Artsy match your criteria. See our top picks for you:
            </Text>
            <Spacer y={1} />
            <GenericGrid
              width={screenDimensions.width - space(2)}
              artworks={artworks}
              hideSaveIcon
            />
          </Flex>
        )}
        {artworksCount === 0 && (
          <Box bg="mono10" p={2}>
            <Text color="mono100">No matches</Text>
            <Text color="mono60">
              There aren't any works available that meet the criteria at this time.
            </Text>
          </Box>
        )}

        <Spacer y={2} />

        {!!areMoreMatchesAvailable && (
          <Flex>
            <Button onPress={handleSeeAllMatchingWorks} block mb={1}>
              See all Matching Works
            </Button>
            <Spacer y={0.5} />
          </Flex>
        )}

        <Button onPress={handleManageAlert} block mb={1} variant="outline">
          Edit Alert
        </Button>

        <Spacer y={2} />
      </Flex>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

const alertArtworksGridQuery = graphql`
  query AlertArtworksGridQuery($alertId: String!, $first: Int!) {
    me {
      alert(id: $alertId) {
        artistIDs
        artworksConnection(first: $first) {
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
    }
  }
`

export const AlertArtworksGridPlaceholder: FC = () => {
  const screenDimensions = useScreenDimensions()
  const { space } = useTheme()

  return (
    <Flex testID="alert-artworks-grid-placeholder">
      <SkeletonText>
        300 works currently on Artsy match your criteria. See our top picks for you:
      </SkeletonText>
      <Spacer y={1} />
      <GenericGridPlaceholder width={screenDimensions.width - space(4)} />
    </Flex>
  )
}
