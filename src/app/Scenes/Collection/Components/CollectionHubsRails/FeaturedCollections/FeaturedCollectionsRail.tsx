import { Spacer, Flex, useColor, Text, Touchable, Image } from "@artsy/palette-mobile"
import { themeGet } from "@styled-system/theme-get"
import { FeaturedCollectionsRail_collection$data } from "__generated__/FeaturedCollectionsRail_collection.graphql"
import { FeaturedCollectionsRail_collectionGroup$data } from "__generated__/FeaturedCollectionsRail_collectionGroup.graphql"
import { AboveTheFoldFlatList } from "app/Components/AboveTheFoldFlatList"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { defaultRules, renderMarkdown } from "app/utils/renderMarkdown"
import { Schema } from "app/utils/track"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"

interface FeaturedCollectionsRailProps {
  collectionGroup: FeaturedCollectionsRail_collectionGroup$data
  collection: FeaturedCollectionsRail_collection$data
}

type FeaturedCollection = FeaturedCollectionsRail_collectionGroup$data["members"][0]

export const FeaturedCollectionsRail: React.FC<FeaturedCollectionsRailProps> = (props) => {
  const color = useColor()
  const tracking = useTracking()

  const { collection, collectionGroup } = props
  const collections = collectionGroup?.members ?? []

  const handleMarkdown = (markdown: string, titleLength: number) => {
    const markdownRules = defaultRules({
      modal: true,
      ruleOverrides: {
        paragraph: {
          react: (node, output, state) => (
            <Text
              variant="sm"
              color="mono100"
              key={state.key}
              numberOfLines={titleLength > 32 ? 3 : 4}
            >
              {output(node.content, state)}
            </Text>
          ),
        },
      },
    })

    return renderMarkdown(markdown, markdownRules)
  }

  const handleNavigation = (slug: string) => {
    return navigate(`/collection/${slug}`)
  }

  return collections.length > 0 ? (
    <>
      <Flex ml={-2}>
        <Text variant="sm-display" my={2} ml={4} testID="group">
          {collectionGroup.name}
        </Text>
      </Flex>
      <AboveTheFoldFlatList<FeaturedCollection>
        horizontal
        showsHorizontalScrollIndicator={false}
        data={collections as FeaturedCollection[]}
        keyExtractor={(_item, index) => String(index)}
        initialNumToRender={3}
        ListHeaderComponent={() => <Spacer x={1} />}
        ListFooterComponent={() => <Spacer x={1} />}
        ItemSeparatorComponent={() => <Spacer x={0.5} />}
        renderItem={({ item: result, index }) => {
          return (
            <Touchable
              accessibilityRole="button"
              underlayColor="transparent"
              onPress={() => {
                tracking.trackEvent({
                  action_type: Schema.ActionTypes.TappedCollectionGroup,
                  context_module: Schema.ContextModules.FeaturedCollectionsRail,
                  context_screen_owner_type: Schema.OwnerEntityTypes.Collection,
                  context_screen_owner_id: collection.id,
                  context_screen_owner_slug: collection.slug,
                  destination_screen_owner_type: Schema.OwnerEntityTypes.Collection,
                  destination_screen_owner_id: result.id,
                  destination_screen_owner_slug: result.slug,
                  horizontal_slide_position: index + 1,
                  type: "thumbnail",
                })

                handleNavigation(result.slug)
              }}
            >
              <ImageWrapper key={index} p={2}>
                <Image
                  width={220}
                  height={190}
                  src={result?.featuredCollectionArtworks?.edges?.[0]?.node?.image?.url ?? ""}
                  blurhash={result?.featuredCollectionArtworks?.edges?.[0]?.node?.image?.blurhash}
                />
                <Text variant="sm" weight="medium" mt="15px" testID={"title-" + index}>
                  {result.title}
                </Text>
                {!!result.priceGuidance && (
                  <Text variant="sm" color={color("mono60")} mb={1} testID={"price-" + index}>
                    {"From $" + `${result.priceGuidance.toLocaleString()}`}
                  </Text>
                )}
                {handleMarkdown(result.descriptionMarkdown || "", result.title.length)}
              </ImageWrapper>
            </Touchable>
          )
        }}
      />
    </>
  ) : null
}

export const ImageWrapper = styled(Flex)`
  border: solid 1px ${themeGet("colors.mono10")};
  height: 385px;
  width: 260px;
  border-radius: 5px;
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
        featuredCollectionArtworks: artworksConnection(
          first: 1
          aggregations: [TOTAL]
          sort: "-decayed_merch"
        ) {
          edges {
            node {
              image {
                url
                blurhash
              }
            }
          }
        }
      }
    }
  `,
})
