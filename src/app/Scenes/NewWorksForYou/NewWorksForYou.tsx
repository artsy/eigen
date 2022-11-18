import { OwnerType } from "@artsy/cohesion"
import { MasonryFlashList, MasonryFlashListScrollEvent } from "@shopify/flash-list"
import { NewWorksForYou_viewer$data } from "__generated__/NewWorksForYou_viewer.graphql"
import { NewWorksForYouQuery } from "__generated__/NewWorksForYouQuery.graphql"
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { PlaceholderGrid, ProvidePlaceholderContext } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { Box, OpaqueImageView, SimpleMessage, Spacer, Text, useSpace } from "palette"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { useScreenDimensions } from "shared/hooks"

const SCREEN_TITLE = "New Works for You"
const PAGE_SIZE = 100

interface NewWorksForYouProps {
  relay: RelayPaginationProp
  viewer: NewWorksForYou_viewer$data
}

const NewWorksForYou: React.FC<NewWorksForYouProps> = ({ viewer }) => {
  const space = useSpace()
  const test = extractNodes(viewer.artworks)
  const { width } = useScreenDimensions()
  console.warn({ test })

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.newWorksForYou })}
    >
      <PageWithSimpleHeader title={SCREEN_TITLE}>
        {/* <Box> */}
        {/* {!!viewer.artworks?.edges?.length ? (
            <InfiniteScrollArtworksGridContainer
              connection={viewer.artworks!}
              loadMore={() => null}
              hasMore={() => false}
              pageSize={PAGE_SIZE}
              contextScreenOwnerType={OwnerType.newWorksForYou}
              HeaderComponent={<Spacer mt={2} />}
              shouldAddPadding
              showLoadingSpinner
              useParentAwareScrollView={false}
            />
          ) : (
            <SimpleMessage m={2}>Nothing yet. Please check back later.</SimpleMessage>
          )} */}
        <MasonryFlashList
          contentContainerStyle={{ paddingVertical: space(2) }}
          numColumns={2}
          data={test}
          estimatedItemSize={width / 2}
          renderItem={({ item }) => {
            console.warn({ img: item.image?.url })
            return (
              <Box mx={1}>
                <OpaqueImageView
                  imageURL={item.image?.url}
                  width={width / 2 - space("2")}
                  aspectRatio={item.image?.aspectRatio}
                />
                <Text>{item.title}</Text>
              </Box>
            )
          }}
          ListEmptyComponent={
            <SimpleMessage m={2}>Nothing yet. Please check back later.</SimpleMessage>
          }
        />
        {/* </Box> */}
      </PageWithSimpleHeader>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

export const NewWorksForYouFragmentContainer = createPaginationContainer(
  NewWorksForYou,
  {
    viewer: graphql`
      fragment NewWorksForYou_viewer on Viewer
      @argumentDefinitions(count: { type: "Int", defaultValue: 100 }, cursor: { type: "String" }) {
        artworks: artworksForUser(
          after: $cursor
          first: $count
          includeBackfill: true
          maxWorksPerArtist: 3
        ) @connection(key: "NewWorksForYou_artworks") {
          edges {
            node {
              id
              title
              image {
                url(version: "large")
                aspectRatio
              }
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
      query NewWorksForYouRefetchQuery($cursor: String, $count: Int!) {
        viewer {
          ...NewWorksForYou_viewer @arguments(cursor: $cursor, count: $count)
        }
      }
    `,
  }
)

export const NewWorksForYouScreenQuery = graphql`
  query NewWorksForYouQuery {
    viewer {
      ...NewWorksForYou_viewer
    }
  }
`

export const NewWorksForYouQueryRenderer: React.FC = () => {
  return (
    <QueryRenderer<NewWorksForYouQuery>
      environment={defaultEnvironment}
      query={NewWorksForYouScreenQuery}
      variables={{}}
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
        <Spacer mt={2} />
        <PlaceholderGrid />
      </PageWithSimpleHeader>
    </ProvidePlaceholderContext>
  )
}
