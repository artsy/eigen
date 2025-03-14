/**
 * This code is adapted from an ISC licensed project.
 * Link: https://github.com/SvanBoxel/visibility-sensor-react-native/blob/master/src/index.tsx
 * Original author: 2020 Sebass van Boxel
 * Copyright 2020 Sebass van Boxel
 *
 * Modifications:
 * - children prop is now optional
 */

import { Flex } from "@artsy/palette-mobile"
import { useFocusEffect } from "@react-navigation/native"
import { debounce } from "lodash"
import { FC, ReactNode, useCallback, useRef, useState } from "react"
import { Dimensions, View } from "react-native"

export interface IDimensionData {
  rectTop: number
  rectBottom: number
  rectHeight: number
  rectWidth: number
}

export interface Props {
  /** Function that is triggered when component enters the viewport */
  onChange(visible: boolean): any
  /** The component that needs to be in the viewport */
  children?: ReactNode
  /** 1 means 100% 0.7 means 70% and so on, The value indicates the minimum percentage of the container to be considered visible. */
  threshold?: number
}

const RNView = View as any

export const Sentinel: FC<Props> = ({ children, onChange, threshold = 1 }) => {
  const myView: any = useRef(null)
  const [lastValue, setLastValue] = useState<boolean>(false)
  const [dimensions, setDimensions] = useState<IDimensionData>({
    rectTop: 0,
    rectBottom: 0,
    rectHeight: 0,
    rectWidth: 0,
  })

  let interval: any = null

  const handleVisibilityChange = debounce(onChange)

  useFocusEffect(
    useCallback(() => {
      setLastValue(false)

      startWatching()
      const subscription = Dimensions.addEventListener("change", isInViewPort)

      isInViewPort()

      return () => {
        stopWatching()
        subscription.remove()
      }
    }, [dimensions.rectTop, dimensions.rectBottom, dimensions.rectWidth])
  )

  const startWatching = () => {
    if (interval) {
      return
    }

    interval = setInterval(() => {
      if (!myView || !myView.current) {
        return
      }

      myView.current.measure(
        async (
          _x: number,
          _y: number,
          width: number,
          height: number,
          pageX: number,
          pageY: number
        ) => {
          setDimensions({
            rectTop: pageY,
            rectBottom: pageY + height,
            rectHeight: height,
            rectWidth: pageX + width,
          })
        }
      )
    }, 1000)
  }

  const stopWatching = () => {
    interval = clearInterval(interval)
  }

  const isInViewPort = () => {
    if (!myView?.current) return

    const windowDimensions = Dimensions.get("window")
    const { rectTop, rectBottom, rectHeight, rectWidth } = dimensions

    const visibleHeight = Math.min(rectBottom, windowDimensions.height) - Math.max(rectTop, 0)
    const visibility = (visibleHeight / rectHeight) * 100

    const isVisible =
      rectBottom !== 0 &&
      visibility >= threshold * 100 &&
      rectWidth > 0 &&
      rectWidth <= windowDimensions.width

    if (lastValue !== isVisible) {
      setLastValue(isVisible)
      handleVisibilityChange(isVisible)
    }
  }

  return (
    <RNView collapsable={false} ref={myView}>
      {children}
      <Flex height={0} />
    </RNView>
  )
}
