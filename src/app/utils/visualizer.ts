import Clipboard from "@react-native-community/clipboard"
import { Toast } from "app/Components/Toast/Toast"
import { DevToggleName } from "app/store/config/features"
import { unsafe_getDevToggle } from "app/store/GlobalStore"

export const visualize = (
  type: string,
  name: string,
  info: { [key: string]: any },
  devToggle: DevToggleName
) => {
  if (!unsafe_getDevToggle(devToggle)) {
    return
  }

  const title = `${type}: ${name}`
  const message = JSON.stringify(info, null, 2)

  Toast.show(title, "top", {
    onPress: ({ showActionSheetWithOptions }) => {
      showActionSheetWithOptions(
        {
          title,
          message,
          options: ["Copy description", "Continue"],
          cancelButtonIndex: 1,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            Clipboard.setString(message)
          }
        }
      )
    },
  })
}
