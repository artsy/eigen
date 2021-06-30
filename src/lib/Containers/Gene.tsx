import { FilterArtworksInput, GeneQuery, GeneQueryResponse } from "__generated__/GeneQuery.graphql"
import { getParamsForInputByFilterType } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { GenePlaceholder } from 'lib/Scenes/Gene/GenePlaceholder'
import { renderWithPlaceholder } from 'lib/utils/renderWithPlaceholder'
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import React from "react"
import { Dimensions, StyleSheet, View, ViewStyle } from "react-native"
import { graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import About from "../Components/Gene/About"
import Header from "../Components/Gene/Header"
import { GeneArtworksPaginationContainer } from "./GeneArtworks"

const isPad = Dimensions.get("window").width > 700
const commonPadding = isPad ? 40 : 20

const TABS = {
  WORKS: "Works",
  ABOUT: "About",
}

interface GeneProps {
  geneID: string
  medium: string
  price_range: string
  gene: NonNullable<GeneQueryResponse["gene"]>
  relay: RelayPaginationProp
}

interface GeneQueryRendererProps {
  geneID: string
  medium?: string
  price_range?: string
}

export const Gene: React.FC<GeneProps> = (props) => {
  const { gene, geneID } = props

  console.log("[gene] geneID", geneID)

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
    "categoryArtwork"
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
