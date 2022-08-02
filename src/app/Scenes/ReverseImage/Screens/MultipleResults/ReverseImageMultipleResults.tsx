import { ReverseImageMultipleResultsQuery } from "__generated__/ReverseImageMultipleResultsQuery.graphql"
import { goBack } from "app/navigation/navigate"
import { ArtsyLogoIcon, BackButton, Flex } from "palette"
import { Suspense } from "react"
import { StyleSheet } from "react-native"
import { graphql } from "react-relay"
import { useLazyLoadQuery } from "react-relay"
import { HeaderContainer } from "../../Components/HeaderContainer"
import { ReverseImageArtworksRail } from "./ReverseImageArtworksRail"

interface ReverseImageMultipleResultsProps {
  artworkIDs: string[]
}

export const ReverseImageMultipleResults: React.FC<ReverseImageMultipleResultsProps> = (props) => {
  const { artworkIDs } = props
  const data = useLazyLoadQuery<ReverseImageMultipleResultsQuery>(
    reverseImageMultipleResultsQuery,
    {
      artworkIDs,
    }
  )

  return (
    <Flex bg="black100" flex={1}>
      <HeaderContainer>
        <BackButton color="white100" onPress={() => goBack()} />
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

export const ReverseImageMultipleResultsQueryRenderer: React.FC<
  ReverseImageMultipleResultsProps
> = (props) => {
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
