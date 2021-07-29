import { FilterArtworksInput, TagQuery, TagQueryResponse } from "__generated__/TagQuery.graphql"
import { getParamsForInputByFilterType } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { StickyTabPage, TabProps } from "lib/Components/StickyTabPage/StickyTabPage"
import Header from "lib/Components/Tag/Header"
import { TagArtworksPaginationContainer } from "lib/Components/Tag/TagArtworks"
import { TagPlaceholder } from "lib/Components/Tag/TagPlaceholder"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import React from "react"
import { Dimensions, StyleSheet, View, ViewStyle } from "react-native"
import { graphql, QueryRenderer } from "react-relay"

const isPad = Dimensions.get("window").width > 700
const commonPadding = isPad ? 40 : 20

interface TagProps {
  tagID?: string
  tag: NonNullable<TagQueryResponse["tag"]>
}

interface TagQueryRendererProps {
  tagID: string
  medium?: string
  price_range?: string
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
    <View style={styles.header}>
      <Header tag={tag} />
    </View>
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
      <View style={styles.container}>
        <StickyTabPage staticHeaderContent={headerContent} stickyHeaderContent={<></>} tabs={tabs} />
      </View>
    </ProvideScreenTracking>
  )
}

export const TagQueryRenderer: React.FC<TagQueryRendererProps> = (props) => {
  const { tagID, medium, price_range } = props
  const input = getParamsForInputByFilterType(
    {
      medium,
      priceRange: price_range,
    },
    "tagArtwork"
  ) as FilterArtworksInput

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
      variables={{ tagID, input }}
      render={renderWithPlaceholder({
        Container: Tag,
        renderPlaceholder: () => <TagPlaceholder />,
        initialProps: { tagID },
      })}
    />
  )
}

interface Styles {
  container: ViewStyle
  header: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "white",
    paddingLeft: commonPadding,
    paddingRight: commonPadding,
    ...(isPad
      ? {
          width: 330,
          alignSelf: "center",
        }
      : {}),
  },
})
