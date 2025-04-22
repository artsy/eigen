import { Flex, Message, Spacer, Text, Touchable } from "@artsy/palette-mobile"
import { LoadingSpinner } from "app/Components/Modals/LoadingModal"
import { ArtworkFormScreen } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { MyCollectionAddCollectedArtistsStore } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtistsStore"
import { goBack, navigate } from "app/system/navigation/navigate"
import { FC } from "react"

type CustomArtistNavigationProps = ArtworkFormScreen["AddMyCollectionArtist"]

interface MyCollectionArtistsAutosuggestListHeaderProps {
  debouncedQuery: string
  query: string
  resultsLength: number
  isLoading?: boolean
}

export const MyCollectionArtistsAutosuggestListHeader: FC<
  MyCollectionArtistsAutosuggestListHeaderProps
> = ({ query, debouncedQuery, resultsLength, isLoading }) => {
  const addCustomArtist = MyCollectionAddCollectedArtistsStore.useStoreActions(
    (actions) => actions.addCustomArtist
  )
  const count = MyCollectionAddCollectedArtistsStore.useStoreState((state) => state.count)

  // TODO: once the MyCollection flow fixes this part, we can remove this
  const customArtistNavigationProps: CustomArtistNavigationProps = {
    onSubmit: (artist) => {
      addCustomArtist(artist)
      goBack()
    },
    artistDisplayName: query,
  }

  if (isLoading) {
    return (
      <Flex p={4}>
        <LoadingSpinner />
      </Flex>
    )
  }

  return (
    <>
      {resultsLength > 0 ? (
        <>
          <Flex>
            <Flex flexDirection="row">
              <Text variant="xs" color="mono60">
                Can't find the artist?{" "}
              </Text>
              <Touchable
                onPress={() => {
                  navigate("/my-collection/artists/new", {
                    passProps: customArtistNavigationProps,
                  })
                }}
                hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
              >
                <Text variant="xs" color="mono60" underline>
                  Add their name.
                </Text>
              </Touchable>
            </Flex>
            <Text variant="xs">{`${count} artist${count === 1 ? "" : "s"} selected`}</Text>
          </Flex>
          <Spacer y={2} />
        </>
      ) : (
        <Message
          text={
            debouncedQuery !== ""
              ? `No results for "${query.trim()}" on Artsy.`
              : "Results will appear here as you search. Select an artist to add them to your collection."
          }
        />
      )}
    </>
  )
}
