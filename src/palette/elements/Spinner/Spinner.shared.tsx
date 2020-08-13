import { Color } from "../../Theme"

export interface SpinnerProps {
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
export const getSize = (props: SpinnerProps) => {
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
