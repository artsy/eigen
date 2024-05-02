import { Spacer, Flex } from "@artsy/palette-mobile"
import { AutosuggestResult } from "app/Components/AutosuggestResults/AutosuggestResults"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { ResultWithHighlight } from "app/Scenes/Search/components/ResultWithHighlight"
import { TouchableWithoutFeedback } from "react-native"

const IMAGE_SIZE = 40

interface Props {
  highlight: string
  result: AutosuggestResult
  onResultPress: (result: AutosuggestResult) => void
}

export const ArtistAutosuggestRow: React.FC<Props> = ({ result, highlight, onResultPress }) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => onResultPress(result)}
      testID={`artist-suggestion-${result.internalID}`}
    >
      <Flex height={IMAGE_SIZE} flexDirection="row" alignItems="center">
        <OpaqueImageView
          imageURL={result.imageUrl}
          style={{
            width: IMAGE_SIZE,
            height: IMAGE_SIZE,
            overflow: "hidden",
          }}
        />
        <Spacer x={1} />
        <Flex flex={1}>
          {!!result.displayLabel && (
            <ResultWithHighlight displayLabel={result.displayLabel} highlight={highlight} />
          )}
        </Flex>
      </Flex>
    </TouchableWithoutFeedback>
  )
}
