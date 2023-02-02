import { ArrowRightIcon } from "@artsy/palette-mobile"
import { Box, Flex } from "palette"

export const ArrowDetails: React.FC = ({ children }) => {
  return (
    <Flex flexDirection="row" justifyContent="space-between" width="100%" alignItems="center">
      <Box>{children}</Box>
      <ArrowRightIcon />
    </Flex>
  )
}
