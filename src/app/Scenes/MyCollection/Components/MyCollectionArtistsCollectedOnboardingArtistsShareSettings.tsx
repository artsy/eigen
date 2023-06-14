import { Text, Flex, Button, Spacer } from "@artsy/palette-mobile"
import { MyCollectionArtistsCollectedOnboardingArtistsShareSettingsQuery } from "__generated__/MyCollectionArtistsCollectedOnboardingArtistsShareSettingsQuery.graphql"
import { SelectArtistToShareListItem } from "app/Scenes/MyCollection/Components/SelectArtistToShareListItem"
import { extractNodes } from "app/utils/extractNodes"
import { FlatList } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"

export const MyCollectionArtistsCollectedOnboardingArtistsShareSettings: React.FC<{}> = () => {
  const queryData =
    useLazyLoadQuery<MyCollectionArtistsCollectedOnboardingArtistsShareSettingsQuery>(
      MyCollectionArtistsCollectedOnboardingArtistsShareSettingsScreenQuery,
      {},
      { fetchPolicy: "network-only" }
    )

  const collectedArtists = extractNodes(queryData.me?.myCollectionInfo?.collectedArtistsConnection)

  return (
    <Flex flexGrow={1} px={2}>
      <Flex position="relative" flex={1} mt={4}>
        <Text variant="lg-display">Select artists to share</Text>
        <Text mt={1} variant="sm-display">
          Which artists in your collection would you like galleries to see when you contact them?
        </Text>
        <Spacer y={4} />
        <FlatList
          data={collectedArtists}
          ItemSeparatorComponent={() => <Spacer y={2} />}
          renderItem={({ item }) => <SelectArtistToShareListItem artist={item} />}
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

const MyCollectionArtistsCollectedOnboardingArtistsShareSettingsScreenQuery = graphql`
  query MyCollectionArtistsCollectedOnboardingArtistsShareSettingsQuery {
    me {
      myCollectionInfo {
        collectedArtistsConnection(first: 100, includePersonalArtists: true) {
          edges {
            node {
              id
              ...SelectArtistToShareListItem_artist
            }
          }
        }
      }
    }
  }
`
