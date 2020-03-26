import { Flex, Sans, Spacer } from "@artsy/palette"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import React from "react"
import { Alert } from "react-native"
import styled from "styled-components/native"

export const ViewingRoomArtworkRail: React.FC = () => {
  return (
    <>
      <Flex pl="2" pr="2" mb="1" flexDirection="row" justifyContent="space-between">
        <Sans size="2" weight="medium">
          5 works total
        </Sans>
        <Sans size="2" color="black60">
          View all
        </Sans>
      </Flex>
      <AboveTheFoldFlatList
        horizontal
        style={{ height: 100 }}
        ListHeaderComponent={() => <Spacer mr={2}></Spacer>}
        ListFooterComponent={() => <Spacer mr={2}></Spacer>}
        ItemSeparatorComponent={() => <Spacer mr={0.5}></Spacer>}
        showsHorizontalScrollIndicator={false}
        data={[
          { image: { imageURL: "http://placekitten.com/1200/1000" } },
          { image: { imageURL: "http://placekitten.com/800/1200" } },
          { image: { imageURL: "http://placekitten.com/700/1200" } },
          { image: { imageURL: "http://placekitten.com/600/1200" } },
          { image: { imageURL: "http://placekitten.com/500/1200" } },
        ]}
        initialNumToRender={4}
        windowSize={3}
        renderItem={({ item }) => (
          <ArtworkCard onPress={() => Alert.alert("sup")}>
            <OpaqueImageView imageURL={item.image?.imageURL.replace(":version", "square")} width={100} height={100} />
          </ArtworkCard>
        )}
        keyExtractor={(item, index) => String(item.image?.imageURL || index)}
      />
    </>
  )
}

const ArtworkCard = styled.TouchableHighlight`
  border-radius: 2px;
  overflow: hidden;
`
