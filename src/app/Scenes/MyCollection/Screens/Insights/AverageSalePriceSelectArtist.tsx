import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { SearchInput } from "app/Components/SearchInput"
import { groupBy, sortBy } from "lodash"
import { Flex, NoArtworkIcon, Text, Touchable, useColor } from "palette"
import React, { useEffect, useState } from "react"
import { FlatList, SectionList, SectionListData } from "react-native"
import { useScreenDimensions } from "shared/hooks"

interface AverageSalePriceSelectArtistModalProps {
  visible: boolean
  closeModal?: () => void
  onItemPress: (artist: AverageSalePriceArtist) => void
}

export interface AverageSalePriceArtist {
  name: string
  initials?: string
  formattedNationalityAndBirthday: string
  imageUrl: string
}

const data: AverageSalePriceArtist[] = [
  {
    name: "Andy Warhol",
    initials: "AW",
    formattedNationalityAndBirthday: "American, 1928–1987",
    imageUrl: "https://d32dm0rphc51dk.cloudfront.net/E-k-uLoQADM8AjadsSKHrA/square.jpg",
  },
  {
    name: "Banksy",
    initials: "B",
    formattedNationalityAndBirthday: "British, b. 1974",
    imageUrl: "https://d32dm0rphc51dk.cloudfront.net/X9vVvod7QY73ZwLDSZzljw/square.jpg",
  },
  {
    name: "Fabio Coruzzi",
    initials: "FC",
    formattedNationalityAndBirthday: "Italian, b. 1975",
    imageUrl: "https://d32dm0rphc51dk.cloudfront.net/7r-P0YKji2dWcb_qrTY24w/square.jpg",
  },
  {
    name: "Khadim Ali & Sher Ali",
    initials: "KAS",
    formattedNationalityAndBirthday: "",
    imageUrl: "https://d32dm0rphc51dk.cloudfront.net/I6B5jxExQMlGxBnrVd5Qjw/square.jpg",
  },
  {
    name: "Shaik Azghar Ali",
    initials: "SAA",
    formattedNationalityAndBirthday: "",
    imageUrl: "https://d32dm0rphc51dk.cloudfront.net/SVLAPSAXQmJ06T5TprEkoA/square.jpg",
  },
  {
    name: "Amoako Boafo",
    initials: "AB",
    formattedNationalityAndBirthday: "Ghanaian, b. 1984",
    imageUrl: "https://d32dm0rphc51dk.cloudfront.net/bBBIgjEwR2o9C_7BqJ6YPw/square.jpg",
  },
  {
    name: "Rose Frisenda",
    initials: "RF",
    formattedNationalityAndBirthday: "American",
    imageUrl: "https://d32dm0rphc51dk.cloudfront.net/WQ0SvpI9TG9JWOhFYxBnfw/square.jpg",
  },
]

const groupAndSortArtists = (artistsList: AverageSalePriceArtist[]) => {
  const sorted = sortBy(artistsList, (artist) => artist.initials?.slice(-1))

  return groupBy(sorted, (artist) => artist.initials?.slice(-1))
}

const groupedSortedArtists = groupAndSortArtists([...data, ...data])

export const AverageSalePriceSelectArtistModal: React.FC<
  AverageSalePriceSelectArtistModalProps
> = ({ visible, closeModal, onItemPress }) => {
  const [query, setQuery] = useState<string>("")
  const [filteredArtists, setFilteredArtists] = useState<AverageSalePriceArtist[]>([])

  const {
    safeAreaInsets: { bottom },
    width,
  } = useScreenDimensions()

  useEffect(() => {
    if (query.length > 0) {
      const filtered = data.filter((artist) =>
        artist.name.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredArtists(filtered)
    }
  }, [query])

  const groupedArtistsSections: ReadonlyArray<SectionListData<any, { [key: string]: any }>> =
    Object.entries(groupedSortedArtists).map(([initial, artistData]) => {
      const sectionTitle = initial

      return { sectionTitle, data: artistData }
    })

  return (
    <FancyModal
      visible={visible}
      onBackgroundPressed={closeModal}
      fullScreen
      animationPosition="right"
    >
      <FancyModalHeader onLeftButtonPress={closeModal} hideBottomDivider>
        <Text variant="md">Select Artist</Text>
      </FancyModalHeader>

      <Flex flex={1} px={2}>
        <Flex pt={1} pb={2}>
          <SearchInput
            enableCancelButton
            onCancelPress={() => setQuery("")}
            placeholder="Search Artist from Your Collection"
            value={query}
            onChangeText={setQuery}
          />
        </Flex>

        {query.length > 0 ? (
          <FlatList
            data={filteredArtists}
            renderItem={({ item }) => (
              <ArtistSectionItem artist={item} onPress={() => onItemPress(item)} />
            )}
          />
        ) : (
          <SectionList
            sections={groupedArtistsSections}
            stickySectionHeadersEnabled={false}
            ListHeaderComponent={() => (
              <>
                <Text variant="md">Artists You Collect</Text>
                <Text variant="xs" color="black60">
                  With insights currently available
                </Text>
              </>
            )}
            renderSectionHeader={({ section: { sectionTitle } }) => (
              <Flex bg="white">
                <Text py="2" variant="md">
                  {sectionTitle}
                </Text>
              </Flex>
            )}
            renderItem={({ item, index }) =>
              item ? (
                <ArtistSectionItem
                  first={index === 0}
                  artist={item}
                  onPress={() => onItemPress(item)}
                />
              ) : (
                <></>
              )
            }
            style={{ width, marginBottom: bottom }}
          />
        )}
      </Flex>
    </FancyModal>
  )
}

interface ArtistSectionItemProps {
  artist: AverageSalePriceArtist
  onPress: () => void
  first?: boolean
}

const ArtistSectionItem: React.FC<ArtistSectionItemProps> = ({ artist, first, onPress }) => {
  const color = useColor()

  return (
    <Touchable underlayColor={color("black5")} onPress={onPress} haptic>
      <Flex
        pt={first ? 0 : 1}
        pb={1}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        {!artist.imageUrl ? (
          <Flex
            width={40}
            height={40}
            borderRadius={20}
            backgroundColor="black10"
            alignItems="center"
            justifyContent="center"
            style={{ marginTop: 3 }}
          >
            <NoArtworkIcon width={28} height={28} opacity={0.3} />
          </Flex>
        ) : (
          <Flex
            width={40}
            height={40}
            borderRadius={20}
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            // To align the image with the text we have to add top margin to compensate the line height.
            style={{ marginTop: 3 }}
          >
            <OpaqueImageView width={40} height={40} imageURL={artist.imageUrl} />
          </Flex>
        )}
        {/* Sale Artwork Artist Name, Birthday and Nationality */}
        <Flex flex={1} pl={1}>
          {!!artist.name && (
            <Text variant="md" ellipsizeMode="middle" numberOfLines={2}>
              {artist.name}
            </Text>
          )}
          {!!artist.formattedNationalityAndBirthday && (
            <Flex>
              <Text variant="xs" ellipsizeMode="middle" color="black60">
                {artist?.formattedNationalityAndBirthday}
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Touchable>
  )
}
