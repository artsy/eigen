import { apostrophe, quoteLeft, quoteRight, Text, Spacer, Box } from "@artsy/palette-mobile"
import { PillType } from "app/Scenes/Search/types"

interface SingleIndexEmptyResultsMessageProps {
  query: string
  selectedPill: PillType
}

export const SingleIndexEmptyResultsMessage: React.FC<SingleIndexEmptyResultsMessageProps> = ({
  query,
  selectedPill,
}) => {
  return (
    <Box px={2} py={1}>
      <Spacer y={4} />
      <Text variant="sm-display" textAlign="center">
        {`Sorry, we couldn${apostrophe}t find a ${selectedPill.displayName} for ${quoteLeft}${query}.${quoteRight}`}
      </Text>
      <Text variant="sm-display" color="black60" textAlign="center">
        Please try searching again with a different spelling.
      </Text>
    </Box>
  )
}
