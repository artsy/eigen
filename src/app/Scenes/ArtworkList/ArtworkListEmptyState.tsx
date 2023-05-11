import { Button, Flex, Separator, Text } from "@artsy/palette-mobile"
import { ArtworkListEmptyState_me$key } from "__generated__/ArtworkListEmptyState_me.graphql"
import { ArtworkListHeader } from "app/Scenes/ArtworkList/ArtworkListHeader"
import { ArtworkListTitle } from "app/Scenes/ArtworkList/ArtworkListTitle"
import { navigate } from "app/system/navigation/navigate"
import { graphql, useFragment } from "react-relay"

interface ArtworkListEmptyStateProps {
  me: ArtworkListEmptyState_me$key
  title: string
}

export const ArtworkListEmptyState = ({ me, title }: ArtworkListEmptyStateProps) => {
  const fragmentData = useFragment(artworkListEmptyStateFragment, me)

  const savedArtworksCount = fragmentData.savedArtworksArtworkList?.artworksCount ?? 0
  const isDefaultArtworkList = fragmentData.artworkList?.default ?? false
  const text = getText(isDefaultArtworkList, savedArtworksCount)

  return (
    <Flex mb={1}>
      <ArtworkListHeader />
      <ArtworkListTitle title={title} />
      <Separator borderColor="black10" mt={1} />
      <Flex px={2} mt={4}>
        <Text variant="sm">{text.title}</Text>
        <Text variant="xs" color="black60">
          {text.description}
        </Text>
        <Button
          mt={2}
          variant="outline"
          size="small"
          onPress={() => navigate("/collection/trending-this-week")}
        >
          Browse Works
        </Button>
      </Flex>
    </Flex>
  )
}

const artworkListEmptyStateFragment = graphql`
  fragment ArtworkListEmptyState_me on Me @argumentDefinitions(listID: { type: "String!" }) {
    artworkList: collection(id: $listID) {
      default
    }

    savedArtworksArtworkList: collection(id: "saved-artwork") {
      artworksCount(onlyVisible: true)
    }
  }
`

const getText = (isDefaultArtworkList: boolean, savedArtworksCount: number) => {
  if (isDefaultArtworkList || savedArtworksCount === 0) {
    return {
      title: "Keep track of artworks you love",
      description: "Select the heart on an artwork to save it or add it to a list.",
    }
  }

  return {
    title: "Start curating your list of works",
    description: "Add works from Saved Artworks or add new artworks as you browse.",
  }
}
