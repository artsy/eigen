import { ArtsyLogoIcon, Box, Flex, Separator, Spacer } from "palette"
import React from "react"

export const ArtsyLogoHeader: React.FC = ({}) => (
  <Box mb={1} mt={2}>
    <Flex alignItems="center">
      <ArtsyLogoIcon scale={0.75} />
    </Flex>
    <Spacer mb="1" />
    <Separator />
    <Spacer mb="2" />
  </Box>
)
