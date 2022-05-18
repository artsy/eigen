import { useColor } from "palette"
import React, { useEffect, useMemo } from "react"
import { Animated, Easing } from "react-native"
import styled from "styled-components/native"
import { SpinnerProps } from "./Spinner"

/**
 * Returns width, height, border width and radius of the circle spinner based on size
 * @param props
 */
const getSize = (props: SpinnerProps | CircleProps) => {
  const base = { width: 50, height: 50, radius: 25, borderWidth: 4 }

  switch (props.size) {
    case "small":
      return {
        width: base.width * 0.5,
        height: base.height * 0.5,
        radius: (base.width * 0.5) / 2,
        borderWidth: (base.width * 0.5) / 8,
      }
    case "medium":
      return {
        width: base.width * 0.8,
        height: base.height * 0.8,
        radius: (base.width * 0.8) / 2,
        borderWidth: (base.width * 0.8) / 8,
      }
    case "large":
      return {
        width: base.width,
        height: base.height,
        radius: base.width / 2,
        borderWidth: base.width / 8,
      }
    default:
      return {
        width: props.width,
        height: props.height,
        radius: props.width ? props.width / 2 : base.radius,
        borderWidth: props.width ? props.width / 8 : base.borderWidth,
      }
  }
}

/**
 * Circular Spinner component for React Native
 */
export const CircularSpinner: React.FC<SpinnerProps> = ({
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

  return (
    <>
      <CircleBackground size={size} color={color(theColor)} />
      <Circle size={size} color={color(theColor)} {...rest} style={style} />
    </>
  )
}

type CircleProps = Omit<SpinnerProps, "color"> & { color?: string }

/** Circle Spinner component */
const Circle = styled(Animated.View)<CircleProps>`
  background: black;
  position: absolute;

  ${(props) => {
    const { width, height, borderWidth, radius } = getSize(props)

    return `
      border: ${borderWidth}px solid ${props.color};
      border-radius: ${radius}px;
      border-right-color: transparent;

      background: transparent;

      width: ${width}px;
      height: ${height}px;
    `
  }};
`

/** Circle Background Spinner component */
const CircleBackground = styled(Animated.View)<CircleProps>`
  background: black;
  position: absolute;

  ${(props) => {
    const { width, height, borderWidth, radius } = getSize(props)

    return `
      opacity: 0.4;
      border: ${borderWidth}px solid ${props.color};
      border-radius: ${radius}px;
      background: transparent;

      width: ${width}px;
      height: ${height}px;
    `
  }};
`

Circle.defaultProps = {
  width: 50,
  height: 50,
}
