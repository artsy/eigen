import { ActionSheetProps } from "@expo/react-native-action-sheet"
import { Color, IconProps } from "palette"

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

  onPress?: (helpers: ToastOnPressHelpers) => void
  Icon?: React.FC<IconProps>
  backgroundColor?: Color
  duration?: ToastDuration
}

export type ToastOptions = Pick<ToastDetails, "onPress" | "Icon" | "backgroundColor" | "duration">
