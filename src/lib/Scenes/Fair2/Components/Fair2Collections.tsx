import { Fair2Collections_fair } from "__generated__/Fair2Collections_fair.graphql"
import { CARD_WIDTH } from "lib/Components/Home/CardRailCard"
import { CardRailFlatList } from "lib/Components/Home/CardRailFlatList"
import { navigate } from "lib/navigation/navigate"
import { compact } from "lodash"
import { Box, BoxProps, SmallCard, Text, TouchableWithScale } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

type Collection = Fair2Collections_fair["marketingCollections"][number]

interface Fair2CollectionsProps extends BoxProps {
  fair: Fair2Collections_fair
}

export const Fair2Collections: React.FC<Fair2CollectionsProps> = ({ fair, ...rest }) => {
  if (fair.marketingCollections.length === 0) {
    return null
  }

  return (
    <Box {...rest}>
      <Text mx={2} mb={2} variant="subtitle">
        Curated Highlights
      </Text>

      <CardRailFlatList<Collection>
        data={fair.marketingCollections}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item: collection }) => {
          if (!collection?.artworks?.edges) {
            return null
          }

          const images = compact(collection.artworks.edges.map((edge) => edge?.node?.image?.url))

          return (
            <TouchableWithScale
              key={collection.slug}
              onPress={() => {
                navigate(`/collection/${collection.slug}`)
              }}
            >
              <SmallCard width={CARD_WIDTH} images={images} title={collection.title} subtitle={collection.category} />
            </TouchableWithScale>
          )
        }}
      />
    </Box>
  )
}

export const Fair2CollectionsFragmentContainer = createFragmentContainer(Fair2Collections, {
  fair: graphql`
    fragment Fair2Collections_fair on Fair {
      marketingCollections(size: 4) {
        slug
        title
        category
        artworks: artworksConnection(first: 3) {
          edges {
            node {
              image {
                url(version: "larger")
              }
            }
          }
        }
      }
    }
  `,
})
