import { Box, color, Flex, Sans, Serif, Spacer } from "@artsy/palette"
import { FeaturedCollectionsRail_collection } from "__generated__/FeaturedCollectionsRail_collection.graphql"
import { FeaturedCollectionsRail_collectionGroup } from "__generated__/FeaturedCollectionsRail_collectionGroup.graphql"
import { GenericArtistSeriesRail } from "lib/Components/GenericArtistSeriesRail"
import { Markdown } from "lib/Components/Markdown"
import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { ReadMore } from "lib/Components/ReadMore"
import { defaultRules } from "lib/utils/renderMarkdown"
import { Schema } from "lib/utils/track"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
// @ts-ignore
import styled from "styled-components/native"

interface FeaturedCollectionsRailProps {
  collectionGroup: FeaturedCollectionsRail_collectionGroup
  collection: FeaturedCollectionsRail_collection
}

export const FeaturedCollectionsRail: React.SFC<FeaturedCollectionsRailProps> = props => {
  const { collection, collectionGroup } = props
  const collections = collectionGroup?.members ?? []
  const basicRules = defaultRules(true)
  const markdownRules = {
    ...basicRules,
    truncationLimit: 100,
    paragraph: {
      ...basicRules.paragraph,
      // @ts-ignore STRICTNESS_MIGRATION
      react: (node, output, state) => (
        <Sans size="3t" color="black100" key={state.key}>
          {output(node.content, state)}
        </Sans>
      ),
    },
  }

  return collections.length > 0 ? (
    <>
      <Flex ml={"-20px"}>
        <Sans size="4" my={2} ml={4}>
          {collectionGroup.name}
        </Sans>
      </Flex>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={collections}
        keyExtractor={(_item, index) => String(index)}
        initialNumToRender={3}
        ListHeaderComponent={() => <Spacer mx={1} />}
        ListFooterComponent={() => <Spacer mx={1} />}
        ItemSeparatorComponent={() => <Spacer mx={0.5} />}
        renderItem={({ item: result, index }) => {
          return (
            <ImageWrapper key={index} p={2}>
              <ImageView
                width={220}
                height={190}
                imageURL={result?.featuredCollectionArtworks?.edges?.[0]?.node?.image?.url ?? ""}
              />
              <Sans size="3t" weight="medium" mt={"15px"}>
                {result.title}
              </Sans>
              {result.priceGuidance && (
                <Sans color={color("black60")} size="3t" mb={1}>
                  {"From $" + `${result.priceGuidance!.toLocaleString()}`}
                </Sans>
              )}
              <Markdown rules={markdownRules}>{result.descriptionMarkdown || ""}</Markdown>
            </ImageWrapper>
          )
        }}
      />
    </>
  ) : null
}

const ImageWrapper = styled(Flex)`
  border: solid 1px ${color("black10")};
  height: 385px;
  width: 260px;
`

export const FeaturedCollectionsRailContainer = createFragmentContainer(FeaturedCollectionsRail, {
  collection: graphql`
    fragment FeaturedCollectionsRail_collection on MarketingCollection {
      slug
      id
    }
  `,

  collectionGroup: graphql`
    fragment FeaturedCollectionsRail_collectionGroup on MarketingCollectionGroup {
      name
      members {
        slug
        id
        title
        priceGuidance
        descriptionMarkdown
        featuredCollectionArtworks: artworksConnection(first: 1, aggregations: [TOTAL], sort: "-decayed_merch") {
          edges {
            node {
              image {
                url
              }
            }
          }
        }
      }
    }
  `,
})
