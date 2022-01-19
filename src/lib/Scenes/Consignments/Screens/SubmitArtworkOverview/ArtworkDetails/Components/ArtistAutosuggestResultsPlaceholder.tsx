import { PlaceholderBox, RandomWidthPlaceholderText } from "lib/utils/placeholders"
import { times } from "lodash"
import { Flex } from "palette"
import React from "react"

const TEXT_SIZE = 12
const IMAGE_SIZE = 40

export const ArtistAutosuggestResultsPlaceholder: React.FC = () => {
  return (
    <Flex
      style={{
        flex: 1,
        borderStyle: "solid",
        borderColor: "#707070",
        borderWidth: 1,
        padding: 1,
        marginTop: 3,
        marginBottom: 1,
      }}
    >
      {times(20).map((index) => (
        <Flex key={`autosuggest-result-${index}`} flexDirection="row" mb={2}>
          <PlaceholderBox width={IMAGE_SIZE} height={IMAGE_SIZE} />
          <Flex flex={1} ml={1} justifyContent="center">
            <RandomWidthPlaceholderText minWidth={100} maxWidth={150} height={TEXT_SIZE} marginBottom={0} />
          </Flex>
        </Flex>
      ))}
    </Flex>
  )
}
