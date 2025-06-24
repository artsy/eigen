import Clipboard from "@react-native-clipboard/clipboard"
import { Toast } from "app/Components/Toast/Toast"
import { unsafe_getDevToggle } from "app/store/GlobalStore"
import { DevToggleName } from "app/store/config/features"
import { __unsafe__useAndroidActionSheetStyles } from "app/utils/hooks/useAndroidActionSheetStyles"

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
          ...__unsafe__useAndroidActionSheetStyles(),
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
