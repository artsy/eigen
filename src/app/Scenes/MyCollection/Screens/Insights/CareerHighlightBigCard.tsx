import { formatTombstoneText } from "app/Components/ArtistListItem"
import { EntityHeader, Flex, Text } from "palette"
import { useScreenDimensions } from "shared/hooks"
import { CareerHighlightKind, getCareerHiglight } from "./CareerHighlightCard"

interface CareerHighlightsCardProps {
  type: CareerHighlightKind
  highlightData: any // CareerHighlightsBiennialCard_myCollectionInfo$data
}

export const CareerHighlightBigCard: React.FC<CareerHighlightsCardProps> = ({
  type,
  highlightData,
}) => {
  const { width } = useScreenDimensions()
  const { label, Icon } = getCareerHiglight(type, highlightData.length)

  return (
    <Flex px={2} width={width} onMoveShouldSetResponderCapture={() => true}>
      <Flex justifyContent="space-between" flexDirection="row" alignItems="center">
        <Text variant="xxl" color="blue100">
          {highlightData.length}
        </Text>
        <Flex
          width={50}
          height={50}
          alignItems="center"
          justifyContent="center"
          border={1}
          borderColor="black100"
          borderRadius={25}
        >
          <Icon fill="black100" width={21} height={21} />
        </Flex>
      </Flex>
      <Text mt={1} mb={4} variant="lg">
        {label}
      </Text>
      {highlightData.map((i: any) => {
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
