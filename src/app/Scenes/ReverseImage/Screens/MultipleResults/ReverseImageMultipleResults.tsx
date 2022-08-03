import { StackScreenProps } from "@react-navigation/stack"
import { ReverseImageMultipleResultsQuery } from "__generated__/ReverseImageMultipleResultsQuery.graphql"
import { ArtsyLogoIcon, BackButton, Flex } from "palette"
import { Suspense } from "react"
import { StyleSheet } from "react-native"
import { graphql } from "react-relay"
import { useLazyLoadQuery } from "react-relay"
import { HeaderContainer } from "../../Components/HeaderContainer"
import { ReverseImageNavigationStack } from "../../types"
import { ReverseImageArtworksRail } from "./ReverseImageArtworksRail"

type Props = StackScreenProps<ReverseImageNavigationStack, "MultipleResults">

export const ReverseImageMultipleResults: React.FC<Props> = (props) => {
  const { route, navigation } = props
  const { artworkIDs } = route.params
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
        {/** Display image preview */}
        <Flex width={90} height={140} bg="black5" my={2} alignSelf="center" />

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
