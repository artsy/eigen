import { StackScreenProps } from "@react-navigation/stack"
import { ReverseImageMultipleResultsQuery } from "__generated__/ReverseImageMultipleResultsQuery.graphql"
import { ArtsyLogoIcon, BackButton, Flex } from "palette"
import { Suspense } from "react"
import { Image, StyleSheet } from "react-native"
import { graphql } from "react-relay"
import { useLazyLoadQuery } from "react-relay"
import { HeaderContainer } from "../../Components/HeaderContainer"
import { ReverseImageNavigationStack } from "../../types"
import { ReverseImageArtworksRail } from "./ReverseImageArtworksRail"

type Props = StackScreenProps<ReverseImageNavigationStack, "MultipleResults">

export const ReverseImageMultipleResults: React.FC<Props> = (props) => {
  const { route, navigation } = props
  const { artworkIDs, photoPath, owner } = route.params
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
        <BackButton color="white100" onPress={handleGoBack} />
        <Flex
          {...StyleSheet.absoluteFillObject}
          pointerEvents="none"
          justifyContent="center"
          alignItems="center"
        >
          <ArtsyLogoIcon scale={0.75} fill="white100" />
        </Flex>
      </HeaderContainer>

      <Flex flex={1}>
        <Flex my={2} flex={1} justifyContent="center" alignItems="center">
          <Image
            source={{ uri: photoPath }}
            style={{ height: "100%", aspectRatio: 1, resizeMode: "contain" }}
          />
        </Flex>

        <ReverseImageArtworksRail artworks={data.artworks!} owner={owner} />
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
