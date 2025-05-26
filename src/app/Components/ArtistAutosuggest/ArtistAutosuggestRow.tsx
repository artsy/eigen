import { Spacer, Flex, Image } from "@artsy/palette-mobile"
import { AutosuggestResult } from "app/Components/AutosuggestResults/AutosuggestResults"
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
      accessibilityRole="button"
      onPress={() => onResultPress(result)}
      testID={`artist-suggestion-${result.internalID}`}
    >
      <Flex height={IMAGE_SIZE} flexDirection="row" alignItems="center">
        {!!result.imageUrl && (
          <Image
            src={result.imageUrl}
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}
            style={{
              overflow: "hidden",
            }}
          />
        )}
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
