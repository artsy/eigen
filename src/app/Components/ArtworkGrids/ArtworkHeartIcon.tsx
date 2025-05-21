import { Flex } from "@artsy/palette-mobile"
import { HEART_ICON_SIZE } from "app/Components/constants"
import LottieView from "lottie-react-native"
import { useEffect, useRef } from "react"

export const ArtworkHeartIconAnimation: React.FC<{ isSaved: boolean; testID?: string }> = ({
  isSaved,
  testID,
}) => {
  const initialRender = useRef(true)
  const animationRef = useRef<LottieView>(null)

  useEffect(() => {
    // Do not animate the first time the component is rendered
    if (initialRender.current) {
      return
    }

    if (isSaved) {
      animationRef.current?.play()
    } else {
      animationRef.current?.reset()
    }
  }, [isSaved, initialRender.current])

  useEffect(() => {
    initialRender.current = false
  }, [])

  return (
    <Flex height={HEART_ICON_SIZE} width={HEART_ICON_SIZE} testID={testID}>
      <LottieView
        ref={animationRef}
        progress={isSaved ? 1 : 0}
        source={require("animations/save-artwork.json")}
        duration={670}
        loop={false}
        style={{
          height: HEART_ICON_SIZE,
          width: HEART_ICON_SIZE,
          // Make sure the animation particles are not covered by any component
          zIndex: 1000,
        }}
        containerProps={{
          style: {
            backgroundColor: "red",
          },
        }}
        colorFilters={[
          {
            keypath: "button",
            color: "#F00000",
          },
          {
            keypath: "Sending Loader",
            color: "#F00000",
          },
        ]}
      />
      {/* This is just a temporary hack to hide the watermark until we buy the license */}
      {/* This is */}
      <Flex
        backgroundColor="white"
        zIndex={1000}
        position="absolute"
        right={0}
        bottom={0}
        width={10}
        height={2}
      ></Flex>
    </Flex>
  )
}
