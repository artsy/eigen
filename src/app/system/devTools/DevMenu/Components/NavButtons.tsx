import { Flex, Join, Spacer, LogoutIcon, ReloadIcon, CloseIcon } from "@artsy/palette-mobile"
import { GlobalStore } from "app/store/GlobalStore"
import { RelayCache } from "app/system/relay/RelayCache"
import { TouchableOpacity, Alert, DevSettings } from "react-native"

export const NavButtons: React.FC<{ onClose(): void }> = ({ onClose }) => {
  const isLoggedIn = !!GlobalStore.useAppState((state) => !!state.auth.userID)

  return (
    <Flex style={{ flexDirection: "row", alignItems: "center" }} pb={2} px={2}>
      <Join separator={<Spacer x={2} />}>
        {!!isLoggedIn && (
          <TouchableOpacity
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
            onPress={() => {
              RelayCache.clearAll()
              onClose()
              requestAnimationFrame(() => DevSettings.reload())
            }}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <ReloadIcon width={20} height={20} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onClose} hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CloseIcon width={24} height={24} />
        </TouchableOpacity>
      </Join>
    </Flex>
  )
}
