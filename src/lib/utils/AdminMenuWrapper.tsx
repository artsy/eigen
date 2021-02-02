import AsyncStorage from "@react-native-community/async-storage"
import { MenuItem } from "lib/Components/MenuItem"
import { CloseIcon, Flex, Text } from "palette"
import React, { useRef, useState } from "react"
import { DevSettings, ScrollView, TouchableOpacity, View } from "react-native"
import { useScreenDimensions } from "./useScreenDimensions"

export const AdminMenuWrapper: React.FC = ({ children }) => {
  const [isShowingAdminMenu, setIsShowingAdminMenu] = useState(false)
  const gestureState = useRef({ lastTapTimestamp: 0, numTaps: 0 })
  // TODO: if public release, just return <>{children}</>
  return (
    <View
      onStartShouldSetResponderCapture={() => {
        const now = Date.now()
        const state = gestureState.current

        if (now - state.lastTapTimestamp < 500) {
          state.numTaps += 1
        } else {
          state.numTaps = 1
        }

        state.lastTapTimestamp = now

        if (state.numTaps >= 5) {
          state.numTaps = 0
          setIsShowingAdminMenu(true)
        }
        return false
      }}
      style={{ flex: 1 }}
    >
      {children}
      {!!isShowingAdminMenu && <AdminMenu onClose={() => setIsShowingAdminMenu(false)} />}
    </View>
  )
}

const AdminMenu: React.FC<{ onClose(): void }> = ({ onClose }) => {
  return (
    <Flex
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "lightcoral",
      }}
      px="2"
      pb="2"
      pt={useScreenDimensions().safeAreaInsets.top + 20}
    >
      <Text color="white" variant="largeTitle" pb="2">
        Admin Settings
      </Text>
      <ScrollView
        style={{ flex: 1, backgroundColor: "white", borderRadius: 4, overflow: "hidden" }}
        contentContainerStyle={{ paddingVertical: 10 }}
      >
        <MenuItem
          title="Clear AsyncStorage"
          onPress={() => {
            AsyncStorage.clear()
          }}
        />
        {!!__DEV__ && (
          <MenuItem
            title="Clear AsyncStorage and reload"
            onPress={() => {
              AsyncStorage.clear()
              DevSettings.reload()
            }}
          />
        )}
      </ScrollView>
      <CloseButton onPress={onClose} />
    </Flex>
  )
}

const CloseButton: React.FC<{ onPress(): void }> = ({ onPress }) => {
  return (
    <View
      style={{
        position: "absolute",
        top: 17,
        right: 17,
        backgroundColor: "white",
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TouchableOpacity onPress={onPress}>
        <CloseIcon />
      </TouchableOpacity>
    </View>
  )
}
