import { Flex, Text, Touchable, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { MyCollectionCollectedArtistGridItem_artist$key } from "__generated__/MyCollectionCollectedArtistGridItem_artist.graphql"
import { formatTombstoneText } from "app/Components/ArtistListItem"
import { MyCollectionTabsStore } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { isPad } from "app/utils/hardware"
import { pluralize } from "app/utils/pluralize"
import { Image } from "react-native"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface MyCollectionCollectedArtistGridItemProps {
  artist: MyCollectionCollectedArtistGridItem_artist$key
  artworksCount: number | null
}

export const MyCollectionCollectedArtistGridItem: React.FC<
  MyCollectionCollectedArtistGridItemProps
> = ({ artist, artworksCount }) => {
  const setViewKind = MyCollectionTabsStore.useStoreActions((state) => state.setViewKind)

  const artistData = useFragment<MyCollectionCollectedArtistGridItem_artist$key>(
    artistFragment,
    artist
  )
  const { nationality, birthday, deathday } = artistData
  const space = useSpace()
  const { width: screenWidth } = useScreenDimensions()

  const isAPad = isPad()
  const itemWidth = isAPad ? (screenWidth - space(2) * 7) / 3 : (screenWidth - space(2) * 4) / 2

  const getMeta = () => {
    const tombstoneText = formatTombstoneText(nationality, birthday, deathday)

    if (!!tombstoneText || Number.isInteger(artworksCount)) {
      return (
        <Flex alignItems="center">
          {!!tombstoneText && (
            <Text variant="xs" color="black60">
              {tombstoneText}
            </Text>
          )}
          {Number.isInteger(artworksCount) && (
            <Text variant="xs" color={artworksCount === 0 ? "black60" : "black100"}>
              {artworksCount} {pluralize("artwork", artworksCount || 0)} uploaded
            </Text>
          )}
        </Flex>
      )
    }

    return undefined
  }
  const meta = getMeta()

  return (
    <Flex flex={1} maxWidth={isAPad ? "33%" : "50%"} alignItems="center">
      <Touchable
        onPress={() => {
          setViewKind({
            viewKind: "Artist",
            id: artistData.internalID,
            artworksCount: artworksCount,
          })
        }}
      >
        <Flex alignItems="center">
          {artistData.image?.url ? (
            <Image
              style={{ width: itemWidth, height: itemWidth, borderRadius: itemWidth / 2 }}
              source={{ uri: artistData.image?.url || "" }}
            />
          ) : (
            <CustomArtistNoImage initials={artistData.initials || ""} itemWidth={itemWidth} />
          )}
          <Text variant="xs" numberOfLines={2} mt={0.5}>
            {artistData.name ?? ""}
          </Text>
          {meta}
        </Flex>
      </Touchable>
    </Flex>
  )
}

const CustomArtistNoImage: React.FC<{ initials: string; itemWidth: number }> = ({
  initials,
  itemWidth,
}) => {
  return (
    <Flex
      alignItems="center"
      backgroundColor="black5"
      border="1px solid"
      borderColor="black15"
      borderRadius={itemWidth / 2}
      width={itemWidth}
      height={itemWidth}
      justifyContent="center"
    >
      <Text variant="xl">{initials}</Text>
    </Flex>
  )
}

const artistFragment = graphql`
  fragment MyCollectionCollectedArtistGridItem_artist on Artist {
    name
    id
    internalID
    slug
    name
    initials
    href
    is_followed: isFollowed
    nationality
    birthday
    deathday
    image {
      url
    }
  }
`
