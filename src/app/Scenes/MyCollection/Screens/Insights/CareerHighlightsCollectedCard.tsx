import { CareerHighlightsCollectedCard_myCollectionInfo$key } from "__generated__/CareerHighlightsCollectedCard_myCollectionInfo.graphql"
import { formatTombstoneText } from "app/Components/ArtistListItem"
import { EntityHeader, Flex, Text } from "palette"
import { graphql, useFragment } from "react-relay"
import { useScreenDimensions } from "shared/hooks"

interface CareerHighlightsCollectedCardProps {
  myCollectionInfo: CareerHighlightsCollectedCard_myCollectionInfo$key
}
export const CareerHighlightsCollectedCard: React.FC<CareerHighlightsCollectedCardProps> = ({
  myCollectionInfo,
}) => {
  const { width } = useScreenDimensions()

  const collectedInsights = useFragment(fragment, myCollectionInfo).collectedInsights
  if (collectedInsights.length === 0) {
    return null
  }

  return (
    <Flex px={2} width={width}>
      <Flex justifyContent="space-between" flexDirection="row">
        <Text variant="xxl" color="blue100">
          {collectedInsights.length}
        </Text>
        <Text variant="xxl" color="blue100">
          icon
        </Text>
      </Flex>
      <Text mt={1} mb={4} variant="lg">
        Artist is collected by a{"\n"}major institution.
      </Text>
      {collectedInsights.map((i) => {
        return (
          !!i.artist?.name && (
            <EntityHeader
              mb={2}
              name={i.artist.name}
              meta={
                formatTombstoneText(i.artist.nationality, i.artist.birthday, i.artist.deathday) ??
                undefined
              }
              imageUrl={i.artist.image?.url ?? undefined}
              initials={i.artist.initials ?? undefined}
              key={i.artist.id}
            />
          )
        )
      })}
    </Flex>
  )
}

const fragment = graphql`
  fragment CareerHighlightsCollectedCard_myCollectionInfo on MyCollectionInfo {
    collectedInsights: artistInsights(kind: COLLECTED) {
      artist {
        id
        slug
        name
        image {
          url
        }
        birthday
        deathday
        initials
        nationality
      }
      kind
      type
      label
      entities
    }
  }
`
