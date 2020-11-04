import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { AutosuggestResult } from "lib/Scenes/Search/AutosuggestResults"
import { AppStore } from "lib/store/AppStore"
import { Button, Flex, Spacer, Text } from "palette"
import React from "react"

export const ArtistSearchResult: React.FC<{ result: AutosuggestResult }> = ({ result }) => {
  return (
    <Flex flexDirection="row" alignItems="center">
      <OpaqueImageView
        imageURL={result.imageUrl}
        style={{ width: 40, height: 40, borderRadius: 2, overflow: "hidden" }}
      />
      <Spacer ml="1" />
      <Text
        variant="subtitle"
        ellipsizeMode="tail"
        numberOfLines={1}
        data-test-id="displayLabel"
        style={{ flexShrink: 1, flexGrow: 1, overflow: "hidden" }}
      >
        {result.displayLabel}
      </Text>
      <Spacer ml="1" />
      <Button
        variant="secondaryGray"
        size="small"
        onPress={() => {
          AppStore.actions.myCollection.artwork.setArtistSearchResult(null)
        }}
      >
        Remove
      </Button>
    </Flex>
  )
}
