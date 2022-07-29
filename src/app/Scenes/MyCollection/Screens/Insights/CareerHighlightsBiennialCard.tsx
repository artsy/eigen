import { CareerHighlightsBiennialCard_myCollectionInfo$key } from "__generated__/CareerHighlightsBiennialCard_myCollectionInfo.graphql"
import { formatTombstoneText } from "app/Components/ArtistListItem"
import { EntityHeader, Flex, Text } from "palette"
import { graphql, useFragment } from "react-relay"
import { useScreenDimensions } from "shared/hooks"

interface CareerHighlightsBiennialCardProps {
  myCollectionInfo: CareerHighlightsBiennialCard_myCollectionInfo$key
}

export const CareerHighlightsBiennialCard: React.FC<CareerHighlightsBiennialCardProps> = ({
  myCollectionInfo,
}) => {
  const { width } = useScreenDimensions()
  const biennialInsights = useFragment(fragment, myCollectionInfo).biennialInsights
  if (!biennialInsights) {
    return null
  }

  return (
    <Flex px={2} width={width}>
      <Flex justifyContent="space-between" flexDirection="row">
        <Text mt={4} variant="xxl" color="blue100">
          {biennialInsights.length}
        </Text>
        <Text mt={4} variant="xxl" color="blue100">
          icon
        </Text>
      </Flex>
      <Text mt={1} mb={4} variant="lg">
        Artists were included in{"\n"}major biennials.
      </Text>
      {biennialInsights.map((i) => {
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
  fragment CareerHighlightsBiennialCard_myCollectionInfo on MyCollectionInfo {
    biennialInsights: artistInsights(kind: BIENNIAL) {
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
