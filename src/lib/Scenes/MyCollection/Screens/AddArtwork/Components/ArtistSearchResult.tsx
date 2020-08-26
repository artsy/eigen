import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { AutosuggestResult } from "lib/Scenes/Search/AutosuggestResults"
import { AppStore } from "lib/store/AppStore"
import { Button, Flex, Sans, Spacer } from "palette"
import React from "react"
import { Text, View } from "react-native"

export const ArtistSearchResult: React.FC<{ result: AutosuggestResult }> = ({ result }) => {
  return (
    <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
      <Flex flexDirection="row" alignItems="center">
        <OpaqueImageView
          imageURL={result.imageUrl}
          style={{ width: 40, height: 40, borderRadius: 2, overflow: "hidden" }}
        />
        <Spacer ml={1} />
        <View>
          <Text ellipsizeMode="tail" numberOfLines={1}>
            {result.displayLabel}
          </Text>
        </View>
      </Flex>
      <Button
        variant="secondaryGray"
        size="small"
        onPress={() => {
          AppStore.actions.myCollection.artwork.setArtistSearchResult(null)
        }}
      >
        <Sans size="3">Remove</Sans>
      </Button>
    </Flex>
  )
}
