import { Spacer, Flex, Text, Separator, Box, useColor, Screen } from "@artsy/palette-mobile"
import { FeatureQuery } from "__generated__/FeatureQuery.graphql"
import { Feature_feature$data } from "__generated__/Feature_feature.graphql"
import { AboveTheFoldFlatList } from "app/Components/AboveTheFoldFlatList"
import GenericGrid from "app/Components/ArtworkGrids/GenericGrid"
import { ReadMore } from "app/Components/ReadMore"
import { Stack } from "app/Components/Stack"
import { FeatureVideo } from "app/Scenes/Feature/FeatureVideo"
import { goBack } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/hooks"
import { PlaceholderRaggedText } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { chunk } from "lodash"
import { isTablet } from "react-native-device-info"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { FeatureFeaturedLinkFragmentContainer } from "./components/FeatureFeaturedLink"
import {
  FeatureHeaderFragmentContainer,
  FeatureHeaderPlaceholder,
} from "./components/FeatureHeader"
import { FeatureMarkdown } from "./components/FeatureMarkdown"

const SUPPORTED_ITEM_TYPES = ["FeaturedLink", "Artwork"]

interface FlatListSection {
  key: string
  content: React.JSX.Element
}

interface FeatureAppProps {
  feature: Feature_feature$data
}

const BASE_NAV_HEIGHT = 50
const MAX_VIDEO_HEIGHT = 360

const FeatureApp: React.FC<FeatureAppProps> = ({ feature }) => {
  const color = useColor()
  const sets = extractNodes(feature.sets)
  const { width, height: screenHeight, orientation, safeAreaInsets } = useScreenDimensions()
  // Calculate height similar to web: max(50vh - navHeight, 360px)
  const navHeight = BASE_NAV_HEIGHT + safeAreaInsets.top
  const videoHeight = Math.max(screenHeight * 0.5 - navHeight, MAX_VIDEO_HEIGHT)

  const header: FlatListSection = {
    key: "header",
    content: <FeatureHeaderFragmentContainer feature={feature} />,
  }

  // these are the major sections of the page which get separated by a black line
  const allSections: FlatListSection[] = []

  if (feature.description || feature.callout || feature.video?.url) {
    allSections.push({
      key: "description+callout+video",
      content: (
        <Flex>
          {!!(feature.description || feature.callout) && (
            <Flex alignItems="center">
              <Flex gap={4} pt={4} px={2} maxWidth={600}>
                {!!feature.description && (
                  <FeatureMarkdown content={feature.description} textProps={{ variant: "md" }} />
                )}
                {!!feature.callout && (
                  <FeatureMarkdown content={feature.callout} textProps={{ variant: "lg" }} />
                )}
              </Flex>
            </Flex>
          )}
          {!!feature.video?.url && (
            <FeatureVideo videoUrl={feature.video.url} width={width} height={videoHeight} />
          )}
        </Flex>
      ),
    })
  }

  for (const set of sets) {
    const items = extractNodes(set.orderedItems)
    const count = items.length

    if (
      // Nothing to render: it's possible to have a completely empty yet valid set
      (!set.name && !set.description && count === 0) ||
      // Or the set isn't a supported type (Sale, etc.)
      !set.itemType ||
      !SUPPORTED_ITEM_TYPES.includes(set.itemType)
    ) {
      continue
    }

    // Add separator before this set (except for the first section)
    if (allSections.length > 0) {
      allSections.push({
        key: `separator:${set.id}`,
        content: <Separator mb={4} style={{ borderColor: color("mono100") }} />,
      })
    }

    if (set.name || set.description) {
      allSections.push({
        key: "setTitle:" + set.id,
        content: (
          <Flex pb={2} mx={2}>
            {!!set.name && <Text variant="lg-display">{set.name}</Text>}
            {!!set.description && (
              <Box py={1}>
                <ReadMore
                  content={set.description}
                  maxChars={200}
                  textVariant="md"
                  linkTextVariant="md"
                />
              </Box>
            )}
          </Flex>
        ),
      })
    }

    if (count > 0) {
      switch (set.itemType) {
        case "FeaturedLink": {
          const numColumns = isTablet() ? (orientation === "landscape" ? 3 : 2) : 1
          const columnWidth = (width - 20) / numColumns - 20

          const rows = chunk(items, numColumns)

          for (let i = 0; i < rows.length; i++) {
            const row = rows[i]
            allSections.push({
              key: "featuredLinkRow:" + row[0].id,
              content: (
                <Stack horizontal px={2}>
                  {row.map((item) => {
                    return (
                      <FeatureFeaturedLinkFragmentContainer
                        width={columnWidth}
                        key={item.id}
                        featuredLink={item}
                      />
                    )
                  })}
                </Stack>
              ),
            })
            // Add spacer between rows (except after the last row)
            if (i < rows.length - 1) {
              allSections.push({
                key: `featuredLinkSpacer:${set.id}:${i}`,
                content: <Spacer y={4} />,
              })
            }
          }

          break
        }
        case "Artwork":
          allSections.push({
            key: "artworks:" + set.id,
            content: (
              <Flex mx={2}>
                <GenericGrid artworks={items as any} width={width - 40} />
              </Flex>
            ),
          })
          break
        default:
          console.warn("Feature pages only support FeaturedLinks and Artworks")
      }
    }
  }

  return (
    <Screen>
      <Screen.AnimatedHeader onBack={goBack} />
      <AboveTheFoldFlatList<FlatListSection>
        initialNumToRender={__TEST__ ? 100 : 6}
        data={[header, ...allSections]}
        renderItem={(item) => item.item.content}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </Screen>
  )
}

// Top-level route needs to be exported for bundle splitting in the router
const FeatureFragmentContainer = createFragmentContainer(FeatureApp, {
  feature: graphql`
    fragment Feature_feature on Feature {
      ...FeatureHeader_feature
      description
      callout
      video {
        url
      }
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

export const FeatureScreenQuery = graphql`
  query FeatureQuery($slug: ID!) {
    feature(id: $slug) {
      ...Feature_feature
    }
  }
`

export const FeatureQueryRenderer: React.FC<{ slug: string }> = ({ slug }) => {
  return (
    <QueryRenderer<FeatureQuery>
      environment={getRelayEnvironment()}
      query={FeatureScreenQuery}
      render={renderWithPlaceholder({
        renderPlaceholder: () => {
          return (
            <Flex>
              <FeatureHeaderPlaceholder />
              <Flex p={2} pt={4}>
                <Stack width="100%" alignSelf="center" maxWidth={550}>
                  <PlaceholderRaggedText numLines={12} />
                  <PlaceholderRaggedText numLines={12} />
                </Stack>
              </Flex>
            </Flex>
          )
        },
        Container: FeatureFragmentContainer,
      })}
      variables={{ slug }}
    />
  )
}
