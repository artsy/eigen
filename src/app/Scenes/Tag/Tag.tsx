import { Screen } from "@artsy/palette-mobile"
import { TagQuery, TagQuery$data } from "__generated__/TagQuery.graphql"
import { TabsContainer } from "app/Components/Tabs/TabsContainer"
import { goBack } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { Tabs } from "react-native-collapsible-tab-view"
import { graphql, QueryRenderer } from "react-relay"
import About from "./About"
import { TagArtworksPaginationContainer } from "./TagArtworks"
import { TagPlaceholder } from "./TagPlaceholder"

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
      <Screen>
        <Screen.Body fullwidth>
          <TabsContainer
            renderHeader={() => {
              return (
                <Screen.Header
                  title={tag?.name!}
                  titleProps={{ alignItems: "flex-start" }}
                  onBack={goBack}
                />
              )
            }}
          >
            <Tabs.Tab name="Artworks" label="Artworks">
              <TagArtworksPaginationContainer tag={tag!} />
            </Tabs.Tab>
            {!!tag?.description ? (
              <Tabs.Tab name="About" label="About">
                <About tag={tag} />
              </Tabs.Tab>
            ) : null}
          </TabsContainer>
        </Screen.Body>
      </Screen>
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
