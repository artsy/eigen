import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { AutosuggestResult } from "lib/Scenes/Search/AutosuggestResults"
import { ResultWithHighlight } from "lib/Scenes/Search/components/ResultWithHighlight"
import { SearchContext } from "lib/Scenes/Search/SearchContext"
import { Flex, Spacer, Touchable } from "palette"
import React, { useContext } from "react"

const IMAGE_SIZE = 40

export const ArtistAutosuggestRow: React.FC<{
  highlight: string
  result: AutosuggestResult
  onResultPress: (result: AutosuggestResult) => void
  itemIndex: number
}> = ({ result, highlight, onResultPress }) => {
  const { inputRef } = useContext(SearchContext)

  const onPress = () => {
    onResultPress(result)
    inputRef.current?.blur()
  }

  return (
    <Touchable onPress={onPress}>
      <Flex height={IMAGE_SIZE} flexDirection="row" alignItems="center">
        <OpaqueImageView
          imageURL={result.imageUrl}
          style={{
            width: IMAGE_SIZE,
            height: IMAGE_SIZE,
            overflow: "hidden",
          }}
        />

        <Spacer ml={1} />

        <Flex flex={1}>
          <ResultWithHighlight displayLabel={result.displayLabel!} highlight={highlight} />
        </Flex>
      </Flex>
    </Touchable>
  )
}
