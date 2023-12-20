import {
  Flex,
  Screen,
  Separator,
  Skeleton,
  SkeletonText,
  Spacer,
  Tabs,
} from "@artsy/palette-mobile"
import { TagQuery, TagQuery$data } from "__generated__/TagQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { TagArtworksPaginationContainer } from "app/Scenes/Tag/TagArtworks"
import { goBack } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "app/utils/track"

import { graphql, QueryRenderer } from "react-relay"
import About from "./About"

interface TagProps {
  tagID?: string
  tag: TagQuery$data["tag"]
}

interface TagQueryRendererProps {
  tagID: string
}

export const Tag: React.FC<TagProps> = (props) => {
  const { tag, tagID } = props

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.TagPage,
        context_screen_owner_type: Schema.OwnerEntityTypes.Tag,
        context_screen_owner_id: tagID,
        context_screen_owner_slug: tag?.slug,
      }}
    >
      <Tabs.TabsWithHeader title={tag?.name ?? ""} headerProps={{ onBack: goBack }}>
        <Tabs.Tab name="Artworks" label="Artworks">
          <ArtworkFiltersStoreProvider>
            <TagArtworksPaginationContainer tag={tag} />
          </ArtworkFiltersStoreProvider>
        </Tabs.Tab>
        {!!tag?.description ? (
          <Tabs.Tab name="About" label="About">
            <About tag={tag} />
          </Tabs.Tab>
        ) : null}
      </Tabs.TabsWithHeader>
    </ProvideScreenTracking>
  )
}

export const TagQueryRenderer: React.FC<TagQueryRendererProps> = (props) => {
  const { tagID } = props

  return (
    <QueryRenderer<TagQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query TagQuery($tagID: String!, $input: FilterArtworksInput) {
          tag(id: $tagID) @principalField {
            slug
            name
            description
            ...About_tag
            ...TagArtworks_tag @arguments(input: $input)
          }
        }
      `}
      variables={{ tagID }}
      render={renderWithPlaceholder({
        Container: Tag,
        renderPlaceholder: () => <TagSkeleton />,
        initialProps: { tagID },
      })}
    />
  )
}

const TagSkeleton: React.FC = () => {
  return (
    <Screen>
      <Screen.Header />
      <Screen.Body fullwidth>
        <Skeleton>
          <Flex px={2}>
            <SkeletonText variant="xl">Guitar Tag</SkeletonText>
          </Flex>

          <Spacer y={2} />

          {/* Tabs */}
          <Flex justifyContent="space-around" flexDirection="row" px={2}>
            <SkeletonText variant="xs">Artworks</SkeletonText>
            <SkeletonText variant="xs">Description</SkeletonText>
          </Flex>
        </Skeleton>

        <Separator mt={1} mb={2} />

        <Flex justifyContent="space-between" flexDirection="row" px={2}>
          <SkeletonText variant="xs">Sort and Filter</SkeletonText>
        </Flex>

        <Separator my={2} />

        <SkeletonText mx={2} variant="xs">
          Showing 57326 works
        </SkeletonText>

        <Spacer y={2} />

        <PlaceholderGrid />
      </Screen.Body>
    </Screen>
  )
}
