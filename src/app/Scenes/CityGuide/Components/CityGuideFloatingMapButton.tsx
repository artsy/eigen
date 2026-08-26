import { Button, Flex } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
import { MotiView } from "moti"

export const CityGuideFloatingMapButton = () => {
  return (
    <MotiView
      from={{ opacity: 0.5, translateY: 0 }}
      animate={{ opacity: 1, translateY: -60 }}
      transition={{ type: "timing", duration: 300, delay: 200 }}
    >
      <Flex
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          bottom: -50,
          zIndex: 1000,
        }}
      >
        <Button
          onPress={() => {
            navigate("/local-discovery")
          }}
          size="small"
        >
          London Map
        </Button>
      </Flex>
    </MotiView>
  )
}
