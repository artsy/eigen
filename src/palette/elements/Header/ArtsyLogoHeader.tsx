import { ArtsyLogoBlackIcon, Spacer } from "@artsy/palette-mobile"
import { Box, Flex } from "palette"
import { StyleSheet } from "react-native"

interface Props {
  shadow?: boolean
}
export const ArtsyLogoHeader: React.FC<Props> = ({ shadow = false }) => (
  <>
    <Box mt={2} mb={1} style={shadow ? styles.boxShadowStyle : {}}>
      <Flex alignItems="center">
        <ArtsyLogoBlackIcon scale={0.75} />
      </Flex>
      <Spacer y="1" />
    </Box>
    <Spacer y="2" />
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
