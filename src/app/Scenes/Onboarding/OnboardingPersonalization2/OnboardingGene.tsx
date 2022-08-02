import { OnboardingGeneQuery } from "__generated__/OnboardingGeneQuery.graphql"
import { InfiniteScrollArtworksGridContainer } from "app/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { FullScreenLoadingImage } from "app/Components/FullScreenLoadingImage"
import { Button, Flex, FollowButton, Screen, Spacer, Text, useSpace } from "palette"
import { Suspense, useEffect, useRef, useState } from "react"
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native"
import { graphql, useLazyLoadQuery, useMutation } from "react-relay"
import { useScreenDimensions } from "shared/hooks"

type OnboardingGeneId = "artists-on-the-rise" | "trove" | "our-top-auction-lots"

interface OnboardingGeneProps {
  id: OnboardingGeneId
  description: string
}

const AnimatedFlex = Animated.createAnimatedComponent(Flex)

const images: Record<OnboardingGeneId, ImageSourcePropType> = {
  "artists-on-the-rise": require("images/CohnMakeAMountain.webp"),
  trove: require("images/HirstTheWonder.webp"),
  "our-top-auction-lots": require("images/HirstTheWonder.webp"),
}

const OnboardingGene: React.FC<OnboardingGeneProps> = ({ id, description }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(true)
  const space = useSpace()
  const { width } = useScreenDimensions()
  const leftPosition = useRef(new Animated.Value(0)).current
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

  const moveToRightAnimation = () => {
    Animated.timing(leftPosition, {
      delay: 500,
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.linear),
      useNativeDriver: true,
    }).start()
  }

  useEffect(() => {
    moveToRightAnimation()
  }, [])

  const xVal = leftPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, 0],
  })

  return (
    <Screen>
      <Screen.Background>
        <InfiniteScrollArtworksGridContainer
          shouldAddPadding
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
              {!!isTooltipVisible && (
                <AnimatedFlex
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  py={1}
                  px={2}
                  backgroundColor="black100"
                  style={{
                    transform: [
                      {
                        translateX: xVal,
                      },
                    ],
                  }}
                >
                  <Text variant="xs" color="white100">
                    Find your Saves and Follows in your settings.
                  </Text>
                  <TouchableOpacity
                    style={{ position: "absolute", top: space(1), right: space(2) }}
                    hitSlop={{ bottom: 40, right: 40, left: 40, top: 40 }}
                    onPress={() => setIsTooltipVisible(false)}
                  >
                    <Image source={require("images/close-x.webp")} />
                  </TouchableOpacity>
                </AnimatedFlex>
              )}
            </Flex>
          )}
          FooterComponent={() => (
            <Flex p={2}>
              <Button block onPress={() => console.warn("test")}>
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
