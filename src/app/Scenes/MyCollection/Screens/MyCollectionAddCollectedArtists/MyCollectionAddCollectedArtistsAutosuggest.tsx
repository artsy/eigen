import {
  Avatar,
  Box,
  Button,
  CheckIcon,
  Flex,
  Spacer,
  Text,
  Touchable,
} from "@artsy/palette-mobile"
import { ArtistAutosuggestQuery } from "__generated__/ArtistAutosuggestQuery.graphql"
import {
  AutosuggestResult,
  AutosuggestResults,
} from "app/Components/AutosuggestResults/AutosuggestResults"
import SearchIcon from "app/Components/Icons/SearchIcon"
import { Input } from "app/Components/Input"
import { ArtworkFormScreen } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { MyCollectionAddCollectedArtistsStore } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsStore"
import { SearchContext, useSearchProviderValues } from "app/Scenes/Search/SearchContext"
import { ResultWithHighlight } from "app/Scenes/Search/components/ResultWithHighlight"
import { goBack, navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { isPad } from "app/utils/hardware"
import { normalizeText } from "app/utils/normalizeText"
import { PlaceholderBox, PlaceholderText, ProvidePlaceholderContext } from "app/utils/placeholders"
import { sortBy, times } from "lodash"
import { useState } from "react"
import { LayoutAnimation } from "react-native"
import { useLazyLoadQuery } from "react-relay"
import { graphql } from "relay-runtime"

export const MyCollectionAddCollectedArtistsAutosuggest: React.FC<{}> = ({}) => {
  const [query, setQuery] = useState("")
  const trimmedQuery = query.trimStart()

  const addOrRemoveArtist = MyCollectionAddCollectedArtistsStore.useStoreActions(
    (actions) => actions.addOrRemoveArtist
  )

  const searchProviderValues = useSearchProviderValues(query.trimStart())

  const queryData = useLazyLoadQuery<ArtistAutosuggestQuery>(
    myCollectionAddCollectedArtistsAutosuggestQuery,
    {},
    { fetchPolicy: "network-only" }
  )

  const collectedArtists = extractNodes(queryData.me?.myCollectionInfo?.collectedArtistsConnection)
  const filteredCollecteArtists = sortBy(filterArtistsByKeyword(collectedArtists, trimmedQuery), [
    "displayLabel",
  ])

  const oldCollectedArtistsIds = new Set(collectedArtists.map((artist) => artist.internalID))

  const showResults = trimmedQuery.length > 2

  const isTablet = isPad()

  const navigationProps: { passProps: ArtworkFormScreen["AddMyCollectionArtist"]["props"] } = {
    passProps: {
      handleBackButtonPress: goBack,
      onSubmit: () => {
        // do nothing
      },
    },
  }

  const HeaderComponent = () => (
    <>
      <Flex flexDirection="row" mt={1} mb={2}>
        <Text variant="xs" color="black60">
          Can't find the artist?{" "}
        </Text>
        <Touchable
          onPress={() => {
            navigate("/my-collection/artists/new", navigationProps)
          }}
          testID="my-collection-artwork-form-artist-skip-button"
          hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
        >
          <Text variant="xs" color="black60" underline>
            Add their name.
          </Text>
        </Touchable>
      </Flex>
    </>
  )

  return (
    <SearchContext.Provider value={searchProviderValues}>
      <Box>
        <Input
          placeholder="Search for artists on Artsy"
          icon={<SearchIcon width={18} height={18} />}
          onChangeText={setQuery}
          value={query}
          enableClearButton
          autoCorrect={false}
        />
        {showResults ? (
          <Box pb={6}>
            <AutosuggestResults
              query={trimmedQuery}
              prependResults={filteredCollecteArtists}
              entities={["ARTIST"]}
              showResultType={false}
              showQuickNavigationButtons={false}
              onResultPress={(result) => addOrRemoveArtist(result.internalID!)}
              HeaderComponent={HeaderComponent}
              numColumns={isTablet ? 5 : 2}
              CustomListItemComponent={(props) => (
                <CollectedArtistListItem
                  {...props}
                  disabled={oldCollectedArtistsIds.has(props.item.internalID!)}
                />
              )}
              ListEmptyComponent={() => (
                <Flex width="100%" my={2}>
                  <Text>We didn't find "{trimmedQuery}" on Artsy.</Text>
                  <Button
                    variant="outline"
                    onPress={() => {
                      navigate("/my-collection/artists/new", navigationProps)
                    }}
                    mt={4}
                    block
                  >
                    Add Artist
                  </Button>
                </Flex>
              )}
              CustomPlaceholderComponent={MyCollectionAddCollectedArtistsAutosuggestPlaceholder}
            />
          </Box>
        ) : null}
      </Box>
    </SearchContext.Provider>
  )
}

const myCollectionAddCollectedArtistsAutosuggestQuery = graphql`
  query MyCollectionAddCollectedArtistsAutosuggestQuery {
    me {
      myCollectionInfo {
        collectedArtistsConnection(first: 100, includePersonalArtists: true) {
          edges {
            node {
              displayLabel
              imageUrl
              initials
              internalID
            }
          }
        }
      }
    }
  }
`

export const filterArtistsByKeyword = (
  artists: Array<{ displayLabel: string | null }>,
  keywordFilter: string
) => {
  if (keywordFilter.length < 2) {
    return artists
  }

  const normalizedKeywordFilter = normalizeText(keywordFilter)

  if (!normalizedKeywordFilter) {
    return artists
  }

  const keywordFilterWords = normalizedKeywordFilter.split(" ")

  const doAllKeywordFiltersMatch = (artist: { displayLabel: string | null }) =>
    keywordFilterWords.filter((word) => !normalizeText(artist?.displayLabel ?? "").includes(word))
      .length === 0

  return artists.filter(doAllKeywordFiltersMatch)
}

const ARTIST_LIST_ITEM_HEIGHT = 100

const MyCollectionAddCollectedArtistsAutosuggestPlaceholder: React.FC<{}> = ({}) => {
  const isTablet = isPad()

  const Circle = () => (
    <Flex alignItems="center" justifyContent="center" width={isTablet ? "20%" : "50%"} mt={2}>
      {/* <PlaceholderBox width={100} height={100} borderRadius={50} backgroundColor="black10"></PlaceholderBox> */}
      <PlaceholderBox
        height={ARTIST_LIST_ITEM_HEIGHT}
        width={ARTIST_LIST_ITEM_HEIGHT}
        borderRadius={ARTIST_LIST_ITEM_HEIGHT / 2}
      />

      <Spacer y={1} />

      <PlaceholderText height={18} width={50 + Math.random() * 50} />
    </Flex>
  )

  const Row = () => (
    <Flex flexDirection="row">
      <Circle />
      <Circle />
    </Flex>
  )

  return (
    <ProvidePlaceholderContext>
      {times(isTablet ? 10 : 4).map((i) => (
        <Row key={i} />
      ))}
    </ProvidePlaceholderContext>
  )
}

const CollectedArtistListItem: React.FC<{
  disabled?: boolean
  highlight: string
  item: AutosuggestResult
}> = ({ disabled = false, highlight, item: artist }) => {
  const isTablet = isPad()
  const artistIds = MyCollectionAddCollectedArtistsStore.useStoreState((state) => state.artistIds)

  const [isSelected, setIsSelected] = useState(artistIds.has(artist.internalID!))

  const addOrRemoveArtist = MyCollectionAddCollectedArtistsStore.useStoreActions(
    (actions) => actions.addOrRemoveArtist
  )

  const handlePress = () => {
    LayoutAnimation.configureNext({ ...LayoutAnimation.Presets.linear, duration: 200 })
    setIsSelected(!isSelected)
    addOrRemoveArtist(artist.internalID!)
  }

  return (
    <Flex alignItems="center" justifyContent="center" width={isTablet ? "20%" : "50%"} mt={2}>
      <Touchable onPress={handlePress} disabled={disabled}>
        <Flex width="100%" alignItems="center">
          {!!(isSelected || !!disabled) && <Overlay disabled={disabled} />}
          <Avatar
            src={artist.imageUrl || undefined}
            initials={artist.initials || undefined}
            size="md"
          />
        </Flex>

        <Spacer y={0.5} />

        <ResultWithHighlight
          displayLabel={artist.displayLabel!}
          numberOfLines={2}
          highlight={highlight}
          textAlign="center"
        />
      </Touchable>
    </Flex>
  )
}

const Overlay: React.FC<{ disabled: boolean }> = ({ disabled }) => {
  return (
    <>
      <Flex
        height={ARTIST_LIST_ITEM_HEIGHT}
        width={ARTIST_LIST_ITEM_HEIGHT}
        borderRadius={ARTIST_LIST_ITEM_HEIGHT / 2}
        backgroundColor={disabled ? "black100" : "blue100"}
        opacity={0.6}
        position="absolute"
        zIndex={1}
      />
      <Flex
        height={ARTIST_LIST_ITEM_HEIGHT}
        width={ARTIST_LIST_ITEM_HEIGHT}
        borderRadius={ARTIST_LIST_ITEM_HEIGHT / 2}
        position="absolute"
        zIndex={1}
        justifyContent="center"
        alignItems="center"
      >
        <CheckIcon fill="white100" height={30} width={30} opacity={1} />
      </Flex>
    </>
  )
}
