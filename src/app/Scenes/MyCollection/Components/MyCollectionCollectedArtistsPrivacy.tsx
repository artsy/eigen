import { Button, Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
import {
  MyCollectionCollectedArtistsPrivacyQuery,
  MyCollectionCollectedArtistsPrivacyQuery$data,
} from "__generated__/MyCollectionCollectedArtistsPrivacyQuery.graphql"
import { ArtistListItemPlaceholder } from "app/Components/ArtistListItem"
import { SelectArtistToShareListItem } from "app/Scenes/MyCollection/Components/SelectArtistToShareListItem"
import { dismissModal } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { times } from "lodash"
import { useState } from "react"
import { FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { graphql, useLazyLoadQuery } from "react-relay"

interface MyCollectionCollectedArtistsPrivacyProps {
  me: MyCollectionCollectedArtistsPrivacyQuery$data["me"]
}
export const MyCollectionCollectedArtistsPrivacy: React.FC<
  MyCollectionCollectedArtistsPrivacyProps
> = ({ me }) => {
  const collectedArtists = extractNodes(me?.myCollectionInfo?.collectedArtistsConnection)
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
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      <Flex flex={1} mt={4} px={2}>
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

      <Flex position="absolute" p={2} bottom={0}>
        <Button
          my={2}
          block
          onPress={() => {
            console.warn("not yet ready")
            dismissModal()
          }}
        >
          Done
        </Button>
      </Flex>
    </SafeAreaView>
  )
}

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
            <ArtistListItemPlaceholder includeCheckbox />
          </Flex>
        ))}
      </Join>
    </Flex>
  </Flex>
)

export const MyCollectionCollectedArtistsPrivacyQueryRenderer: React.FC<{}> = withSuspense(() => {
  const data = useLazyLoadQuery<MyCollectionCollectedArtistsPrivacyQuery>(
    myCollectionCollectedArtistsPrivacyQuery,
    {},
    { fetchPolicy: "network-only" }
  )

  return <MyCollectionCollectedArtistsPrivacy me={data.me!} />
}, ShareSettingsScreenPlaceholder)

const myCollectionCollectedArtistsPrivacyQuery = graphql`
  query MyCollectionCollectedArtistsPrivacyQuery {
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
