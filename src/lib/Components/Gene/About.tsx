import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { StyleSheet, ViewStyle } from "react-native"

import Biography from "./Biography"

import RelatedArtists from "../RelatedArtists/RelatedArtists"
import Separator from "../Separator"

import { About_gene } from "__generated__/About_gene.graphql"
import { StickyTabPageScrollView } from "../StickyTabPage/StickyTabPageScrollView"

interface Props {
  gene: About_gene
}

const About: React.FC<Props> = ({ gene }) => {
  const relatedArtists = () => {
    return (gene.trending_artists || []).length ? <RelatedArtists artists={gene.trending_artists as any} /> : null
  }

  const biography = () => {
    return (
      <>
        <Biography gene={gene as any} style={styles.sectionSeparator} />
        <Separator style={styles.sectionSeparator} />
      </>
    )
  }

  return (
    <StickyTabPageScrollView contentContainerStyle={{ paddingTop: 15 }}>
      {biography()}
      {relatedArtists()}
    </StickyTabPageScrollView>
  )
}

interface Styles {
  sectionSeparator: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  sectionSeparator: {
    marginBottom: 20,
  },
})

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
