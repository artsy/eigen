import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { ArticleSectionArtworkGrid_article$key } from "__generated__/ArticleSectionArtworkGrid_article.graphql"
import { ArticleSectionArtworkGrid_section$key } from "__generated__/ArticleSectionArtworkGrid_section.graphql"
import GenericGrid from "app/Components/ArtworkGrids/GenericGrid"
import { extractNodes } from "app/utils/extractNodes"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment } from "react-relay"

interface ArticleSectionArtworkGridProps {
  article: ArticleSectionArtworkGrid_article$key
  section: ArticleSectionArtworkGrid_section$key
}

export const ArticleSectionArtworkGrid: React.FC<ArticleSectionArtworkGridProps> = ({
  article,
  section,
}) => {
  const articleData = useFragment(articleFragment, article)
  const data = useFragment(sectionFragment, section)

  const artworks = extractNodes(data.artworksConnection)

  if (!artworks.length) {
    return null
  }

  // Keep artworks legible on phones: at most 2 columns
  const numColumns = isTablet() ? data.columns : Math.min(data.columns, 2)

  return (
    <Flex px={2} my={2} testID="ArticleSectionArtworkGrid">
      <GenericGrid
        artworks={artworks}
        numColumns={numColumns}
        contextModule={ContextModule.artworkGrid}
        contextScreenOwnerType={OwnerType.article}
        contextScreenOwnerId={articleData.internalID}
        contextScreenOwnerSlug={articleData.slug ?? undefined}
      />
    </Flex>
  )
}

const articleFragment = graphql`
  fragment ArticleSectionArtworkGrid_article on Article {
    internalID
    slug
  }
`

const sectionFragment = graphql`
  fragment ArticleSectionArtworkGrid_section on ArticleSectionArtworkGrid {
    columns
    artworksConnection {
      edges {
        node {
          ...GenericGrid_artworks
        }
      }
    }
  }
`
