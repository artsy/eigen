import { ArtsyLogoBlackIcon } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { ReverseImageMultipleResultsQuery } from "__generated__/ReverseImageMultipleResultsQuery.graphql"
import { HeaderBackButton } from "app/Scenes/ReverseImage/Components/HeaderBackButton"
import { HeaderContainer } from "app/Scenes/ReverseImage/Components/HeaderContainer"
import { ReverseImageNavigationStack } from "app/Scenes/ReverseImage/types"
import { Flex } from "palette"
import { Suspense } from "react"
import { Image, StyleSheet } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ReverseImageArtworksRail } from "./ReverseImageArtworksRail"

type Props = StackScreenProps<ReverseImageNavigationStack, "MultipleResults">

export const ReverseImageMultipleResults: React.FC<Props> = (props) => {
  const { route, navigation } = props
  const { artworkIDs, photoPath } = route.params
  const data = useLazyLoadQuery<ReverseImageMultipleResultsQuery>(
    reverseImageMultipleResultsQuery,
    {
      artworkIDs,
    }
  )

  const handleGoBack = () => {
    navigation.goBack()
  }

  return (
    <Flex bg="black100" flex={1}>
      <HeaderContainer>
        <HeaderBackButton onPress={handleGoBack} />
        <Flex
          {...StyleSheet.absoluteFillObject}
          pointerEvents="none"
          justifyContent="center"
          alignItems="center"
        >
          <ArtsyLogoBlackIcon scale={0.75} fill="white100" />
        </Flex>
      </HeaderContainer>

      <Flex flex={1}>
        <Flex my={2} flex={1} justifyContent="center" alignItems="center">
          <Image
            source={{ uri: photoPath }}
            style={{ height: "100%", aspectRatio: 1, resizeMode: "contain" }}
          />
        </Flex>

        <ReverseImageArtworksRail artworks={data.artworks!} />
      </Flex>
    </Flex>
  )
}

export const ReverseImageMultipleResultsScreen: React.FC<Props> = (props) => {
  return (
    <Suspense fallback={null}>
      <ReverseImageMultipleResults {...props} />
    </Suspense>
  )
}

const reverseImageMultipleResultsQuery = graphql`
  query ReverseImageMultipleResultsQuery($artworkIDs: [String]) {
    artworks(ids: $artworkIDs) {
      ...ReverseImageArtworksRail
    }
  }
`
