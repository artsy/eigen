import { TagQuery, TagQueryResponse } from "__generated__/TagQuery.graphql"
import { StickyTabPage, TabProps } from "lib/Components/StickyTabPage/StickyTabPage"
import About from "lib/Components/Tag/About"
import { TagArtworksPaginationContainer } from "lib/Components/Tag/TagArtworks"
import { TagPlaceholder } from "lib/Components/Tag/TagPlaceholder"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import Header from "lib/Scenes/Tag/TagHeader"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { color } from "palette"
import React from "react"
import DeviceInfo from "react-native-device-info"
import { graphql, QueryRenderer } from "react-relay"
import styled from "styled-components/native"

const isHandset = DeviceInfo.getDeviceType() === "Handset"
const commonPadding = isHandset ? 20 : 40

console.log("getDeviceType()", DeviceInfo.getDeviceType())

const HeaderView = styled.View<{ isHandset: boolean }>`
  padding-left: ${commonPadding};
  background-color: ${color("white100")};
  padding-right: ${commonPadding};
  justify-content: center;
  align-self: ${isHandset ? "auto" : "center"};
`

const ContentView = styled.View`
  flex: 1;
`

interface TagProps {
  tagID?: string
  tag: NonNullable<TagQueryResponse["tag"]>
}

interface TagQueryRendererProps {
  tagID: string
}

export const Tag: React.FC<TagProps> = (props) => {
  const { tag, tagID } = props

  const tabs: TabProps[] = [
    {
      title: "Artworks",
      content: <TagArtworksPaginationContainer tag={tag} />,
    },
  ]

  const headerContent = (
    <HeaderView isHandset={isHandset}>
      <Header tag={tag} />
    </HeaderView>
  )

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.TagPage,
        context_screen_owner_type: Schema.OwnerEntityTypes.Tag,
        context_screen_owner_id: tagID,
        context_screen_owner_slug: tag.slug,
      }}
    >
      <ContentView>
        <StickyTabPage staticHeaderContent={headerContent} stickyHeaderContent={<></>} tabs={tabs} />
        <About tag={tag} />
      </ContentView>
    </ProvideScreenTracking>
  )
}

export const TagQueryRenderer: React.FC<TagQueryRendererProps> = (props) => {
  const { tagID } = props

  return (
    <QueryRenderer<TagQuery>
      environment={defaultEnvironment}
      query={graphql`
        query TagQuery($tagID: String!, $input: FilterArtworksInput) {
          tag(id: $tagID) {
            slug
            ...Header_tag
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
