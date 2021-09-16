import { ActionSheetProvider } from "@expo/react-native-action-sheet"
import { Theme } from "palette"
import { usePaletteFlagStore } from "palette/PaletteFlag"
import React, { ReactNode } from "react"
import { Button, View } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { RelayEnvironmentProvider } from "relay-hooks"
import { _FancyModalPageWrapper } from "./Components/FancyModal/FancyModalContext"
import { PopoverMessageProvider } from "./Components/PopoverMessage/PopoverMessageProvider"
import { ToastProvider } from "./Components/Toast/toastHook"
import { defaultEnvironment } from "./relay/createEnvironment"
import { GlobalStoreProvider, useDevToggle } from "./store/GlobalStore"
import { NetworkAwareProvider } from "./utils/NetworkAwareProvider"
import { ProvideScreenDimensions } from "./utils/useScreenDimensions"

// TODO-PALETTE-V3 this can be removed after we turn things to v3 by default
const V3Toggle: React.FC = ({ children }) => {
  const showToggle = useDevToggle("DTShowV3Toggle")
  const { allowV3, toggleAllowV3 } = usePaletteFlagStore()

  return (
    <>
      {children}
      {showToggle ? (
        <View style={{ position: "absolute", right: 0, top: 300 }}>
          <Button title={allowV3 ? "v3" : "v2"} onPress={toggleAllowV3} color={allowV3 ? "green" : "red"} />
        </View>
      ) : null}
    </>
  )
}

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <RelayEnvironmentProvider environment={defaultEnvironment}>
    <SafeAreaProvider>
      <ProvideScreenDimensions>
        <GlobalStoreProvider>
          <Theme>
            <ActionSheetProvider>
              <PopoverMessageProvider>
                <NetworkAwareProvider>
                  <_FancyModalPageWrapper>
                    <ToastProvider>
                      <V3Toggle>
                        {/*  */}
                        {children}
                        {/*  */}
                      </V3Toggle>
                    </ToastProvider>
                  </_FancyModalPageWrapper>
                </NetworkAwareProvider>
              </PopoverMessageProvider>
            </ActionSheetProvider>
          </Theme>
        </GlobalStoreProvider>
      </ProvideScreenDimensions>
    </SafeAreaProvider>
  </RelayEnvironmentProvider>
)
