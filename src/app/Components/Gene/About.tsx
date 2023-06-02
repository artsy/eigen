import { Separator, Tabs, useSpace } from "@artsy/palette-mobile"
import { About_gene$data } from "__generated__/About_gene.graphql"
import RelatedArtists from "app/Components/RelatedArtists/RelatedArtists"

import { createFragmentContainer, graphql } from "react-relay"
import Biography from "./Biography"

interface Props {
  gene: About_gene$data
}

const About: React.FC<Props> = ({ gene }) => {
  const space = useSpace()
  const relatedArtists = () => {
    return (gene.trending_artists || []).length ? (
      <RelatedArtists artists={gene.trending_artists as any} />
    ) : null
  }

  return (
    <Tabs.ScrollView contentContainerStyle={{ paddingTop: space(2), paddingHorizontal: space(2) }}>
      <Biography gene={gene as any} />
      <Separator mb={2} />
      {relatedArtists()}
    </Tabs.ScrollView>
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
