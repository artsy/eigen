import { ArtsyLogoIcon, Box, Flex, Spacer } from "palette"
import React from "react"

export const ArtsyLogoHeader: React.FC = ({}) => (
  <>
    <Box
      mt={2}
      mb={1}
      style={{
        shadowColor: "black",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 2.0,
        backgroundColor: "white",
        height: 40,
      }}
    >
      <Flex alignItems="center">
        <ArtsyLogoIcon scale={0.75} />
      </Flex>
      <Spacer mb="1" />
    </Box>
    <Spacer mb="2" />
  </>
)
