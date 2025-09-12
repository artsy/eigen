import { Box, Button, Flex, Separator, Text } from "@artsy/palette-mobile"
import { ArtworkListEmptyState_me$key } from "__generated__/ArtworkListEmptyState_me.graphql"
import { ArtworkListHeader } from "app/Scenes/ArtworkList/ArtworkListHeader"
import { ArtworkListTitle } from "app/Scenes/ArtworkList/ArtworkListTitle"
import { RouterLink } from "app/system/navigation/RouterLink"
import { ScrollView } from "react-native"
import { graphql, useFragment } from "react-relay"

interface ArtworkListEmptyStateProps {
  me: ArtworkListEmptyState_me$key | null | undefined
  refreshControl: React.JSX.Element
}

export const ArtworkListEmptyState = ({ me, refreshControl }: ArtworkListEmptyStateProps) => {
  const data = useFragment(artworkListEmptyStateFragment, me)

  const artworkList = data?.artworkList
  const isDefaultArtworkList = artworkList?.default ?? false
  const text = getText(isDefaultArtworkList)

  return (
    <Flex flex={1} mb={1}>
      <ArtworkListHeader me={data} />

      <ScrollView style={{ flex: 1 }} refreshControl={refreshControl}>
        <ArtworkListTitle
          title={artworkList?.name ?? ""}
          shareableWithPartners={artworkList?.shareableWithPartners ?? false}
        />

        <Separator borderColor="mono10" mt={1} />

        <Flex px={2} mt={4}>
          <Text variant="sm">{text.title}</Text>

          <Text variant="xs" color="mono60">
            {text.description}
          </Text>

          <Box mt={2}>
            <RouterLink to="/collection/trending-this-week" hasChildTouchable>
              <Button variant="outline" size="small">
                Browse Works
              </Button>
            </RouterLink>
          </Box>
        </Flex>
      </ScrollView>
    </Flex>
  )
}

const artworkListEmptyStateFragment = graphql`
  fragment ArtworkListEmptyState_me on Me @argumentDefinitions(listID: { type: "String!" }) {
    artworkList: collection(id: $listID) {
      default
      name
      internalID
      shareableWithPartners
    }
    ...ArtworkListHeader_me @arguments(listID: $listID)
  }
`

const getText = (isDefaultArtworkList: boolean) => {
  if (isDefaultArtworkList) {
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
