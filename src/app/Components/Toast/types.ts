import { IconProps, Color } from "@artsy/palette-mobile"
import { ActionSheetProps } from "@expo/react-native-action-sheet"

export type ToastDuration = "long" | "short"

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
  description?: string | null

  /* Display CTA for toasts with top or bottom placement */
  cta?: string

  onPress?: (helpers: ToastOnPressHelpers) => void
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
  | "Icon"
  | "backgroundColor"
  | "duration"
  | "cta"
  | "imageURL"
  | "bottomPadding"
>
