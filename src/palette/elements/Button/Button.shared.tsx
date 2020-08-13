import { ReactNode } from "react"
import { css } from "styled-components"
import { themeProps } from "../../Theme"
import { BoxProps } from "../Box"

/**
 * Spec: zpl.io/2j8Knq6
 */

/** Different theme variations */
export type ButtonVariant =
  | "primaryBlack"
  | "primaryWhite"
  | "secondaryGray"
  | "secondaryOutline"
  | "noOutline"
/** Default button color variant */
export const defaultVariant: ButtonVariant = "primaryBlack"

/** The size of the button */
export type ButtonSize = "small" | "medium" | "large"

/** Default button size */
export const defaultSize: ButtonSize = "medium"

export interface ButtonProps extends ButtonBaseProps {
  children: ReactNode
  /** The size of the button */
  size?: ButtonSize
  /** The theme of the button */
  variant?: ButtonVariant
  /** React Native only, Callback on press, use instead of onClick */
  onPress?: (e) => void
}

export interface ButtonBaseProps extends BoxProps {
  /** Size of the button */
  buttonSize?: ButtonSize
  /** Displays a loader in the button */
  loading?: boolean
  /** Disabled interactions */
  disabled?: boolean
  /** Uses inline style for button */
  inline?: boolean
  /** Makes button full width */
  block?: boolean
  /** Callback on click */
  onClick?: (e) => void
  /** Additional styles to apply to the variant */
  variantStyles?: any // FIXME
  /** Pass the longest text to the button for the button to keep longest text width */
  longestText?: string
}

/**
 * Returns various colors for each state given a button variant
 * @param variant
 */
export function getColorsForVariant(variant: ButtonVariant) {
  const {
    colors: { black100, black10, black30, white100, purple100 },
  } = themeProps

  switch (variant) {
    case "primaryBlack":
      return {
        default: {
          backgroundColor: black100,
          borderColor: black100,
          color: white100,
        },
        hover: {
          backgroundColor: purple100,
          borderColor: purple100,
          color: white100,
        },
      }
    case "primaryWhite":
      return {
        default: {
          backgroundColor: white100,
          borderColor: white100,
          color: black100,
        },
        hover: {
          backgroundColor: purple100,
          borderColor: purple100,
          color: white100,
        },
      }
    case "secondaryGray":
      return {
        default: {
          backgroundColor: black10,
          borderColor: black10,
          color: black100,
        },
        hover: {
          backgroundColor: black30,
          borderColor: black30,
          color: black100,
        },
      }
    case "secondaryOutline":
      return {
        default: {
          backgroundColor: white100,
          borderColor: black10,
          color: black100,
        },
        hover: {
          backgroundColor: white100,
          borderColor: black100,
          color: black100,
        },
      }
    case "noOutline":
      return {
        default: {
          backgroundColor: "rgba(0, 0, 0, 0)",
          borderColor: "rgba(0, 0, 0, 0)",
          color: black100,
        },
        hover: {
          backgroundColor: white100,
          borderColor: black100,
          color: black100,
        },
      }
    default:
  }
}

/**
 * Returns css related to the passed in variant
 * @param variant
 */
export const getStylesForVariant = (variant: ButtonVariant) => {
  const { default: enabled, hover } = getColorsForVariant(variant)

  return css`
    ${() => {
      return `
          background-color: ${enabled.backgroundColor};
          border-color: ${enabled.borderColor};
          color: ${enabled.color};

          @media ${themeProps.mediaQueries.hover} {
            &:hover {
              background-color: ${hover.backgroundColor};
              border-color: ${hover.borderColor};
              color: ${hover.color};
            }
          }
        `
    }};
  `
}
