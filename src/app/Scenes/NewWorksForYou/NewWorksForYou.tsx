import { OwnerType } from "@artsy/cohesion"
import { SimpleMessage, Spacer } from "@artsy/palette-mobile"
import { NewWorksForYouQuery } from "__generated__/NewWorksForYouQuery.graphql"
import { NewWorksForYou_viewer$data } from "__generated__/NewWorksForYou_viewer.graphql"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { useExperimentVariant } from "app/utils/experiments/hooks"
import { extractNodes } from "app/utils/extractNodes"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { QueryRenderer, RelayPaginationProp, createPaginationContainer, graphql } from "react-relay"

const SCREEN_TITLE = "New Works for You"
const PAGE_SIZE = 100
export const RECOMMENDATION_MODEL_EXPERIMENT_NAME = "eigen-new-works-for-you-recommendations-model"
export const DEFAULT_RECS_MODEL_VERSION = "C"

interface NewWorksForYouProps {
  relay: RelayPaginationProp
  viewer: NewWorksForYou_viewer$data
}

const NewWorksForYou: React.FC<NewWorksForYouProps> = ({ viewer }) => {
  const artworks = extractNodes(viewer.artworks)

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.newWorksForYou })}
    >
      <PageWithSimpleHeader title={SCREEN_TITLE}>
        <MasonryInfiniteScrollArtworkGrid
          artworks={artworks}
          pageSize={PAGE_SIZE}
          contextScreenOwnerType={OwnerType.newWorksForYou}
          contextScreen={OwnerType.newWorksForYou}
          ListEmptyComponent={
            <SimpleMessage m={2}>Nothing yet. Please check back later.</SimpleMessage>
          }
          hasMore={false}
        />
      </PageWithSimpleHeader>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

export const NewWorksForYouFragmentContainer = createPaginationContainer(
  NewWorksForYou,
  {
    viewer: graphql`
      fragment NewWorksForYou_viewer on Viewer
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 100 }
        cursor: { type: "String" }
        includeBackfill: { type: "Boolean!" }
        version: { type: "String" }
        maxWorksPerArtist: { type: "Int" }
      ) {
        artworks: artworksForUser(
          after: $cursor
          first: $count
          includeBackfill: $includeBackfill
          maxWorksPerArtist: $maxWorksPerArtist
          version: $version
        ) @connection(key: "NewWorksForYou_artworks") @principalField {
          edges {
            node {
              id
              slug
              image(includeAll: false) {
                aspectRatio
              }
              ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props?.viewer?.artworks
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        cursor,
        count,
      }
    },
    query: graphql`
      query NewWorksForYouRefetchQuery(
        $cursor: String
        $count: Int!
        $version: String
        $includeBackfill: Boolean!
        $maxWorksPerArtist: Int
      ) {
        viewer {
          ...NewWorksForYou_viewer
            @arguments(
              cursor: $cursor
              count: $count
              includeBackfill: $includeBackfill
              version: $version
              maxWorksPerArtist: $maxWorksPerArtist
            )
        }
      }
    `,
  }
)

export const NewWorksForYouScreenQuery = graphql`
  query NewWorksForYouQuery($includeBackfill: Boolean!, $version: String, $maxWorksPerArtist: Int) {
    viewer {
      ...NewWorksForYou_viewer
        @arguments(
          includeBackfill: $includeBackfill
          version: $version
          maxWorksPerArtist: $maxWorksPerArtist
        )
    }
  }
`

interface NewWorksForYouQueryRendererProps {
  utm_medium?: string
  includeBackfill?: boolean
  maxWorksPerArtist?: number
  version?: string
}

export const NewWorksForYouQueryRenderer: React.FC<NewWorksForYouQueryRendererProps> = ({
  utm_medium,
  includeBackfill = true,
  maxWorksPerArtist = 3,
  version: versionProp,
}) => {
  const worksForYouRecommendationsModel = useExperimentVariant(RECOMMENDATION_MODEL_EXPERIMENT_NAME)
  const isReferredFromEmail = utm_medium === "email"

  // Use the version specified in the URL or no version if the screen is opened from the email.
  const version = isReferredFromEmail
    ? versionProp?.toUpperCase() || undefined
    : worksForYouRecommendationsModel.payload || DEFAULT_RECS_MODEL_VERSION

  return (
    <QueryRenderer<NewWorksForYouQuery>
      environment={getRelayEnvironment()}
      query={NewWorksForYouScreenQuery}
      variables={{
        version,
        includeBackfill,
        maxWorksPerArtist,
      }}
      render={renderWithPlaceholder({
        Container: NewWorksForYouFragmentContainer,
        renderPlaceholder: Placeholder,
        renderFallback: () => null,
      })}
    />
  )
}

const Placeholder = () => {
  return (
    <ProvidePlaceholderContext>
      <PageWithSimpleHeader title={SCREEN_TITLE}>
        <Spacer y={2} />
        <PlaceholderGrid />
      </PageWithSimpleHeader>
    </ProvidePlaceholderContext>
  )
}
