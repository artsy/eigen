import { useNavigation } from "@react-navigation/native"
import { OnboardingGeneQuery } from "__generated__/OnboardingGeneQuery.graphql"
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { FullScreenLoadingImage } from "app/Components/FullScreenLoadingImage"
import { Button, Flex, Screen } from "palette"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { GeneHeader, images } from "./Components/GeneHeader"
import { useOnboardingContext } from "./Hooks/useOnboardingContext"

export type OnboardingGeneId = "artists-on-the-rise" | "trove" | "our-top-auction-lots"

interface OnboardingGeneProps {
  id: OnboardingGeneId
  description: string
}

const OnboardingGene: React.FC<OnboardingGeneProps> = ({ id, description }) => {
  const { navigate } = useNavigation()
  const { onDone } = useOnboardingContext()
  const { gene } = useLazyLoadQuery<OnboardingGeneQuery>(OnboardingGeneScreenQuery, {
    id,
  })

  return (
    <Screen>
      <Screen.Background>
        <InfiniteScrollArtworksGridContainer
          shouldAddPadding
          itemComponentProps={{
            onPress: (artworkID) => navigate("ArtworkScreen", { artworkID }),
          }}
          HeaderComponent={() => <GeneHeader geneID={id} description={description} gene={gene!} />}
          FooterComponent={() => (
            <Flex p={2}>
              <Button block onPress={onDone}>
                Explore More on Artsy
              </Button>
            </Flex>
          )}
          connection={gene?.artworks!}
          hasMore={() => false}
          loadMore={() => null}
          pageSize={100}
        />
      </Screen.Background>
    </Screen>
  )
}

export const OnboardingGeneScreen: React.FC<OnboardingGeneProps> = (props) => (
  <Suspense
    fallback={
      <FullScreenLoadingImage
        imgSource={images[props.id]}
        spacerHeight="80px"
        loadingText={"Great choice" + "\n" + "We’re finding a collection for you"}
      />
    }
  >
    <OnboardingGene {...props} />
  </Suspense>
)

const OnboardingGeneScreenQuery = graphql`
  query OnboardingGeneQuery($id: String!) {
    gene(id: $id) {
      ...GeneHeaderFragment_Gene
      internalID
      artworks: filterArtworksConnection(
        first: 100
        page: 1
        sort: "-decayed_merch"
        height: "*-*"
        width: "*-*"
        priceRange: "*-*"
        marketable: true
        offerable: true
        inquireableOnly: true
        forSale: true
      ) {
        ...InfiniteScrollArtworksGrid_connection
      }
    }
  }
`
