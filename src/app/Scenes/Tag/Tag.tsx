import { Screen } from "@artsy/palette-mobile"
import { TagQuery } from "__generated__/TagQuery.graphql"
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

// const isHandset = DeviceInfo.getDeviceType() === "Handset"
// Do we need to handle the tablet paddings or are they handled automatically by palette responsiveness?
// const commonPadding = isHandset ? 20 : 40

interface TagProps {
  tagID?: string
  tag: NonNullable<TagQuery["response"]["tag"]>
}

interface TagQueryRendererProps {
  tagID: string
}

export const Tag: React.FC<TagProps> = (props) => {
  const { tag, tagID } = props

  // const handleTabPress = () => {
  //   // tracking.trackEvent(tracks.clickedActivityPanelTab(data.tabName))
  // }

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.TagPage,
        context_screen_owner_type: Schema.OwnerEntityTypes.Tag,
        context_screen_owner_id: tagID,
        context_screen_owner_slug: tag.slug,
      }}
    >
      <Screen>
        <Screen.Body fullwidth>
          <TabsContainer
            // TODO: Do we want to track anything here? we weren't tracking anything before
            // onTabChange={handleTabPress}
            renderHeader={() => {
              if (tag.name) {
                return (
                  <Screen.Header
                    title={tag.name}
                    titleProps={{ alignItems: "center" }}
                    onBack={goBack}
                  />
                )
              }
              return null
            }}
          >
            <Tabs.Tab name="Artworks" label="Artworks">
              <TagArtworksPaginationContainer tag={tag} />
            </Tabs.Tab>
            {!!tag.description ? (
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
        // TODO: Placeholder looks borked need to fix
        renderPlaceholder: () => <TagPlaceholder />,
        initialProps: { tagID },
      })}
    />
  )
}
