import { Flex, Spacer } from "@artsy/palette"
import { Feature_feature } from "__generated__/Feature_feature.graphql"
import { FeatureQuery } from "__generated__/FeatureQuery.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import { SectionTitle } from "lib/Components/SectionTitle"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractNodes } from "lib/utils/extractNodes"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { FeatureFeaturedLinkFragmentContainer } from "./components/FeatureFeaturedLink"
import { FeatureHeaderFragmentContainer } from "./components/FeatureHeader"
import { FeatureMarkdown } from "./components/FeatureMarkdown"

const SUPPORTED_ITEM_TYPES = ["FeaturedLink", "Artwork"]

interface Section {
  key: string
  content: JSX.Element
}

interface FeatureAppProps {
  feature: Feature_feature
}

const FeatureApp: React.FC<FeatureAppProps> = ({ feature }) => {
  const sets = extractNodes(feature.sets)
  const { width } = useScreenDimensions()

  const sections: Section[] = [{ key: "header", content: <FeatureHeaderFragmentContainer feature={feature} /> }]

  function addSpacer(size: 1 | 2 | 3) {
    sections.push({
      key: "spacer:" + sections.length,
      content: <Spacer mb={size} />,
    })
  }

  addSpacer(3)

  if (feature.description) {
    sections.push({
      key: "description",
      content: (
        <Flex mx="2">
          <FeatureMarkdown content={feature.description} />
        </Flex>
      ),
    })
    addSpacer(3)
  }

  if (feature.callout) {
    sections.push({
      key: "callout",
      content: (
        <Flex mx="2">
          <FeatureMarkdown content={feature.callout} />
        </Flex>
      ),
    })
    addSpacer(3)
  }

  for (const set of sets) {
    const items = extractNodes(set.orderedItems)
    const count = items.length

    if (
      // Nothing to render: it's possible to have a completely empty yet valid set
      (!set.name && !set.description && count === 0) ||
      // Or the set isn't a supported type (Sale, etc.)
      !SUPPORTED_ITEM_TYPES.includes(set.itemType!)
    ) {
      continue
    }

    if (set.name || set.description) {
      sections.push({
        key: "setTitle:" + set.id,
        content: (
          <Flex mx="2">
            <SectionTitle title={set.name} subtitle={set.description} />
          </Flex>
        ),
      })
    }

    if (count > 0) {
      switch (set.itemType) {
        case "FeaturedLink":
          for (const item of items) {
            if (item.__typename === "FeaturedLink") {
              sections.push({
                key: "featuredLink:" + item.id,
                content: <FeatureFeaturedLinkFragmentContainer featuredLink={item as any} />,
              })
              if (item !== items[items.length - 1]) {
                addSpacer(3)
              }
            }
          }
          break
        case "Artwork":
          sections.push({
            key: "artworks:" + set.id,
            content: (
              <Flex mx="2">
                <GenericGrid artworks={items as any} width={width - 40} />
              </Flex>
            ),
          })
          break
        default:
          console.warn("Feature pages only support FeaturedLinks and Artworks")
      }
    }

    addSpacer(3)
  }

  return <AboveTheFoldFlatList<Section> initialNumToRender={6} data={sections} renderItem={item => item.item.content} />
}

// Top-level route needs to be exported for bundle splitting in the router
const FeatureFragmentContainer = createFragmentContainer(FeatureApp, {
  feature: graphql`
    fragment Feature_feature on Feature {
      ...FeatureHeader_feature
      description
      callout
      sets: setsConnection(first: 20) {
        edges {
          node {
            id
            name
            description
            itemType
            # TODO: Handle pagination
            orderedItems: orderedItemsConnection(first: 35) {
              edges {
                node {
                  __typename
                  ... on FeaturedLink {
                    id
                    href
                  }
                  ... on Artwork {
                    ...GenericGrid_artworks
                  }
                  ...FeatureFeaturedLink_featuredLink
                }
              }
            }
          }
        }
      }
    }
  `,
})

export const FeatureQueryRenderer: React.FC<{ slug: string }> = ({ slug }) => {
  return (
    <QueryRenderer<FeatureQuery>
      environment={defaultEnvironment}
      query={graphql`
        query FeatureQuery($slug: ID!) {
          feature(id: $slug) {
            ...Feature_feature
          }
        }
      `}
      render={renderWithPlaceholder({
        renderPlaceholder: () => <Flex></Flex>,
        Container: FeatureFragmentContainer,
      })}
      variables={{ slug }}
    />
  )
}
