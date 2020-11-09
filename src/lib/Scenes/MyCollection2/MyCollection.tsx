import { MyCollection_me } from "__generated__/MyCollection_me.graphql"
import { MyCollectionQuery } from "__generated__/MyCollectionQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { ZeroState } from "lib/Components/States/ZeroState"
import { PAGE_SIZE } from "lib/data/constants"
import { navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractNodes } from "lib/utils/extractNodes"
import { isCloseToBottom } from "lib/utils/isCloseToBottom"
import { PlaceholderBox, PlaceholderRaggedText, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Box, Button, Flex, Join, Separator, Spacer, Text } from "palette"
import React, { useState } from "react"
import { View } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { MyCollectionArtworkListItemFragmentContainer } from "../MyCollection/Screens/ArtworkList/MyCollectionArtworkListItem"
import { MyCollectionArtworkFormModal } from "./Components/ArtworkFormModal/MyCollectionArtworkFormModal"

const MyCollection: React.FC<{
  relay: RelayPaginationProp
  me: MyCollection_me
}> = ({ relay, me }) => {
  const [showModal, setShowModal] = useState(false)
  const artworks = extractNodes(me?.myCollectionConnection)
  const { hasMore, isLoading, loadMore } = relay

  const fetchNextPage = () => {
    if (!hasMore() || isLoading()) {
      return
    }

    loadMore(PAGE_SIZE!, (error) => {
      if (error) {
        throw new Error(`Error fetching artworks in MyCollectionArtworkList.tsx: ${error}`)
      }
    })
  }

  return (
    <View style={{ flex: 1 }}>
      <MyCollectionArtworkFormModal
        mode="add"
        visible={showModal}
        onDismiss={() => setShowModal(false)}
        onSuccess={() => setShowModal(false)}
      />
      <FancyModalHeader
        rightButtonText="Add artwork"
        hideBottomDivider
        onRightButtonPress={() => setShowModal(true)}
      ></FancyModalHeader>
      <Text variant="largeTitle" ml={2} mb={2}>
        My Collection
      </Text>
      {artworks.length === 0 ? (
        <Flex pb="200">
          <Button
            onPress={() =>
              navigate(
                "/my-collection/artwork/5fa40336c2e78d0010a850c6?artistInternalID=4dd1584de0091e000100207c&medium=painting"
              )
            }
          >
            {" "}
            go to artwork{" "}
          </Button>
          <ZeroState
            subtitle="Add a work from your collection to access price and market insights."
            callToAction={<Button onPress={() => setShowModal(true)}>Add artwork</Button>}
          />
        </Flex>
      ) : (
        <FlatList
          data={artworks}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <Separator />}
          keyExtractor={(node) => node!.id}
          onScroll={isCloseToBottom(fetchNextPage)}
          renderItem={({ item }) => {
            return <MyCollectionArtworkListItemFragmentContainer artwork={item} />
          }}
        />
      )}
    </View>
  )
}

export const MyCollectionContainer = createPaginationContainer(
  MyCollection,
  {
    me: graphql`
      fragment MyCollection_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, cursor: { type: "String" }) {
        id
        myCollectionConnection(first: $count, after: $cursor, sort: CREATED_AT_DESC)
        @connection(key: "MyCollection_myCollectionConnection", filters: []) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              slug
              ...MyCollectionArtworkListItem_artwork
            }
          }
        }
      }
    `,
  },
  {
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    query: graphql`
      query MyCollectionPaginationQuery($count: Int!, $cursor: String) {
        me {
          ...MyCollection_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

export const MyCollectionQueryRenderer: React.FC = () => {
  return (
    <QueryRenderer<MyCollectionQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MyCollectionQuery {
          me {
            ...MyCollection_me
          }
        }
      `}
      variables={{}}
      render={renderWithPlaceholder({
        Container: MyCollectionContainer,
        renderPlaceholder: LoadingSkeleton,
      })}
    />
  )
}

const LoadingSkeleton = () => {
  return (
    <>
      <Text variant="largeTitle" ml={2} mb={2} mt={6}>
        My Collection
      </Text>

      <Box>
        <Spacer mb={2} />

        {/* List items  */}
        <Flex flexDirection="column" pl={2}>
          <Join separator={<Spacer mr={0.5} />}>
            {[...new Array(8)].map((_, index) => {
              return (
                <Flex key={index} flexDirection="row" mb={1} alignItems="center">
                  <PlaceholderBox width={90} height={90} marginRight={10} />
                  <Box>
                    <PlaceholderText width={200} />
                    <PlaceholderRaggedText numLines={2} />
                  </Box>
                </Flex>
              )
            })}
          </Join>
        </Flex>
      </Box>
    </>
  )
}
