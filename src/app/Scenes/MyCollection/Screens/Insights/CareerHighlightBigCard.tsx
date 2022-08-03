import { CareerHighlightBigCardBiennial_myCollectionInfo$key } from "__generated__/CareerHighlightBigCardBiennial_myCollectionInfo.graphql"
import { CareerHighlightBigCardCollected_myCollectionInfo$key } from "__generated__/CareerHighlightBigCardCollected_myCollectionInfo.graphql"
import { CareerHighlightBigCardGroupShow_myCollectionInfo$key } from "__generated__/CareerHighlightBigCardGroupShow_myCollectionInfo.graphql"
import { CareerHighlightBigCardReviewed_myCollectionInfo$key } from "__generated__/CareerHighlightBigCardReviewed_myCollectionInfo.graphql"
import { CareerHighlightBigCardSoloShow_myCollectionInfo$key } from "__generated__/CareerHighlightBigCardSoloShow_myCollectionInfo.graphql"
import { formatTombstoneText } from "app/Components/ArtistListItem"
import { EntityHeader, Flex, IconProps, Text } from "palette"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { useScreenDimensions } from "shared/hooks"
import { CareerHighlightKind, getCareerHiglight } from "./CareerHighlightCard"

const CardHeader: React.FC<{
  count: number
  label: string
  icon: React.ReactElement<IconProps>
}> = ({ count, label, icon }) => {
  return (
    <>
      <Flex justifyContent="space-between" flexDirection="row" alignItems="center">
        <Text variant="xxl" color="blue100">
          {count}
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
          {icon}
        </Flex>
      </Flex>
      <Text mt={1} mb={4} variant="lg">
        {label}
      </Text>
    </>
  )
}

interface CareerHighlightBigCardBiennialProps {
  type: CareerHighlightKind
  highlightData: CareerHighlightBigCardBiennial_myCollectionInfo$key
}

export const CareerHighlightBigCardBiennial: React.FC<CareerHighlightBigCardBiennialProps> = ({
  type,
  highlightData,
}) => {
  const { width } = useScreenDimensions()
  const highlightDataBiennial = useFragment(fragmentBiennial, highlightData).biennialInsights
  const count = highlightDataBiennial.length
  const { label, Icon } = getCareerHiglight(type, count)

  return (
    <Flex px={2} width={width} onMoveShouldSetResponderCapture={() => true}>
      <CardHeader
        count={count}
        label={label}
        icon={<Icon fill="black100" width={21} height={21} />}
      />
      {highlightDataBiennial.map((i: any) => {
        return (
          !!i.artist && (
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

const fragmentBiennial = graphql`
  fragment CareerHighlightBigCardBiennial_myCollectionInfo on MyCollectionInfo {
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
      label
      entities
    }
  }
`

interface CareerHighlightBigCardCollectedProps {
  type: CareerHighlightKind
  highlightData: CareerHighlightBigCardCollected_myCollectionInfo$key
}

export const CareerHighlightBigCardCollected: React.FC<CareerHighlightBigCardCollectedProps> = ({
  type,
  highlightData,
}) => {
  const { width } = useScreenDimensions()
  const highlightDataCollected = useFragment(fragmentCollected, highlightData).collectedInsights
  const count = highlightDataCollected.length
  const { label, Icon } = getCareerHiglight(type, count)

  return (
    <Flex px={2} width={width} onMoveShouldSetResponderCapture={() => true}>
      <CardHeader
        count={count}
        label={label}
        icon={<Icon fill="black100" width={21} height={21} />}
      />
      {highlightDataCollected.map((i: any) => {
        return (
          !!i.artist && (
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
const fragmentCollected = graphql`
  fragment CareerHighlightBigCardCollected_myCollectionInfo on MyCollectionInfo {
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
      label
      entities
    }
  }
`

interface CareerHighlightBigCardGroupShowProps {
  type: CareerHighlightKind
  highlightData: CareerHighlightBigCardGroupShow_myCollectionInfo$key
}

export const CareerHighlightBigCardGroupShow: React.FC<CareerHighlightBigCardGroupShowProps> = ({
  type,
  highlightData,
}) => {
  const { width } = useScreenDimensions()
  const highlightDataGroupShow = useFragment(fragmentGroupShow, highlightData).groupShowInsights
  const count = highlightDataGroupShow.length
  const { label, Icon } = getCareerHiglight(type, count)

  return (
    <Flex px={2} width={width} onMoveShouldSetResponderCapture={() => true}>
      <CardHeader
        count={count}
        label={label}
        icon={<Icon fill="black100" width={21} height={21} />}
      />
      {highlightDataGroupShow.map((i: any) => {
        return (
          !!i.artist && (
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
const fragmentGroupShow = graphql`
  fragment CareerHighlightBigCardGroupShow_myCollectionInfo on MyCollectionInfo {
    groupShowInsights: artistInsights(kind: GROUP_SHOW) {
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
      label
      entities
    }
  }
`

interface CareerHighlightBigCardSoloShowProps {
  type: CareerHighlightKind
  highlightData: CareerHighlightBigCardSoloShow_myCollectionInfo$key
}

export const CareerHighlightBigCardSoloShow: React.FC<CareerHighlightBigCardSoloShowProps> = ({
  type,
  highlightData,
}) => {
  const { width } = useScreenDimensions()
  const highlightDataSoloShow = useFragment(fragmentSoloShow, highlightData).soloShowInsights
  const count = highlightDataSoloShow.length
  const { label, Icon } = getCareerHiglight(type, count)

  return (
    <Flex px={2} width={width} onMoveShouldSetResponderCapture={() => true}>
      <CardHeader
        count={count}
        label={label}
        icon={<Icon fill="black100" width={21} height={21} />}
      />
      {highlightDataSoloShow.map((i: any) => {
        return (
          !!i.artist && (
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

const fragmentSoloShow = graphql`
  fragment CareerHighlightBigCardSoloShow_myCollectionInfo on MyCollectionInfo {
    soloShowInsights: artistInsights(kind: SOLO_SHOW) {
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
      label
      entities
    }
  }
`

interface CareerHighlightBigCardReviewedProps {
  type: CareerHighlightKind
  highlightData: CareerHighlightBigCardReviewed_myCollectionInfo$key
}

export const CareerHighlightBigCardReviewed: React.FC<CareerHighlightBigCardReviewedProps> = ({
  type,
  highlightData,
}) => {
  const { width } = useScreenDimensions()
  const highlightDataReviewed = useFragment(fragmentReviewed, highlightData).reviewedInsights
  const count = highlightDataReviewed.length
  const { label, Icon } = getCareerHiglight(type, count)

  return (
    <Flex px={2} width={width} onMoveShouldSetResponderCapture={() => true}>
      <CardHeader
        count={count}
        label={label}
        icon={<Icon fill="black100" width={21} height={21} />}
      />
      {highlightDataReviewed.map((i: any) => {
        return (
          !!i.artist && (
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

const fragmentReviewed = graphql`
  fragment CareerHighlightBigCardReviewed_myCollectionInfo on MyCollectionInfo {
    reviewedInsights: artistInsights(kind: REVIEWED) {
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
      label
      entities
    }
  }
`
