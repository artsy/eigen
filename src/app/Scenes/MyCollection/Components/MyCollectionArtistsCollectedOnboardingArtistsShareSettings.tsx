import { Text, Flex, Button, Spacer, Join } from "@artsy/palette-mobile"
import { MyCollectionArtistsCollectedOnboardingArtistsShareSettingsQuery } from "__generated__/MyCollectionArtistsCollectedOnboardingArtistsShareSettingsQuery.graphql"
import { ArtistListItemPlaceholder } from "app/Components/ArtistListItem"
import { SelectArtistToShareListItem } from "app/Scenes/MyCollection/Components/SelectArtistToShareListItem"
import { extractNodes } from "app/utils/extractNodes"
import { times } from "lodash"
import { Suspense, useState } from "react"
import { FlatList } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"

export const MyCollectionArtistsCollectedOnboardingArtistsShareSettingsScreen: React.FC<{}> =
  () => {
    const queryData =
      useLazyLoadQuery<MyCollectionArtistsCollectedOnboardingArtistsShareSettingsQuery>(
        MyCollectionArtistsCollectedOnboardingArtistsShareSettingsScreenQuery,
        {},
        { fetchPolicy: "network-only" }
      )

    const collectedArtists = extractNodes(
      queryData.me?.myCollectionInfo?.collectedArtistsConnection
    )
    const initiallySelectedArtists = collectedArtists.map((artist) => artist.internalID)

    const [selectedArtists, setSelectedArtists] = useState<string[]>(initiallySelectedArtists)

    const handleCheckBoxPress = (internalID: string) => {
      if (selectedArtists.includes(internalID)) {
        setSelectedArtists(selectedArtists.filter((item) => item !== internalID))
      } else {
        setSelectedArtists(selectedArtists.concat(internalID))
      }
    }

    return (
      <Flex flexGrow={1} px={2}>
        <Flex flex={1} mt={4}>
          <Text variant="lg-display">Select artists to share</Text>
          <Text mt={1} variant="sm-display">
            Which artists in your collection would you like galleries to see when you contact them?
          </Text>
          <Spacer y={4} />
          <FlatList
            data={collectedArtists}
            ItemSeparatorComponent={() => <Spacer y={2} />}
            renderItem={({ item }) => (
              <SelectArtistToShareListItem
                artist={item}
                checked={!!selectedArtists.includes(item.internalID)}
                oncheckBoxPress={(internalID) => handleCheckBoxPress(internalID)}
              />
            )}
          />
        </Flex>
        <Button
          my={2}
          block
          onPress={() => {
            console.warn("not yet ready")
          }}
        >
          Done
        </Button>
      </Flex>
    )
  }

export const MyCollectionArtistsCollectedOnboardingArtistsShareSettings: React.FC<{}> = () => (
  <Suspense fallback={<ShareSettingsScreenPlaceholder />}>
    <MyCollectionArtistsCollectedOnboardingArtistsShareSettingsScreen />
  </Suspense>
)

const ShareSettingsScreenPlaceholder: React.FC<{}> = () => (
  <Flex flexGrow={1} px={2}>
    <Flex flex={1} mt={4}>
      <Text variant="lg-display">Select artists to share</Text>
      <Text mt={1} variant="sm-display">
        Which artists in your collection would you like galleries to see when you contact them?
      </Text>
      <Spacer y={4} />
      <Join separator={<Spacer y={2} />}>
        {times(4).map((index: number) => (
          <Flex key={index}>
            <ArtistListItemPlaceholder displaywithCheckbox />
          </Flex>
        ))}
      </Join>
    </Flex>
  </Flex>
)

const MyCollectionArtistsCollectedOnboardingArtistsShareSettingsScreenQuery = graphql`
  query MyCollectionArtistsCollectedOnboardingArtistsShareSettingsQuery {
    me {
      myCollectionInfo {
        collectedArtistsConnection(first: 100, includePersonalArtists: true) {
          edges {
            node {
              internalID
              ...SelectArtistToShareListItem_artist
            }
          }
        }
      }
    }
  }
`
