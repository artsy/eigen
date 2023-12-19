import {
  Box,
  Flex,
  Screen,
  Separator,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  Tabs,
} from "@artsy/palette-mobile"
import { FilterArtworksInput, GeneQuery } from "__generated__/GeneQuery.graphql"
import { getParamsForInputByFilterType } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import About from "app/Components/Gene/About"
import { GeneArtworksPaginationContainer } from "app/Components/Gene/GeneArtworks"
import Header from "app/Components/Gene/Header"
import { goBack } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { isTablet } from "react-native-device-info"
import { graphql, QueryRenderer } from "react-relay"

const commonPadding = isTablet() ? 4 : 2

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
            {...(isTablet()
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
            <ArtworkFiltersStoreProvider>
              <GeneArtworksPaginationContainer gene={gene} />
            </ArtworkFiltersStoreProvider>
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
          gene(id: $geneID) @principalField {
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
        renderPlaceholder: () => <GeneSkeleton />,
        initialProps: { geneID },
      })}
    />
  )
}

export const GeneSkeleton: React.FC = () => {
  return (
    <Screen>
      <Screen.Header />
      <Screen.Body fullwidth>
        <Skeleton>
          <Flex px={2}>
            <SkeletonText variant="xl">Some Gene</SkeletonText>

            <Box mt={2}>
              <SkeletonBox width="100%" height={30} />
            </Box>
          </Flex>
          <Flex>
            <Spacer y={2} />

            {/* Tabs */}
            <Flex justifyContent="space-around" flexDirection="row" px={2}>
              <SkeletonText variant="xs">Works</SkeletonText>
              <SkeletonText variant="xs">About</SkeletonText>
            </Flex>

            <Separator mt={1} mb={2} />

            <Flex justifyContent="space-between" flexDirection="row" px={2}>
              <SkeletonText variant="xs">Sort and Filter</SkeletonText>
            </Flex>

            <Separator my={2} />

            <SkeletonText mx={2} variant="xs">
              Showing 57326 works
            </SkeletonText>

            <Spacer y={2} />

            <PlaceholderGrid />
          </Flex>
        </Skeleton>
      </Screen.Body>
    </Screen>
  )
}
