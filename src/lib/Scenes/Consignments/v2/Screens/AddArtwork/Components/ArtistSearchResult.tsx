import { Button, Flex, Sans, Spacer } from "@artsy/palette"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { useStoreActions } from "lib/Scenes/Consignments/v2/State/hooks"
import { AutosuggestResult } from "lib/Scenes/Search/AutosuggestResults"
import React from "react"
import { Text, View } from "react-native"

export const ArtistSearchResult: React.FC<{ result: AutosuggestResult }> = ({ result }) => {
  const artworkActions = useStoreActions(actions => actions.artwork)

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
          artworkActions.setArtistSearchResult(null)
        }}
      >
        <Sans size="3">Remove</Sans>
      </Button>
    </Flex>
  )
}
