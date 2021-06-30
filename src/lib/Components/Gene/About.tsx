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
  const artists = gene.trending_artists
  const relatedArtists = Array.isArray(artists) && artists.length > 0 ? <RelatedArtists artists={artists} /> : null

  return (
    <StickyTabPageScrollView contentContainerStyle={styles.contentContainer}>
      {!!gene && <Biography gene={gene} />}
      <Separator style={styles.sectionSeparator} />
      {relatedArtists}
    </StickyTabPageScrollView>
  )
}

interface Styles {
  sectionSeparator: ViewStyle
  contentContainer: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  sectionSeparator: {
    marginBottom: 20,
  },
  contentContainer: {
    paddingTop: 15,
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
