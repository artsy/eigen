import { Tabs } from "@artsy/palette-mobile"
import { TagQuery, TagQuery$data } from "__generated__/TagQuery.graphql"
import { TagPlaceholder } from "app/Scenes/Tag/TagPlaceholder"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "app/utils/track"

import { graphql, QueryRenderer } from "react-relay"
import About from "./About"
import { TagArtworksPaginationContainer } from "./TagArtworks"

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
      <Tabs.TabsWithHeader title={tag?.name!}>
        <Tabs.Tab name="Artworks" label="Artworks">
          <TagArtworksPaginationContainer tag={tag!} />
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
          tag(id: $tagID) {
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
        renderPlaceholder: () => <TagPlaceholder />,
        initialProps: { tagID },
      })}
    />
  )
}
