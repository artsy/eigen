import { dismissModal } from "app/navigation/navigate"
import { Button } from "palette"
import { requireNativeComponent, View } from "react-native"

const ARTOldAdminView = requireNativeComponent("ARTOldAdminView")

export const Admin: React.FC = () => {
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
