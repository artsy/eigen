import { IconProps } from "@artsy/icons/native"
import { Color } from "@artsy/palette-mobile"
import { ActionSheetProps } from "@expo/react-native-action-sheet"
import React from "react"

export type ToastDuration = "long" | "short" | "superLong"

export type ToastPlacement = "middle" | "top" | "bottom"

export interface ToastOnPressHelpers {
  id: number
  showActionSheetWithOptions: ActionSheetProps["showActionSheetWithOptions"]
}

export interface ToastDetails {
  id: number
  positionIndex: number

  placement: ToastPlacement
  message: string
  description?: string | React.ReactNode | null

  /* Display CTA for toasts with top or bottom placement */
  cta?: string

  onPress?: (helpers: ToastOnPressHelpers) => void
  hideOnPress?: boolean
  Icon?: React.FC<IconProps>
  imageURL?: string
  backgroundColor?: Color
  duration?: ToastDuration
  bottomPadding?: number | null
}

export type ToastOptions = Pick<
  ToastDetails,
  | "description"
  | "onPress"
  | "hideOnPress"
  | "Icon"
  | "backgroundColor"
  | "duration"
  | "cta"
  | "imageURL"
  | "bottomPadding"
>
