import { ArtsyLogoIcon, Box, Flex, Spacer } from "palette"
import React from "react"
import { StyleSheet } from "react-native"

interface Props {
  shadow?: boolean
}
export const ArtsyLogoHeader: React.FC<Props> = ({ shadow = false }) => (
  <>
    <Box mt={2} mb={1} style={shadow ? styles.boxShadowStyle : {}}>
      <Flex alignItems="center">
        <ArtsyLogoIcon scale={0.75} />
      </Flex>
      <Spacer mb="1" />
    </Box>
    <Spacer mb="2" />
  </>
)

const styles = StyleSheet.create({
  boxShadowStyle: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 2.0,
    backgroundColor: "white",
    height: 40,
  },
})
