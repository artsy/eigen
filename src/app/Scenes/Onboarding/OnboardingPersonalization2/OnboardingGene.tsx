import { useNavigation } from "@react-navigation/native"
import { OnboardingGeneQuery } from "__generated__/OnboardingGeneQuery.graphql"
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { FullScreenLoadingImage } from "app/Components/FullScreenLoadingImage"
import { Button, Flex, FollowButton, Screen, Spacer, Text } from "palette"
import { Suspense } from "react"
import { ImageBackground, ImageSourcePropType } from "react-native"
import { graphql, useLazyLoadQuery, useMutation } from "react-relay"
import { AnimatedTooltip } from "./Components/AnimatedTooltip"
import { useOnboardingContext } from "./Hooks/useOnboardingContext"

type OnboardingGeneId = "artists-on-the-rise" | "trove" | "our-top-auction-lots"

interface OnboardingGeneProps {
  id: OnboardingGeneId
  description: string
}

const images: Record<OnboardingGeneId, ImageSourcePropType> = {
  "artists-on-the-rise": require("images/CohnMakeAMountain.webp"),
  trove: require("images/HirstTheWonder.webp"),
  "our-top-auction-lots": require("images/HirstTheWonder.webp"),
}

const OnboardingGene: React.FC<OnboardingGeneProps> = ({ id, description }) => {
  const { navigate } = useNavigation()
  const { onDone } = useOnboardingContext()
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
      <Screen.Background>
        <InfiniteScrollArtworksGridContainer
          shouldAddPadding
          itemComponentProps={{
            onPress: (artworkID) => navigate("ArtworkScreen", { artworkID }),
          }}
          HeaderComponent={() => (
            <Flex pb={2}>
              <ImageBackground style={{ height: 270 }} resizeMode="cover" source={images[id]}>
                <Flex pt={6} px={2}>
                  <Text variant="xl" color="white100">
                    {gene?.name}
                  </Text>
                  <Spacer mt={2} />
                  <Text variant="sm" color="white100">
                    {description}
                  </Text>
                  <Spacer mt={2} />
                  <FollowButton
                    isFollowed={!!gene?.isFollowed}
                    onPress={handleFollowGene}
                    loading={isInFlight}
                    disabled={isInFlight}
                  />
                </Flex>
              </ImageBackground>
              <AnimatedTooltip />
            </Flex>
          )}
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
