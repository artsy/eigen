import React, { useEffect, useMemo, useState } from "react"
import { Animated, ImageBackground, ImageProps } from "react-native"

import { Spinner } from "@artsy/palette"

export const ImageWithLoadingState: React.FC<ImageProps> = ({ ...props }) => {
  const [isLoading, setIsLoading] = useState(true)
  const overlayOpacity = useMemo(() => new Animated.Value(1), [])
  useEffect(
    () => {
      Animated.spring(overlayOpacity, {
        toValue: 0,
        useNativeDriver: true,
      }).start()
    },
    [isLoading]
  )

  // show spinner only after a short delay, if the image is taking a while to load
  const spinnerOpacity = useMemo(() => new Animated.Value(0), [])
  useEffect(() => {
    setTimeout(() => {
      Animated.spring(spinnerOpacity, {
        toValue: 1,
        useNativeDriver: true,
      })
    }, 400)
  }, [])

  return (
    <ImageBackground {...props} onLoadEnd={setIsLoading.bind(null, false)}>
      <Animated.View style={{ backgroundColor: "white", opacity: overlayOpacity }}>
        <Animated.View style={{ alignItems: "center", justifyContent: "center", opacity: spinnerOpacity }}>
          <Spinner />
        </Animated.View>
      </Animated.View>
    </ImageBackground>
  )
}
