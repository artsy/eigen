import { ActionSheetProps } from "@expo/react-native-action-sheet"
import { IconProps } from "palette"

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
}

export type ToastOptions = Omit<ToastDetails, "id" | "positionIndex" | "placement" | "message">
