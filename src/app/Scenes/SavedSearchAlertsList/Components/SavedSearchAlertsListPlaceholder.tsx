import { Flex, Box, Separator } from "@artsy/palette-mobile"
import { PlaceholderText } from "app/utils/placeholders"
import { times } from "lodash"

export const SavedSearchAlertsListPlaceholder: React.FC = () => {
  return (
    <>
      <Box py={1}>
        {times(20).map((index: number) => (
          <Box key={index}>
            <Flex m={2}>
              <PlaceholderText width={200 + Math.round(Math.random() * 100)} height={23} />
              <PlaceholderText width={200 + Math.round(Math.random() * 100)} height={23} />
            </Flex>
            <Separator borderColor="mono5" />
          </Box>
        ))}
      </Box>
    </>
  )
}
