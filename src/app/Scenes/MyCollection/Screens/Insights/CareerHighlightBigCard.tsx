import { IconProps } from "@artsy/icons/native"
import { Flex, useSpace, Text, EntityHeader } from "@artsy/palette-mobile"
import {
  CareerHighlightBigCardBiennial_myCollectionInfo$data,
  CareerHighlightBigCardBiennial_myCollectionInfo$key,
} from "__generated__/CareerHighlightBigCardBiennial_myCollectionInfo.graphql"
import {
  CareerHighlightBigCardCollected_myCollectionInfo$data,
  CareerHighlightBigCardCollected_myCollectionInfo$key,
} from "__generated__/CareerHighlightBigCardCollected_myCollectionInfo.graphql"
import {
  CareerHighlightBigCardGroupShow_myCollectionInfo$data,
  CareerHighlightBigCardGroupShow_myCollectionInfo$key,
} from "__generated__/CareerHighlightBigCardGroupShow_myCollectionInfo.graphql"
import {
  CareerHighlightBigCardReviewed_myCollectionInfo$data,
  CareerHighlightBigCardReviewed_myCollectionInfo$key,
} from "__generated__/CareerHighlightBigCardReviewed_myCollectionInfo.graphql"
import {
  CareerHighlightBigCardSoloShow_myCollectionInfo$data,
  CareerHighlightBigCardSoloShow_myCollectionInfo$key,
} from "__generated__/CareerHighlightBigCardSoloShow_myCollectionInfo.graphql"
import { formatTombstoneText } from "app/Components/ArtistListItem"
import { useScreenDimensions } from "app/utils/hooks"
import { useState } from "react"
import { FlatList, LayoutChangeEvent, View } from "react-native"
import { useFragment, graphql } from "react-relay"
import { CareerHighlightKind, getCareerHiglight } from "./CareerHighlightCard"

