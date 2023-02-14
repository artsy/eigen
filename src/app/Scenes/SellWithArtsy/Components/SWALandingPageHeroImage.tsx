import { Flex } from "@artsy/palette-mobile"
import { Image } from "react-native"

export const SWALandingPageHeroImage = () => {
  return (
    <Flex>
      <Image source={require("images/swa-landing-page-one.png")} style={{ alignSelf: "center" }} />
      <Image
        source={require("images/swa-landing-page-two.png")}
        style={{ position: "absolute", bottom: 0 }}
      />
      <Image
        source={require("images/swa-landing-page-three.png")}
        style={{ position: "absolute", alignSelf: "flex-end", bottom: 0 }}
      />
    </Flex>
  )
}
