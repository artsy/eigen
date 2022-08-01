import { OnboardingGeneQuery } from "__generated__/OnboardingGeneQuery.graphql"
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { FollowButton, Screen, Text } from "palette"
import { Suspense } from "react"
import { ImageBackground } from "react-native"
import { graphql, useLazyLoadQuery, useMutation } from "react-relay"

type OnboardingGeneId = "artists-on-the-rise" | "trove" | "our-top-auction-lots"

interface OnboardingGeneProps {
  id: OnboardingGeneId
  description: string
}

const images = {
  "artists-on-the-rise": require("images/CohnMakeAMountain.webp"),
  trove: require("images/HirstTheWonder.webp"),
  "our-top-auction-lots": require("images/HirstTheWonder.webp"),
}

const OnboardingGene: React.FC<OnboardingGeneProps> = ({ id, description }) => {
  const { gene } = useLazyLoadQuery<OnboardingGeneQuery>(OnboardingGeneScreenQuery, {
    id,
  })

  const [commit, isInFlight] = useMutation(FollowGeneMutation)

  const handleFollowGene = () => {
    commit({
      variables: {
        input: {
          id: gene?.id,
          unfollow: gene?.isFollowed,
        },
      },
    })
  }

  return (
    <Screen>
      <Screen.Body>
        <ImageBackground
          style={{ height: 270, width: "100%" }}
          resizeMode="center"
          source={images[id]}
        >
          <Text variant="xl" color="white100">
            {gene?.name}
          </Text>
          <Text variant="sm" color="white100">
            {description}
          </Text>
          <FollowButton
            isFollowed={!!gene?.isFollowed}
            onPress={handleFollowGene}
            loading={isInFlight}
            disabled={isInFlight}
          />
        </ImageBackground>
        <InfiniteScrollArtworksGridContainer
          connection={gene?.artworks!}
          hasMore={() => false}
          loadMore={() => null}
          pageSize={100}
        />
      </Screen.Body>
    </Screen>
  )
}

export const OnboardingGeneScreen: React.FC<OnboardingGeneProps> = (props) => (
  <Suspense
    fallback={
      <Text variant="xl" color="black100">
        Loading..
      </Text>
    }
  >
    <OnboardingGene {...props} />
  </Suspense>
)

const OnboardingGeneScreenQuery = graphql`
  query OnboardingGeneQuery($id: String!) {
    gene(id: $id) {
      name
      isFollowed
      id
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

const FollowGeneMutation = graphql`
  mutation OnboardingGeneFollowMutation($input: FollowGeneInput!) {
    followGene(input: $input) {
      gene {
        id
        isFollowed
      }
    }
  }
`
