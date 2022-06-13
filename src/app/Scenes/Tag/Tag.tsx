import { TagQuery } from "__generated__/TagQuery.graphql"
import { StickyTabPage, TabProps } from "app/Components/StickyTabPage/StickyTabPage"
import About from "app/Components/Tag/About"
import { TagArtworksPaginationContainer } from "app/Components/Tag/TagArtworks"
import { TagPlaceholder } from "app/Components/Tag/TagPlaceholder"
import { defaultEnvironment } from "app/relay/createEnvironment"
import Header from "app/Scenes/Tag/TagHeader"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { Flex, useTheme } from "palette"
import React from "react"
import { View } from "react-native"
import DeviceInfo from "react-native-device-info"
import { graphql, QueryRenderer } from "react-relay"

const isHandset = DeviceInfo.getDeviceType() === "Handset"
const commonPadding = isHandset ? 20 : 40

const TABS = {
  ARTWORKS: "Artworks",
  ABOUT: "About",
}

interface TagProps {
  tagID?: string
  tag: NonNullable<TagQuery["response"]["tag"]>
}

interface TagQueryRendererProps {
  tagID: string
}

export const Tag: React.FC<TagProps> = (props) => {
  const { tag, tagID } = props
  const { color } = useTheme()

  const tabs: TabProps[] = [
    {
      title: TABS.ARTWORKS,
      content: <TagArtworksPaginationContainer tag={tag} />,
    },
  ]

  if (tag.description) {
    tabs.push({
      title: TABS.ABOUT,
      content: <About tag={tag} />,
    })
  }

  const headerContent = (
    <View
      style={{
        backgroundColor: color("white100"),
        paddingLeft: commonPadding,
        paddingRight: commonPadding,
        justifyContent: "center",
        alignSelf: isHandset ? "auto" : "center",
      }}
    >
      <Header tag={tag} />
    </View>
  )

  const stickyHeaderContentProp = tabs.length === 1 ? { stickyHeaderContent: <></> } : {}

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.TagPage,
        context_screen_owner_type: Schema.OwnerEntityTypes.Tag,
        context_screen_owner_id: tagID,
        context_screen_owner_slug: tag.slug,
      }}
    >
      <Flex flex={1}>
        <StickyTabPage
          staticHeaderContent={headerContent}
          {...stickyHeaderContentProp}
          tabs={tabs}
        />
      </Flex>
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
            description
            ...About_tag
            ...TagHeader_tag
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
