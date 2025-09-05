import { ChevronRightIcon } from "@artsy/icons/native"
import { Flex, Box } from "@artsy/palette-mobile"

export const ArrowDetails: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Flex flexDirection="row" justifyContent="space-between" width="100%" alignItems="center">
      <Box>{children}</Box>
      <ChevronRightIcon />
    </Flex>
  )
}
