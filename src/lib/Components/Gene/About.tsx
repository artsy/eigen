import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import RelatedArtists from "../RelatedArtists/RelatedArtists"
import Biography from "./Biography"

import { About_gene } from "__generated__/About_gene.graphql"
import { Separator } from "palette"
import { StickyTabPageScrollView } from "../StickyTabPage/StickyTabPageScrollView"

interface Props {
  gene: About_gene
}

const About: React.FC<Props> = ({ gene }) => {
  const relatedArtists = () => {
    return (gene.trending_artists || []).length ? (
      <RelatedArtists artists={gene.trending_artists as any} />
    ) : null
  }

  return (
    <StickyTabPageScrollView contentContainerStyle={{ paddingTop: 15 }}>
      <Biography gene={gene as any} />
      <Separator mb={2} />
      {relatedArtists()}
    </StickyTabPageScrollView>
  )
}

export default createFragmentContainer(About, {
  gene: graphql`
    fragment About_gene on Gene {
      ...Biography_gene
      trending_artists: trendingArtists {
        ...RelatedArtists_artists
      }
    }
  `,
})
