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
import { FC, ReactNode, useCallback, useRef, useState } from "react"
import { Dimensions, View } from "react-native"

const DEFAULT_THRESHOLD = 1

export interface IDimensionData {
  rectTop: number
  rectBottom: number
  rectWidth: number
  rectHeight: number
  width: number
  height: number
}

export interface Props {
  /** Function that is triggered when component enters the viewport */
  onChange(visible: boolean): any
  /** The component that needs to be in the viewport */
  children?: ReactNode
  /** The value indicates the minimum percentage of the container that must be visible (vertically or horizontally). A value of 1 means 100%, 0.7 means 70%, and so forth. The default value is 1 (100%). */
  threshold?: number
}

const RNView = View as any

export const Sentinel: FC<Props> = ({ children, onChange, threshold = DEFAULT_THRESHOLD }) => {
  const myView: any = useRef(null)
  const [lastValue, setLastValue] = useState<boolean>(false)
  const [dimensions, setDimensions] = useState<IDimensionData>({
    rectTop: 0,
    rectBottom: 0,
    rectWidth: 0,
    rectHeight: 0,
    width: 0,
    height: 0,
  })

  let interval: any = null

  useFocusEffect(
    useCallback(() => {
      setLastValue(false)
      startWatching()
      isInViewPort()
      return stopWatching
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
            rectWidth: pageX + width,
            rectHeight: pageY + height,
            width,
            height,
          })
        }
      )
    }, 1000)
  }

  const stopWatching = () => {
    interval = clearInterval(interval)
  }

  const isInViewPort = () => {
    const window = Dimensions.get("window")
    const isVisible =
      dimensions.rectBottom != 0 &&
      dimensions.rectTop >= 0 &&
      dimensions.rectBottom - dimensions.height * (1 - threshold) <= window.height &&
      dimensions.rectWidth > 0 &&
      dimensions.rectWidth - dimensions.width * (1 - threshold) <= window.width

    if (lastValue !== isVisible) {
      setLastValue(isVisible)
      onChange(isVisible)
    } else {
      onChange(isVisible)
    }
  }

  return (
    <RNView collapsable={false} ref={myView}>
      {children}
      <Flex height={0} />
    </RNView>
  )
}
