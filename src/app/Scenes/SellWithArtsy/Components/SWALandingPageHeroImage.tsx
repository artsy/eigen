import { Flex } from "@artsy/palette-mobile"
import { isPad } from "app/utils/hardware"
import { Image } from "react-native"
import { useScreenDimensions } from "shared/hooks"

export const SWALandingPageHeroImage = () => {
  // bunch of stuffs to make this header look good on an iPad
  const { width } = useScreenDimensions()
  const maxLayoutWidth = Math.min(width, 400)
  const isAPad = isPad()
  // if is a pad, then we must be using a maxWidth of 400
  // subtract half of 400 from half of width to get the right left offset
  const left = isAPad ? width / 2 - 200 : undefined
  //

  return (
    <Flex
      maxWidth={maxLayoutWidth}
      // using left on Pads to center the image mashup instead of alignSelf: center. alignSelf: center will push
      // all images to center and we will lose the intended non-linear placement of these images.
      left={left}
    >
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
