import { useColor } from "palette"
import React, { useEffect, useMemo } from "react"
import { Animated, Easing, ViewProps } from "react-native"
import styled from "styled-components/native"
import { Color } from "../../Theme"

export interface SpinnerProps extends ViewProps {
  /** Delay before spinner appears */
  delay?: number
  /** Width of the spinner */
  width?: number
  /** Height of the spinner */
  height?: number
  /** Size of the spinner */
  size?: "small" | "medium" | "large"
  /** Color of the spinner */
  color?: Color
}

/**
 * Returns width and height of spinner based on size
 * @param props
 */
export const getSize = (props: SpinnerProps | BarProps) => {
  const base = { width: 25, height: 6 }

  switch (props.size) {
    case "small":
      return {
        width: base.width * 0.5,
        height: base.height * 0.5,
      }
    case "medium":
      return {
        width: base.width * 0.8,
        height: base.height * 0.8,
      }
    case "large":
      return {
        width: base.width,
        height: base.height,
      }
    default:
      return {
        width: props.width,
        height: props.height,
      }
  }
}

/**
 * Spinner component for React Native
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = "medium",
  color: theColor = "black100",
  ...rest
}) => {
  const color = useColor()
  const rotation = useMemo(() => new Animated.Value(0), [])

  const startRotation = () => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      {
        iterations: -1,
      }
    ).start()
  }

  useEffect(() => {
    startRotation()
  }, [])

  const style = [
    {
      transform: [
        {
          rotate: rotation.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "360deg"],
          }),
        },
      ],
    },
    rest.style,
  ]

  return <Bar size={size} color={color(theColor)} {...rest} style={style} />
}

type BarProps = Omit<SpinnerProps, "color"> & { color?: string }

/** Generic Spinner component */
const Bar = styled(Animated.View)<BarProps>`
  background: black;
  position: absolute;

  ${(props) => {
    const { width, height } = getSize(props)

    return `
      background: ${props.color};
      width: ${width}px;
      height: ${height}px;
    `
  }};
`

Bar.defaultProps = {
  width: 25,
  height: 6,
}