const CardHeader: React.FC<{
  count: number
  label: string
  icon: React.ReactElement<IconProps>
  onLayout?: ((event: LayoutChangeEvent) => void) | undefined
}> = ({ count, label, icon, onLayout }) => {
  return (
    <Flex onLayout={onLayout}>
      <Flex justifyContent="space-between" flexDirection="row" alignItems="center">
        <Text variant="xl" color="blue100">
          {count}
        </Text>
        <Flex
          width={50}
          height={50}
          alignItems="center"
          justifyContent="center"
          border={1}
          borderColor="mono100"
          borderRadius={25}
        >
          {icon}
        </Flex>
      </Flex>
      <Text mt={1} mb={4} variant="lg-display">
        {label}
      </Text>
    </Flex>
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
  const space = useSpace()
  const highlightDataBiennial = useFragment(fragmentBiennial, highlightData).biennialInsights
  const count = highlightDataBiennial.length
  const { label, Icon } = getCareerHiglight(type, count)
  const [headerHeight, setHeaderHeight] = useState<number>(0)

  return (
    <View style={{ paddingHorizontal: space(2), width }} testID="biennial-card">
      <CardHeader
        count={count}
        label={label}
        icon={<Icon fill="mono100" width={24} height={24} />}
        onLayout={(event: LayoutChangeEvent) => {
          const layout = event.nativeEvent.layout
          setHeaderHeight(layout.height)
        }}
      />
      <FlatList
        key={type}
        bounces={false}
        showsVerticalScrollIndicator={false}
        data={highlightDataBiennial}
        keyExtractor={(_item, index) => `${type}_${index}`}
        contentContainerStyle={{ paddingBottom: headerHeight }}
        renderItem={({
          item,
        }: {
          item: NonNullable<
            NonNullable<CareerHighlightBigCardBiennial_myCollectionInfo$data["biennialInsights"]>[0]
          >
        }) => {
          return (
            <EntityHeader
              mb={2}
              name={item?.artist?.name ?? ""}
              meta={
                formatTombstoneText(
                  item?.artist?.nationality,
                  item?.artist?.birthday,
                  item?.artist?.deathday
                ) ?? undefined
              }
              imageUrl={item?.artist?.image?.url ?? undefined}
              initials={item?.artist?.initials ?? undefined}
              key={`${item?.artist?.id}_${type}`}
            />
          )
        }}
        onEndReachedThreshold={1}
      />
    </View>
  )
}

const fragmentBiennial = graphql`
  fragment CareerHighlightBigCardBiennial_myCollectionInfo on MyCollectionInfo {
    biennialInsights: artistInsights(kind: BIENNIAL) {
      artist {
        id
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
  const space = useSpace()
  const highlightDataCollected = useFragment(fragmentCollected, highlightData).collectedInsights
  const count = highlightDataCollected.length
  const { label, Icon } = getCareerHiglight(type, count)
  const [headerHeight, setHeaderHeight] = useState<number>(0)

  return (
    <View style={{ paddingHorizontal: space(2), width }} testID="collected-card">
      <CardHeader
        count={count}
        label={label}
        icon={<Icon fill="mono100" width={24} height={24} />}
        onLayout={(event: LayoutChangeEvent) => {
          const layout = event.nativeEvent.layout
          setHeaderHeight(layout.height)
        }}
      />
      <FlatList
        key={type}
        bounces={false}
        showsVerticalScrollIndicator={false}
        data={highlightDataCollected}
        keyExtractor={(_item, index) => `${type}_${index}`}
        contentContainerStyle={{ paddingBottom: headerHeight }}
        renderItem={({
          item,
        }: {
          item: NonNullable<
            NonNullable<
              CareerHighlightBigCardCollected_myCollectionInfo$data["collectedInsights"]
            >[0]
          >
        }) => {
          return (
            <EntityHeader
              mb={2}
              name={item?.artist?.name ?? ""}
              meta={
                formatTombstoneText(
                  item?.artist?.nationality,
                  item?.artist?.birthday,
                  item?.artist?.deathday
                ) ?? undefined
              }
              imageUrl={item?.artist?.image?.url ?? undefined}
              initials={item?.artist?.initials ?? undefined}
              key={`${item?.artist?.id}_${type}`}
            />
          )
        }}
        onEndReachedThreshold={1}
      />
    </View>
  )
}
const fragmentCollected = graphql`
  fragment CareerHighlightBigCardCollected_myCollectionInfo on MyCollectionInfo {
    collectedInsights: artistInsights(kind: COLLECTED) {
      artist {
        id
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
  const space = useSpace()
  const highlightDataGroupShow = useFragment(fragmentGroupShow, highlightData).groupShowInsights
  const count = highlightDataGroupShow.length
  const { label, Icon } = getCareerHiglight(type, count)
  const [headerHeight, setHeaderHeight] = useState<number>(0)

  return (
    <View style={{ paddingHorizontal: space(2), width }} testID="group-show-card">
      <CardHeader
        count={count}
        label={label}
        icon={<Icon fill="mono100" width={24} height={24} />}
        onLayout={(event: LayoutChangeEvent) => {
          const layout = event.nativeEvent.layout
          setHeaderHeight(layout.height)
        }}
      />
      <FlatList
        key={type}
        bounces={false}
        showsVerticalScrollIndicator={false}
        data={highlightDataGroupShow}
        keyExtractor={(_item, index) => `${type}_${index}`}
        contentContainerStyle={{ paddingBottom: headerHeight }}
        renderItem={({
          item,
        }: {
          item: NonNullable<
            NonNullable<
              CareerHighlightBigCardGroupShow_myCollectionInfo$data["groupShowInsights"]
            >[0]
          >
        }) => {
          return (
            <EntityHeader
              mb={2}
              name={item?.artist?.name ?? ""}
              meta={
                formatTombstoneText(
                  item?.artist?.nationality,
                  item?.artist?.birthday,
                  item?.artist?.deathday
                ) ?? undefined
              }
              imageUrl={item?.artist?.image?.url ?? undefined}
              initials={item?.artist?.initials ?? undefined}
              key={`${item?.artist?.id}_${type}`}
            />
          )
        }}
        onEndReachedThreshold={1}
      />
    </View>
  )
}
const fragmentGroupShow = graphql`
  fragment CareerHighlightBigCardGroupShow_myCollectionInfo on MyCollectionInfo {
    groupShowInsights: artistInsights(kind: GROUP_SHOW) {
      artist {
        id
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
  const space = useSpace()
  const highlightDataSoloShow = useFragment(fragmentSoloShow, highlightData).soloShowInsights
  const count = highlightDataSoloShow.length
  const { label, Icon } = getCareerHiglight(type, count)
  const [headerHeight, setHeaderHeight] = useState<number>(0)

  return (
    <View style={{ paddingHorizontal: space(2), width }} testID="solo-show-card">
      <CardHeader
        count={count}
        label={label}
        icon={<Icon fill="mono100" width={24} height={24} />}
        onLayout={(event: LayoutChangeEvent) => {
          const layout = event.nativeEvent.layout
          setHeaderHeight(layout.height)
        }}
      />
      <FlatList
        key={type}
        bounces={false}
        showsVerticalScrollIndicator={false}
        data={highlightDataSoloShow}
        keyExtractor={(_item, index) => `${type}_${index}`}
        contentContainerStyle={{ paddingBottom: headerHeight }}
        renderItem={({
          item,
        }: {
          item: NonNullable<
            NonNullable<CareerHighlightBigCardSoloShow_myCollectionInfo$data["soloShowInsights"]>[0]
          >
        }) => {
          return (
            <EntityHeader
              mb={2}
              name={item?.artist?.name ?? ""}
              meta={
                formatTombstoneText(
                  item?.artist?.nationality,
                  item?.artist?.birthday,
                  item?.artist?.deathday
                ) ?? undefined
              }
              imageUrl={item?.artist?.image?.url ?? undefined}
              initials={item?.artist?.initials ?? undefined}
              key={`${item?.artist?.id}_${type}`}
            />
          )
        }}
        onEndReachedThreshold={1}
      />
    </View>
  )
}

const fragmentSoloShow = graphql`
  fragment CareerHighlightBigCardSoloShow_myCollectionInfo on MyCollectionInfo {
    soloShowInsights: artistInsights(kind: SOLO_SHOW) {
      artist {
        id
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
  const space = useSpace()
  const highlightDataReviewed = useFragment(fragmentReviewed, highlightData).reviewedInsights
  const count = highlightDataReviewed.length
  const { label, Icon } = getCareerHiglight(type, count)
  const [headerHeight, setHeaderHeight] = useState<number>(0)

  return (
    <View style={{ paddingHorizontal: space(2), width }} testID="reviewed-card">
      <CardHeader
        count={count}
        label={label}
        icon={<Icon fill="mono100" width={24} height={24} />}
        onLayout={(event: LayoutChangeEvent) => {
          const layout = event.nativeEvent.layout
          setHeaderHeight(layout.height)
        }}
      />
      <FlatList
        key={type}
        bounces={false}
        showsVerticalScrollIndicator={false}
        data={highlightDataReviewed}
        keyExtractor={(_item, index) => `${type}_${index}`}
        contentContainerStyle={{ paddingBottom: headerHeight }}
        renderItem={({
          item,
        }: {
          item: NonNullable<
            NonNullable<CareerHighlightBigCardReviewed_myCollectionInfo$data["reviewedInsights"]>[0]
          >
        }) => {
          return (
            <EntityHeader
              mb={2}
              name={item?.artist?.name ?? ""}
              meta={
                formatTombstoneText(
                  item?.artist?.nationality,
                  item?.artist?.birthday,
                  item?.artist?.deathday
                ) ?? undefined
              }
              imageUrl={item?.artist?.image?.url ?? undefined}
              initials={item?.artist?.initials ?? undefined}
              key={`${item?.artist?.id}_${type}`}
            />
          )
        }}
        onEndReachedThreshold={1}
      />
    </View>
  )
}

const fragmentReviewed = graphql`
  fragment CareerHighlightBigCardReviewed_myCollectionInfo on MyCollectionInfo {
    reviewedInsights: artistInsights(kind: REVIEWED) {
      artist {
        id
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
