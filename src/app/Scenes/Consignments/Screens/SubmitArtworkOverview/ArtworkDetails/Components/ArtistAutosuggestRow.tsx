import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { AutosuggestResult } from "app/Scenes/Search/AutosuggestResults"
import { ResultWithHighlight } from "app/Scenes/Search/components/ResultWithHighlight"
import { Box, Flex, Spacer } from "palette"
import React from "react"

const IMAGE_SIZE = 40

interface Props {
  highlight: string
  result: AutosuggestResult
  onResultPress: (result: AutosuggestResult) => void
}

export const ArtistAutosuggestRow: React.FC<Props> = ({ result, highlight, onResultPress }) => (
  <Box onTouchStart={() => onResultPress(result)}>
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
  </Box>
)
