import { CloseIcon, Flex, Join, LogoutIcon, ReloadIcon, Spacer } from "@artsy/palette-mobile"
import { GlobalStore } from "app/store/GlobalStore"
import { _globalCacheRef } from "app/system/relay/defaultEnvironment"
import { Alert, DevSettings, TouchableOpacity } from "react-native"

export const NavButtons: React.FC<{ onClose(): void }> = ({ onClose }) => {
  const isLoggedIn = !!GlobalStore.useAppState((state) => !!state.auth.userID)

  return (
    <Flex style={{ flexDirection: "row", alignItems: "center" }}>
      <Join separator={<Spacer x={2} />}>
        {!!isLoggedIn && (
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => {
              Alert.alert("Log out", undefined, [
                {
                  text: "Log out",
                  onPress() {
                    GlobalStore.actions.auth.signOut()
                  },
                },
                {
                  text: "Cancel",
                  style: "destructive",
                },
              ])
            }}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <LogoutIcon fill="red100" width={24} height={24} />
          </TouchableOpacity>
        )}

        {!!__DEV__ && (
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => {
              _globalCacheRef?.clear()
              onClose()
              requestAnimationFrame(() => DevSettings.reload())
            }}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <ReloadIcon width={20} height={20} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          accessibilityRole="button"
          onPress={onClose}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CloseIcon width={24} height={24} />
        </TouchableOpacity>
      </Join>
    </Flex>
  )
}
