import { PlaceholderBox, RandomWidthPlaceholderText } from "app/utils/placeholders"
import { times } from "lodash"
import { Box, Flex } from "palette"
import React from "react"
import { IMAGE_SIZE } from "../SearchResultImage"

const TEXT_SIZE = 12

interface AutosuggestResultsPlaceholderProps {
  showResultType?: boolean
}

export const AutosuggestResultsPlaceholder: React.FC<AutosuggestResultsPlaceholderProps> = ({
  showResultType,
}) => {
  return (
    <Box p={2} accessibilityLabel="Autosuggest results are loading">
      {times(20).map((index) => (
        <Flex key={`autosuggest-result-${index}`} flexDirection="row" mb={2}>
          <PlaceholderBox width={IMAGE_SIZE} height={IMAGE_SIZE} borderRadius={IMAGE_SIZE / 2} />
          <Flex flex={1} ml={1} justifyContent="center">
            <RandomWidthPlaceholderText
              minWidth={100}
              maxWidth={150}
              height={TEXT_SIZE}
              marginBottom={0}
            />
            {!!showResultType && (
              <RandomWidthPlaceholderText
                minWidth={50}
                maxWidth={100}
                height={TEXT_SIZE}
                marginTop={5}
                marginBottom={0}
              />
            )}
          </Flex>
        </Flex>
      ))}
    </Box>
  )
}
