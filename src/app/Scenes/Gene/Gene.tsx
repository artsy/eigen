import { FilterArtworksInput, GeneQuery } from "__generated__/GeneQuery.graphql"
import { getParamsForInputByFilterType } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import About from "app/Components/Gene/About"
import { GeneArtworksPaginationContainer } from "app/Components/Gene/GeneArtworks"
import { GenePlaceholder } from "app/Components/Gene/GenePlaceholder"
import Header from "app/Components/Gene/Header"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import React from "react"
import { Dimensions, StyleSheet, View, ViewStyle } from "react-native"
import { graphql, QueryRenderer } from "react-relay"

const isPad = Dimensions.get("window").width > 700
const commonPadding = isPad ? 40 : 20

const TABS = {
  WORKS: "Works",
  ABOUT: "About",
}

interface GeneProps {
  geneID: string
  gene: NonNullable<GeneQuery["response"]["gene"]>
}

interface GeneQueryRendererProps {
  geneID: string
  medium?: string
  price_range?: string
}

export const Gene: React.FC<GeneProps> = (props) => {
  const { gene, geneID } = props

  const headerContent = (
    <View style={styles.header}>
      <Header gene={gene} shortForm={false} />
    </View>
  )
  const tabs = [
    {
      title: TABS.WORKS,
      content: <GeneArtworksPaginationContainer gene={gene} />,
      initial: true,
    },
    {
      title: TABS.ABOUT,
      content: <About gene={gene} />,
    },
  ]

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.GenePage,
        context_screen_owner_type: Schema.OwnerEntityTypes.Gene,
        context_screen_owner_id: geneID,
        context_screen_owner_slug: gene.slug,
      }}
    >
      <View style={styles.container}>
        <StickyTabPage tabs={tabs} staticHeaderContent={headerContent} />
      </View>
    </ProvideScreenTracking>
  )
}

export const GeneQueryRenderer: React.FC<GeneQueryRendererProps> = (props) => {
  const { geneID, medium, price_range } = props
  const input = getParamsForInputByFilterType(
    {
      medium,
      priceRange: price_range,
    },
    "geneArtwork"
  ) as FilterArtworksInput

  return (
    <QueryRenderer<GeneQuery>
      environment={defaultEnvironment}
      query={graphql`
        query GeneQuery($geneID: String!, $input: FilterArtworksInput) {
          gene(id: $geneID) {
            slug
            ...Header_gene
            ...About_gene
            ...GeneArtworks_gene @arguments(input: $input)
          }
        }
      `}
      variables={{
        geneID,
        input,
      }}
      render={renderWithPlaceholder({
        Container: Gene,
        renderPlaceholder: () => <GenePlaceholder />,
        initialProps: { geneID },
      })}
    />
  )
}

interface Styles {
  container: ViewStyle
  header: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "white",
    paddingLeft: commonPadding,
    paddingRight: commonPadding,
    marginBottom: 10,
    ...(isPad
      ? {
          width: 330,
          alignSelf: "center",
        }
      : {}),
  },
})
