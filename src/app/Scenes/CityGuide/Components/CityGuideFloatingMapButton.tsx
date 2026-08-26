import { Button, Flex } from "@artsy/palette-mobile"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import { MotiView } from "moti"

export const CityGuideFloatingMapButton = ({
  cityName,
  citySlug,
}: {
  cityName: string
  citySlug: string
}) => {
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
            navigate("/local-discovery?citySlug=" + citySlug)
          }}
          size="small"
        >
          {cityName} Map
        </Button>
      </Flex>
    </MotiView>
  )
}
