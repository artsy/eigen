import { CheckmarkIcon } from "@artsy/icons/native"
import {
  Avatar,
  Box,
  Button,
  Flex,
  Input,
  Spacer,
  Text,
  Touchable,
  nbsp,
} from "@artsy/palette-mobile"
import { ArtistAutosuggestQuery } from "__generated__/ArtistAutosuggestQuery.graphql"
import {
  AutosuggestResult,
  AutosuggestResults,
} from "app/Components/AutosuggestResults/AutosuggestResults"
import SearchIcon from "app/Components/Icons/SearchIcon"
import { ArtworkFormScreen } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { MyCollectionAddCollectedArtistsStore } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsStore"
import { filterArtistsByKeyword } from "app/Scenes/MyCollection/utils/filterArtistsByKeyword"
import { SearchContext, useSearchProviderValues } from "app/Scenes/Search/SearchContext"
import { ResultWithHighlight } from "app/Scenes/Search/components/ResultWithHighlight"
import { goBack, navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { PlaceholderBox, PlaceholderText, ProvidePlaceholderContext } from "app/utils/placeholders"
import { sortBy, times } from "lodash"
import { useState } from "react"
import { LayoutAnimation } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useLazyLoadQuery } from "react-relay"

export const MyCollectionAddCollectedArtistsAutosuggest: React.FC<{}> = ({}) => {
  const [query, setQuery] = useState("")
  const trimmedQuery = query.trimStart()

  const addOrRemoveArtist = MyCollectionAddCollectedArtistsStore.useStoreActions(
    (actions) => actions.addOrRemoveArtist
  )
  const addCustomArtist = MyCollectionAddCollectedArtistsStore.useStoreActions(
    (actions) => actions.addCustomArtist
  )

  const searchProviderValues = useSearchProviderValues(query.trimStart())

  const queryData = useLazyLoadQuery<ArtistAutosuggestQuery>(
    myCollectionAddCollectedArtistsAutosuggestQuery,
    {},
    { fetchPolicy: "network-only" }
  )

  const collectedArtists = extractNodes(queryData.me?.userInterestsConnection)
  const filteredCollectedArtists = sortBy(
    filterArtistsByKeyword(
      collectedArtists as Array<{ displayLabel: string | null }>,
      trimmedQuery
    ),
    ["displayLabel"]
  )

  const oldCollectedArtistsIds = (collectedArtists as Array<{ internalID: string | null }>).map(
    (artist) => artist.internalID
  )

  const showResults = trimmedQuery.length > 2

  // We are using this gymnastics to make sure that sent params are captured no matter if we navigate
  // using navigation.navigate or the global navigate function
  const navigationProps: { passProps: ArtworkFormScreen["AddMyCollectionArtist"] } = {
    passProps: {
      onSubmit: (values) => {
        addCustomArtist(values)

        goBack()

        // PS: make sure to set query to empty string as soon as the user saves a custom artist
      },
      artistDisplayName: query,
    },
  }

  const HeaderComponent = () => (
    <>
      <Flex flexDirection="row" py={1}>
        <Text variant="xs" color="mono60">
          Can't find the artist?{" "}
        </Text>
        <Touchable
          accessibilityRole="button"
          onPress={() => {
            navigate("/my-collection/artists/new", navigationProps)
          }}
          testID="my-collection-artwork-form-artist-skip-button"
          hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
        >
          <Text variant="xs" color="mono60" underline>
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
              prependResults={filteredCollectedArtists}
              entities={["ARTIST"]}
              showResultType={false}
              showQuickNavigationButtons={false}
              onResultPress={(result) => {
                if (result.internalID) {
                  addOrRemoveArtist(result.internalID)
                }
              }}
              HeaderComponent={HeaderComponent}
              numColumns={isTablet() ? 5 : 2}
              CustomListItemComponent={(props) => (
                <CollectedArtistListItem
                  {...props}
                  disabled={oldCollectedArtistsIds.includes(props.item.internalID || "")}
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
      userInterestsConnection(first: 100, interestType: ARTIST) {
        edges {
          node {
            ... on Artist {
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

const ARTIST_LIST_ITEM_HEIGHT = 100

const MyCollectionAddCollectedArtistsAutosuggestPlaceholder: React.FC<{}> = ({}) => {
  const Circle = () => (
    <Flex alignItems="center" justifyContent="center" width={isTablet() ? "20%" : "50%"} mt={2}>
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
      {times(isTablet() ? 10 : 4).map((i) => (
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
  const artistIds = MyCollectionAddCollectedArtistsStore.useStoreState((state) => state.artistIds)

  const [isSelected, setIsSelected] = useState(artistIds.includes(artist.internalID || ""))

  const addOrRemoveArtist = MyCollectionAddCollectedArtistsStore.useStoreActions(
    (actions) => actions.addOrRemoveArtist
  )

  const handlePress = () => {
    LayoutAnimation.configureNext({ ...LayoutAnimation.Presets.linear, duration: 200 })
    setIsSelected(!isSelected)
    if (artist.internalID) {
      addOrRemoveArtist(artist.internalID)
    }
  }

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      width={isTablet() ? "20%" : "50%"}
      mt={2}
      m="auto"
    >
      <Touchable accessibilityRole="button" onPress={handlePress} disabled={disabled}>
        <Flex width="100%" alignItems="center">
          <Flex
            position="absolute"
            backgroundColor="mono10"
            height={ARTIST_LIST_ITEM_HEIGHT}
            width={ARTIST_LIST_ITEM_HEIGHT}
            borderRadius={ARTIST_LIST_ITEM_HEIGHT / 2}
          />
          {!!(isSelected || !!disabled) && <Overlay disabled={disabled} />}
          <Avatar
            src={artist.imageUrl || undefined}
            initials={artist.initials || undefined}
            size="md"
          />
        </Flex>

        <Spacer y={0.5} />

        <ResultWithHighlight
          secondaryLabel={artist.formattedNationalityAndBirthday || nbsp}
          displayLabel={artist.displayLabel || ""}
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
        backgroundColor={disabled ? "mono100" : "blue100"}
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
        <CheckmarkIcon fill="mono0" height={30} width={30} opacity={1} />
      </Flex>
    </>
  )
}
