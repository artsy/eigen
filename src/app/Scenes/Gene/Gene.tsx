import { Flex, Tabs } from "@artsy/palette-mobile"
import { FilterArtworksInput, GeneQuery } from "__generated__/GeneQuery.graphql"
import { getParamsForInputByFilterType } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import About from "app/Components/Gene/About"
import { GeneArtworksPaginationContainer } from "app/Components/Gene/GeneArtworks"
import { GenePlaceholder } from "app/Components/Gene/GenePlaceholder"
import Header from "app/Components/Gene/Header"
import { goBack } from "app/system/navigation/navigate"

import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { Dimensions } from "react-native"

import { graphql, QueryRenderer } from "react-relay"

const isPad = Dimensions.get("window").width > 700
const commonPadding = isPad ? 4 : 2

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
  const title = gene.displayName || gene.name || ""

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.GenePage,
        context_screen_owner_type: Schema.OwnerEntityTypes.Gene,
        context_screen_owner_id: geneID,
        context_screen_owner_slug: gene.slug,
      }}
    >
      <Tabs.TabsWithHeader
        title={title}
        BelowTitleHeaderComponent={() => (
          <Flex
            px={commonPadding}
            {...(isPad
              ? {
                  width: 330,
                  alignSelf: "center",
                }
              : {})}
          >
            <Header gene={gene} shortForm={false} />
          </Flex>
        )}
        headerProps={{ onBack: goBack }}
      >
        <Tabs.Tab name="Works" label="Works">
          <Tabs.Lazy>
            <GeneArtworksPaginationContainer gene={gene} />
          </Tabs.Lazy>
        </Tabs.Tab>
        <Tabs.Tab name="About" label="About">
          <Tabs.Lazy>
            <About gene={gene} />
          </Tabs.Lazy>
        </Tabs.Tab>
      </Tabs.TabsWithHeader>
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
      environment={getRelayEnvironment()}
      query={graphql`
        query GeneQuery($geneID: String!, $input: FilterArtworksInput) {
          gene(id: $geneID) {
            displayName
            name
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
