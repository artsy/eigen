import { dismissModal } from "app/system/navigation/navigate"
import { Button } from "app/Components/Button"
import { requireNativeComponent, View } from "react-native"

const ARTOldAdminView = requireNativeComponent("ARTOldAdminView")

export const DevMenuOld = () => {
  const handleModalDismiss = () => {
    dismissModal()
  }

  return (
    <View style={{ flex: 1 }}>
      <Button size="small" onPress={handleModalDismiss}>
        close
      </Button>
      {/* @ts-ignore */}
      <ARTOldAdminView style={{ flex: 1 }} />
    </View>
  )
}
