import { Flex, Spacer } from "@artsy/palette"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { SectionTitle } from "lib/Components/SectionTitle"
import React from "react"
import { Alert, View } from "react-native"
import styled from "styled-components/native"

export const ViewingRoomArtworkRail: React.FC = () => {
  return (
    <View>
      <Flex>
        <SectionTitle title="# artworks" onPress={() => {}} />
      </Flex>
      <AboveTheFoldFlatList
        horizontal
        style={{ height: 100 }}
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
    </View>
  )
}

const ArtworkCard = styled.TouchableHighlight`
  border-radius: 2px;
  overflow: hidden;
`
